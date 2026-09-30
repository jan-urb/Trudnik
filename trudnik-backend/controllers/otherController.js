import { getTotalJobsCompaniesCountQuery, getCategoriesQuery, getCitiesQuery } from '../Queries/getQueries.js';


// @desc   Get companies total count
// @route  GET /api/other/companies/total
export const getTotalJobsCompaniesCount = async (req, res, next) => {
    try {
        const total = await getTotalJobsCompaniesCountQuery();
        res.status(200).json(total);
    } catch (error) {
        next(error);
    }
};

// @desc   Get categories
// @route  GET /api/other/categories
export const getCategories = async (req, res, next) => {
    try {
        const categories = await getCategoriesQuery();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

// @desc   Get cities
// @route  GET /api/other/cities
export const getCities = async (req, res, next) => {
    try {
        const cities = await getCitiesQuery();
        res.status(200).json(cities);
    } catch (error) {
        next(error);
    }
};


