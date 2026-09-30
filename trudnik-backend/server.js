import express from 'express';
import cors from 'cors';
import companiesRouter from './routes/companies.js';
import jobsRouter from './routes/jobs.js';
import otherRouter from './routes/other.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { rateLimit } from 'express-rate-limit'
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/companies', companiesRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/other', otherRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});