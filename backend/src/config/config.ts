import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_dashboard',
  jwtSecret: process.env.JWT_SECRET || 'change_me_securely',
  jwtExpire: process.env.JWT_EXPIRE || '7d' as string,
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
  maxFileSize: Number(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 min
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  defaultAdmin: {
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@company.com',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
    username: process.env.DEFAULT_ADMIN_USERNAME || 'admin'
  }
};

export default config;
