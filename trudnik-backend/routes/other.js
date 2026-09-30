import express from 'express';
import { getTotalJobsCompaniesCount, getCategories, getCities } from '../controllers/otherController.js';

const router = express.Router();

// Get companies and jobs total count
router.get('/totalJobsCompaniesCount', getTotalJobsCompaniesCount);

// Get categories
router.get('/categories', getCategories);

// Get cities
router.get('/cities', getCities);


export default router;