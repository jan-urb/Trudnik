import { spawn } from 'child_process';
import z from "zod";
import "dotenv/config";
import db from "./db.js";
import { getCompanyCareerWebsiteQuery, getCategoryQuery } from "./Queries/getQueries.js";
import { insertJobsQuery } from "./Queries/insertQueries.js";
import { updateCompanyLastCheckedAtQuery, deactivateCompanyJobsQuery } from "./Queries/updateQueries.js";
import TurndownService from "turndown";
import * as cheerio from 'cheerio';
import puppeteer from "puppeteer";
import Anthropic from '@anthropic-ai/sdk'

const CONFIG = {
    AI_MODEL: "claude-sonnet-5-5",
    PYTHON_SCRIPT: "./python/GetJobs.py",
    MAX_CONSECUTIVE_FAILURES: 3,
};

const REQUIRED_ENV_VARS = [
    'ANTHROPIC_API_KEY'
];

// Validate required environment variables
for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}

const categories = (await db.query(getCategoryQuery())).rows;

// Fallback category when AI returns none; looked up by name, 13 if not found
const OTHER_CATEGORY_ID = categories.find(c => ["other", "drugo", "ostalo"].includes(c.name.toLowerCase()))?.id ?? 13;

const JOB_DETAILS_EXTRACTION_PROMPT = `Analyze the provided markdown data and extract the following job information only for the provided job title:
- Requirements for the job position (Pričakovanja)
- Responsibilities for the job position (Naloge, odgovornosti)
- Category: Choose a category for the job position from the following list: ${categories.map((category) => category.name).join(", ")}
- Technologies: From the text find the list of technologies required for the job position. Max 10 technologies, but can be less.

The page may list several jobs - use only the part about the provided job title.

Rules:
1. If a value cannot be found in any source, return null for that field.
2. Do not guess, infer, estimate, or derive values that are not explicitly present in the data.
3. Use only the information explicitly present in the provided sources.
4. All fields must be present and either contain a value or null.`;


const IT_JOB_CLASSIFICATION_PROMPT = `You are given a numbered list of job titles. Return the numbers of the titles that are IT-related.
IT-related means work in software, data, digital solutions, IT systems, cloud, cybersecurity, DevOps, or agile IT roles.
If none are IT-related, return an empty list.`;


const ItJobsSchema = z.object({
    itJobIndexes: z.array(z.number()).describe("Numbers of the IT-related job titles"),
});

const JobDetailsSchema = z.object({
    requirements: z.string().nullable().describe("Requirements for the job position"),
    responsibilities: z.string().nullable().describe("Responsibilities for the job position"),
    technologies: z.array(z.string()).nullable().describe("Technologies required for the job position"),
    category: z.enum(categories.map((category) => category.name)).nullable().describe("Category of the job position"),
});

const anthropicClient = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"],
    timeout: 120_000,
});


function jsonSchemaFormat(zodSchema) {
    const { $schema, ...schema } = z.toJSONSchema(zodSchema);
    return { type: "json_schema", schema };
}

// Thrown when the Anthropic API itself is failing - stops the whole run so no more browser-use runs are wasted
class FatalApiError extends Error { }

// The SDK already retries 429/5xx/connection errors, so a thrown API error is persistent.
// 400/413 can be caused by one specific page (e.g. input too long), so those only skip the job.
function isFatalApiError(error) {
    if (error instanceof Anthropic.APIConnectionError) return true;
    return error instanceof Anthropic.APIError && error.status !== 400 && error.status !== 413;
}


function preprocessHTML(html) {
    const turndown = new TurndownService();
    const $ = cheerio.load(html);

    // Remove non-content elements
    $("script, style, noscript, iframe, svg, link, meta").remove();
    $("header, footer, nav").remove();
    $(".popup, .floating-bar, .breadcrumbs, .slick-dots").remove();
    $("[style*='display:none'], [style*='display: none'], [hidden]").remove();
    $("img").remove();
    $(".bp-small-max").remove();

    // Get just the body content
    const bodyContent = $("body").html() || $.html();
    const markdown = turndown.turndown(bodyContent);
    return markdown;
}


