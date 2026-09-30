import express from 'express';
import { getJobs, getJob, getJobsByCategory, getJobsBySearch } from '../controllers/jobsController.js';

const router = express.Router();

// Get all jobs
router.get('/', getJobs);

// Get jobs by category
router.get('/category/:category_id', getJobsByCategory);

// Get jobs by search
router.post('/search', getJobsBySearch);

// Get single job
router.get('/:id', getJob);

export default router;
