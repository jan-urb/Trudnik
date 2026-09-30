import { getJobsQuery, getJobsTotalCount, getJobByIdQuery, getJobsByCategoryQuery, getJobsByCategoryTotalCount, getJobsBySearchQuery, getJobsBySearchAndCityQuery, getJobsByCityQuery, getJobsBySearchTotalCount, getJobsBySearchAndCityTotalCount, getJobsByCityTotalCount } from '../Queries/getQueries.js';

function parsePagination(query) {
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
    const offset = Math.max(parseInt(query.offset, 10) || 0, 0);
    return { limit, offset };
}

function sanitizeSearch(value) {
    if (typeof value !== 'string') return null;
    return value.trim().replace(/[^\p{L}\p{N} ]/gu, '').slice(0, 100) || null;
}

// @desc   Get jobs (paginated)
// @route  GET /api/jobs?limit=10&offset=0
export const getJobs = async (req, res, next) => {
    try {
        const { limit, offset } = parsePagination(req.query);

        const [jobs, total] = await Promise.all([
            getJobsQuery(limit, offset),
            getJobsTotalCount(),
        ]);

        res.status(200).json({
            data: jobs,
            pagination: { total, limit, offset },
        });
    } catch (error) {
        next(error);
    }
};


// @desc   Get jobs by category (paginated)
// @route  GET /api/jobs/category/:category_id?limit=10&offset=0
export const getJobsByCategory = async (req, res, next) => {
    try {
        const { limit, offset } = parsePagination(req.query);
        const category_id = parseInt(req.params.category_id, 10);

        const [jobs, total] = await Promise.all([
            getJobsByCategoryQuery(limit, offset, category_id),
            getJobsByCategoryTotalCount(category_id),
        ]);

        res.status(200).json({
            data: jobs,
            pagination: { total, limit, offset },
        });
    } catch (error) {
        next(error);
    }
};

// @desc   Search jobs (paginated)
// @route  POST /api/jobs/search
export const getJobsBySearch = async (req, res, next) => {
    try {
        const { limit, offset } = parsePagination(req.body);
        const search = sanitizeSearch(req.body.search);
        const city = sanitizeSearch(req.body.city);

        let jobs;
        let total;
        if (search && city) {
            [jobs, total] = await Promise.all([
                getJobsBySearchAndCityQuery(limit, offset, search, city),
                getJobsBySearchAndCityTotalCount(search, city),
            ]);
        } else if (search) {
            [jobs, total] = await Promise.all([
                getJobsBySearchQuery(limit, offset, search),
                getJobsBySearchTotalCount(search),
            ]);
        } else if (city) {
            [jobs, total] = await Promise.all([
                getJobsByCityQuery(limit, offset, city),
                getJobsByCityTotalCount(city),
            ]);
        }

        res.status(200).json({
            data: jobs,
            pagination: { total, limit, offset },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
export const getJob = async (req, res, next) => {
    try {
        const job = await getJobByIdQuery(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        next(error);
    }
};