/**
 * Calls Claude with structured output and validates the JSON with the zod schema.
 * Returns the parsed object, or null if the answer was unusable. Throws FatalApiError if the API itself fails.
 */
async function callClaudeJson({ label, system, content, effort, maxTokens, schema }) {
    let response;
    try {
        response = await anthropicClient.messages.create({
            model: CONFIG.AI_MODEL,
            max_tokens: maxTokens,
            system,
            messages: [
                {
                    role: "user",
                    content
                }
            ],
            output_config: { effort, format: jsonSchemaFormat(schema) }
        });
    } catch (error) {
        if (isFatalApiError(error)) {
            throw new FatalApiError(`Anthropic ${label} failed: ${error.message}`);
        }
        console.error(`Anthropic ${label} failed:`, error.message);
        return null;
    }

    if (response.stop_reason !== "end_turn") {
        console.warn(`Anthropic ${label}: unusable answer (stop_reason: ${response.stop_reason})`);
        return null;
    }

    const text = response.content.filter(block => block.type === "text").map(block => block.text).join("");
    try {
        const result = schema.safeParse(JSON.parse(text));
        if (result.success) return result.data;
        console.warn(`Anthropic ${label}: answer does not match schema:`, result.error.message);
    } catch (error) {
        console.warn(`Anthropic ${label}: answer is not valid JSON:`, text.slice(0, 200));
    }
    return null;
}

/**
 * Classifies all job titles of a company in one call
 * Returns the IT-related jobs, or null if the AI call failed
 */
async function filterITRelatedJobs(jobs) {
    const numberedTitles = jobs.map((job, index) => `${index}: ${job.title}`).join("\n");

    const result = await callClaudeJson({
        label: "IT classification",
        system: IT_JOB_CLASSIFICATION_PROMPT,
        content: numberedTitles,
        effort: "low",
        maxTokens: 2000,
        schema: ItJobsSchema,
    });
    if (!result) return null;

    const indexes = new Set(result.itJobIndexes.filter(Number.isInteger));
    return jobs.filter((_, index) => indexes.has(index));
}

async function fetchPageHtml(browser, url) {
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        const html = await page.content();
        return html;
    } catch (error) {
        console.error(`Failed to get html from page: ${url}`, error.message);
        return null;
    }
    finally {
        await page.close();
    }
}

async function extractJobDetails(markdown, jobTitle) {
    return callClaudeJson({
        label: `extraction for "${jobTitle}"`,
        system: JOB_DETAILS_EXTRACTION_PROMPT,
        content: `Job title: ${jobTitle}\n\nPage content (markdown):\n${markdown}`,
        effort: "medium",
        maxTokens: 15000,
        schema: JobDetailsSchema,
    });
}


async function executePython(scriptPath, jobs_page_url) {
    const python = spawn('uv', ['run', 'python3', scriptPath, jobs_page_url], {
        stdio: ['pipe', 'pipe', 'inherit']
    });

    let output = "";

    for await (const chunk of python.stdout) {
        output += chunk.toString();
    }

    const exitCode = await new Promise(resolve => {
        python.on('close', resolve);
    });

    if (exitCode !== 0) {
        throw new Error(`Python exited with code ${exitCode}`);
    }

    const lines = output.trim().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('[') || line.startsWith('{')) {
            try {
                return JSON.parse(line);
            } catch (e) {
                // not valid JSON, keep searching
            }
        }
    }

    console.warn("No valid JSON found in Python output");
    return [];
}

/**
 * Python prints {"jobs": [...]} or [] - normalise to a list of { title, url } with an http(s) url
 */
