import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import userRouter from './modules/user/user.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Security middleware
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

// Request parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// User API routes
app.use('/api/v1/users', userRouter);

// API health-check endpoint
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Nexlect API is running.',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

// Global error-handling middleware
app.use(errorHandler);

export default app;
