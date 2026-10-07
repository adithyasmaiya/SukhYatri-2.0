import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { apiRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

const app = express();

// Auto-connect to database on cold starts (bypassed instantly once connected)
app.use(async (_req, _res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDatabase();
    } catch (err: any) {
      console.warn('[App] Database connection initialization warning:', err.message);
    }
  }
  next();
});

// Security Headers (MIME sniffing protection, Referrer Policy, HSTS, Frame protection)
const helmetMiddleware = ((helmet as any)?.default || helmet) as (options?: any) => express.RequestHandler;
app.use(
  helmetMiddleware({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Ensures Razorpay Checkout SDK & CDN images load cleanly
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: (origin, callback) => {
      // In production, match configured origins, vercel preview domains, or requests with no origin (webhooks/same-origin)
      if (ENV.NODE_ENV === 'production') {
        const allowedOrigins = [ENV.FRONTEND_URL, ENV.CORS_ORIGIN].filter(Boolean);
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          origin.endsWith('.vercel.app')
        ) {
          callback(null, true);
        } else {
          callback(new Error('Blocked by CORS policy'));
        }
      } else {
        // Development / Test: allow localhost origins or requests with no origin (curl/mobile/tools)
        if (
          !origin ||
          origin === ENV.CORS_ORIGIN ||
          origin === ENV.FRONTEND_URL ||
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:')
        ) {
          callback(null, true);
        } else {
          callback(new Error('Blocked by CORS policy'));
        }
      }
    },
    credentials: true,
  })
);

// Body Parsing (Capturing rawBody for Razorpay webhook HMAC verification)
app.use(
  express.json({
    limit: '5mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Logging
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Global API Rate Limiting
app.use('/api', apiRateLimiter);

// Health Check Endpoints (Both /health and /api/health for load balancer & container orchestrator probes)
const handleHealthCheck = (_req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const isHealthy = isDbConnected || mongoose.connection.readyState === 2;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    ok: isHealthy,
    api: 'operational',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    environment: ENV.NODE_ENV,
  });
};
app.get('/health', handleHealthCheck);
app.get('/api/health', handleHealthCheck);

// Root API Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'operational',
    service: 'SukhYatri 2.0 API Server',
    version: '2.0.0',
    documentation: '/api/docs',
    health: '/health',
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
