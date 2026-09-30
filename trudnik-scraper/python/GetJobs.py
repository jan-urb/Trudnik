from browser_use import Agent, Browser, ChatBrowserUse, Tools, ActionResult, BrowserSession
from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError
import asyncio
import os
import sys


class Job(BaseModel):
    title: str
    url: str


class Jobs(BaseModel):
    jobs: list[Job]


load_dotenv()

HEADLESS = os.getenv("HEADLESS", "false").lower() == "true"
MAX_STEPS = int(os.getenv("MAX_STEPS", "40"))
JOB_TIMEOUT_S = int(os.getenv("JOB_TIMEOUT_S", "300"))

TASK = """
1. First close any cookie banners or popups on the listing page.
2. Identify ALL currently open/available job positions in Slovenia (do not include past job positions (pretekle zaposlitve)).
   If the list has pagination or a "load more" / "več" button, go through all pages.
3. Then process the jobs ONE AT A TIME. For each job:
    a. Click into the job listing to open its individual job posting page.
    b. Call the `get_current_url` action to read the exact URL of the posting directly from the browser.
    c. Record the job's title and that exact URL.
    d. Navigate back (go_back) to the listing page before moving on to the next job.
   If a job has no separate page (it opens in an accordion or popup, or all jobs are on one page),
   use the listing page URL returned by `get_current_url` for that job.
4. The url for each job MUST be a value returned by `get_current_url`. NEVER invent, guess, type, or construct a URL yourself.
5. Do not click on any mailto links, apply links or send any mails.
6. Do not navigate to any other website than the one provided (clicking into job postings on the same site is allowed).
7. Do not use a search engine.
8. If there are no open positions, finish with an empty jobs list.
"""

# Actions the agent can never use: no typing, uploads or custom JS, so it cannot fill in or submit forms / send messages
tools = Tools(exclude_actions=[
    "input", "send_keys",
    "upload_file",
    "evaluate",
    "select_dropdown",
    "search",
    "write_file",
])


@tools.action(description="Return the exact current page URL read from the browser.")
async def get_current_url(browser_session: BrowserSession) -> ActionResult:
    url = await browser_session.get_current_page_url()
    return ActionResult(extracted_content=url, include_in_memory=True)


def log(message):
    # stdout is reserved for the JSON result read by GetJobs.js
    print(message, file=sys.stderr, flush=True)


def print_result(jobs):
    # dedupe by title + url, keep order
    unique = list({(job.title, job.url): job for job in jobs}.values())
    print(Jobs(jobs=unique).model_dump_json(), flush=True)


async def main():
    if len(sys.argv) < 2:
        log("Usage: python3 GetJobs.py <career_page_url>")
        sys.exit(2)
    jobs_page_url = sys.argv[1]

    browser = Browser(
        headless=HEADLESS,
        window_size={'width': 1920, 'height': 1080},
        executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    )

    llm = ChatBrowserUse()
    initial_actions = [
        {'navigate': {'url': jobs_page_url, 'new_tab': True}},
    ]

    agent = Agent(task=TASK, llm=llm, output_model_schema=Jobs, browser=browser, initial_actions=initial_actions, tools=tools, max_failures=2)

    try:
        history = await asyncio.wait_for(agent.run(max_steps=MAX_STEPS), timeout=JOB_TIMEOUT_S)
    except asyncio.TimeoutError:
        log(f"Agent timed out after {JOB_TIMEOUT_S}s")
        await agent.close()
        print_result([])
        return

    # final_result() returns the last action's output even if the agent never finished
    if not history.is_done():
        log(f"Agent did not finish within {MAX_STEPS} steps")
        print_result([])
        return

    try:
        parsed = Jobs.model_validate_json(history.final_result() or "")
    except ValidationError as error:
        log(f"Agent result is not valid Jobs JSON: {error}")
        print_result([])
        return

    log(f"browser-use result: {len(parsed.jobs)} jobs")
    print_result(parsed.jobs)


if __name__ == "__main__":
    asyncio.run(main())
