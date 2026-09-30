import express from 'express';
import { getCompanies, getCompany, getCompaniesBySearch } from '../controllers/companiesController.js';

const router = express.Router();

// Get all companies
router.get('/', getCompanies);

// Search companies
router.post('/search', getCompaniesBySearch);

// Get single company
router.get('/:id', getCompany);


export default router;