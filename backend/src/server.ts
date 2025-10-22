import 'module-alias/register';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@/docs/swagger';
import config from '@/config/config';
import connectDB from '@/config/db';

import authRoutes from '@/routes/auth.routes';
import userRoutes from '@/routes/user.routes';
import learningResourceRoutes from '@/routes/learningResource.routes';
import toolResourceRoutes from '@/routes/toolResource.routes';
import internRoutes from '@/routes/intern.routes';

import { errorHandler } from '@/middleware/error.middleware';

dotenv.config();

const app: Application = express();

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}


// Middlewares
app.use(helmet());
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later',
});

app.use('/api/', limiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/learning-resources', learningResourceRoutes);
app.use('/api/tools', toolResourceRoutes);
app.use('/api/interns', internRoutes);

//swagger docs route
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log('='.repeat(50));
});

export default app;
