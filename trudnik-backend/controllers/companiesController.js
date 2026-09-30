import { getCompaniesQuery, getCompaniesTotalCount, getCompanyByIdQuery, getCompaniesBySearchQuery, getCompaniesBySearchTotalCount } from '../Queries/getQueries.js';

function parsePagination(query) {
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
    const offset = Math.max(parseInt(query.offset, 10) || 0, 0);
    return { limit, offset };
}

function sanitizeSearch(value) {
    if (typeof value !== 'string') return null;
    return value.trim().replace(/[^\p{L}\p{N} ]/gu, '').slice(0, 100) || null;
}

// @desc   Get companies (paginated)
// @route  GET /api/companies?limit=10&offset=0
export const getCompanies = async (req, res, next) => {
    try {
        const { limit, offset } = parsePagination(req.query);

        const [companies, total] = await Promise.all([
            getCompaniesQuery(limit, offset),
            getCompaniesTotalCount(),
        ]);

        res.status(200).json({
            data: companies,
            pagination: { total, limit, offset },
        });
    } catch (error) {
        next(error);
    }
};

// @desc   Search companies (paginated)
// @route  POST /api/companies/search
export const getCompaniesBySearch = async (req, res, next) => {
    try {
        const { limit, offset } = parsePagination(req.body);
        const search = sanitizeSearch(req.body.search);

        if (!search) {
            return res.status(400).json({ message: 'Invalid or missing search term' });
        }

        const [companies, total] = await Promise.all([
            getCompaniesBySearchQuery(limit, offset, search),
            getCompaniesBySearchTotalCount(search),
        ]);

        res.status(200).json({
            data: companies,
            pagination: { total, limit, offset },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single company
// @route   GET /api/companies/:id
export const getCompany = async (req, res, next) => {
    try {
        const company = await getCompanyByIdQuery(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (error) {
        next(error);
    }
};