function normalizeJobs(pythonResult) {
    const jobs = Array.isArray(pythonResult) ? pythonResult : pythonResult?.jobs;
    if (!Array.isArray(jobs)) return [];

    return jobs.filter(job => {
        if (typeof job?.title !== "string" || !job.title.trim()) return false;
        try {
            const url = new URL(job.url);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch {
            return false;
        }
    });
}

/**
 * Lists jobs with the Python agent, keeps IT jobs and extracts their details.
 * Throws if the job list could not be collected (so the company is not marked as checked).
 */
async function scrapeJobsForCompany(browser, careerPage) {
    const jobs = normalizeJobs(await executePython(CONFIG.PYTHON_SCRIPT, careerPage));
    console.log(`Found ${jobs.length} jobs`);
    if (jobs.length === 0) return [];

    const itJobs = await filterITRelatedJobs(jobs);
    if (itJobs === null) {
        throw new Error("IT classification failed");
    }
    console.log(`${itJobs.length} of them are IT-related`);

    const htmlCache = new Map();
    const jobDetails = [];

    for (const job of itJobs) {
        try {
            if (!htmlCache.has(job.url)) {
                htmlCache.set(job.url, await fetchPageHtml(browser, job.url));
            }
            const html = htmlCache.get(job.url);
            if (!html) continue;

            const markdown = preprocessHTML(html);
            const jobDetail = await extractJobDetails(markdown, job.title);
            if (!jobDetail) continue;

            jobDetails.push({
                title: job.title,
                url: job.url,
                requirements: jobDetail.requirements,
                responsibilities: jobDetail.responsibilities,
                category: jobDetail.category,
                technologies: jobDetail.technologies
            });
        } catch (error) {
            if (error instanceof FatalApiError) throw error;
            console.error(`Failed to process job "${job.title}":`, error.message);
        }
    }

    return jobDetails;
}


/**
 * Replaces the company's active jobs with the newly scraped ones and marks the company as checked.
 */
async function saveCompanyJobs(companyId, jobs) {
    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const deactivate = deactivateCompanyJobsQuery(companyId);
        await client.query(deactivate.text, deactivate.values);

        for (const job of jobs) {
            const categoryObject = categories.find(c => c.name === job.category);
            const categoryId = categoryObject ? categoryObject.id : OTHER_CATEGORY_ID;
            const { text, values } = insertJobsQuery(companyId, job.title, job.requirements, job.responsibilities, job.url, job.technologies, categoryId);
            await client.query(text, values);
        }

        const checked = updateCompanyLastCheckedAtQuery(companyId);
        await client.query(checked.text, checked.values);

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}


async function main() {
    // Preflight: fail on a bad API key or unknown model before any browser-use run
    try {
        await anthropicClient.models.retrieve(CONFIG.AI_MODEL);
    } catch (error) {
        console.error(`Anthropic preflight failed for model "${CONFIG.AI_MODEL}":`, error.message);
        process.exitCode = 1;
        return;
    }

    const browser = await puppeteer.launch();
    let consecutiveFailures = 0;

    try {
        const { text, values } = getCompanyCareerWebsiteQuery();
        const result = await db.query(text, values);
        const companies = result.rows;
        console.log(`Found ${companies.length} companies to process\n`);

        if (companies.length === 0) {
            console.log("No companies found");
            return;
        }
        for (let i = 0; i < companies.length; i++) {
            const company = companies[i];
            const progress = `[${i + 1}/${companies.length}]`;
            console.log(`\n${progress} Processing: ${company.company_name}`);

            try {
                const jobs = await scrapeJobsForCompany(browser, company.career_page);

                for (const job of jobs) {
                    console.log(job.title, "\n", job.requirements, "\n", job.responsibilities, "\n", job.technologies, "\n", job.category);
                    console.log("\n");
                }

                await saveCompanyJobs(company.id, jobs);
                consecutiveFailures = 0;

            } catch (error) {
                console.error(`Error processing ${company.company_name}, not marking as checked:`, error.message);

                if (error instanceof FatalApiError) {
                    throw new Error(`Stopping run - Anthropic API is failing (last company: ${company.company_name})`);
                }
                consecutiveFailures++;
                if (consecutiveFailures >= CONFIG.MAX_CONSECUTIVE_FAILURES) {
                    throw new Error(`Stopping run - ${consecutiveFailures} companies failed in a row (last company: ${company.company_name})`);
                }
            }
        }
    } catch (error) {
        console.error("Error: ", error.message);
        process.exitCode = 1;
    }
    finally {
        await browser.close();
    }
}

await main();
