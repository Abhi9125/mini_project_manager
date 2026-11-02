import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './modules/auth/authRoutes.js';
import projectRoutes from './modules/projects/projectRoutes.js';
import { standaloneTaskRouter } from './modules/tasks/taskRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app: Application = express();

// Middleware - CORS configuration
const clientUrls = env.CLIENT_URL
  ? env.CLIENT_URL.split(',').map((url: string) => url.trim().replace(/\/+$/, ''))
  : [];
const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const allowedOrigins = new Set([...clientUrls, ...defaultOrigins]);

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman) or during local dev
      if (!origin || env.isDevelopment) {
        return callback(null, true);
      }
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (
        allowedOrigins.has(normalizedOrigin) ||
        normalizedOrigin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
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
