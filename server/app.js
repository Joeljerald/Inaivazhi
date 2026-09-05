import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import associationRoutes from './routes/associationRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { runSeed } from './utils/seedData.js';

// Health Check Endpoint (Part 57)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Inaivazhi API is running',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

// Seed Endpoint to trigger database seed on running server
app.post('/api/seed', async (req, res, next) => {
  try {
    await runSeed(true);
    res.status(200).json({
      success: true,
      message: 'Database seeded successfully with 60 candidates and 5 trainer tracks.',
    });
  } catch (err) {
    next(err);
  }
});

// API Routes (Part 26 & Part 124)
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api', evaluationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/associations', associationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resumes', resumeRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
