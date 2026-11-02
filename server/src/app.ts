import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './modules/auth/authRoutes.js';
import projectRoutes from './modules/projects/projectRoutes.js';
import { standaloneTaskRouter } from './modules/tasks/taskRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', standaloneTaskRouter);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
