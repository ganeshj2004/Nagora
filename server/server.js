import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

import contactRoutes from './routes/contact.js';
import serviceRoutes from './routes/services.js';
import portfolioRoutes from './routes/portfolio.js';
import testimonialRoutes from './routes/testimonials.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payments.js';
import projectRoutes from './routes/projects.js';

import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { query } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Production Startup Assertions
if (isProduction) {
  if (!process.env.JWT_SECRET) {
    console.error('❌ [FATAL ERROR] JWT_SECRET environment variable is required in production.');
    process.exit(1);
  }
}

// Trust reverse proxy headers (Required for Nginx / Reverse Proxy compatibility)
app.set('trust proxy', 1);

// Security Header Middlewares
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
}));

// Strict CORS configuration
const defaultOrigins = isProduction
  ? ['https://nagora.digital', 'https://www.nagora.digital']
  : ['http://localhost:3000', 'http://localhost:5173'];

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : defaultOrigins;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || (!isProduction && allowedOrigins.includes('*')) || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy restriction: Origin ${origin} is not permitted.`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiting
app.use('/api', apiRateLimiter);

// Health Check Endpoint (Safe production status check)
app.get('/api/health', async (req, res) => {
  let dbStatus = 'ok';
  try {
    await query('SELECT 1');
  } catch (err) {
    dbStatus = 'error';
  }

  res.json({
    status: 'ok',
    database: dbStatus,
  });
});

// Mount Routes
app.use('/api', contactRoutes);
app.use('/api', serviceRoutes);
app.use('/api', portfolioRoutes);
app.use('/api', testimonialRoutes);
app.use('/api', adminRoutes);
app.use('/api', paymentRoutes);
app.use('/api', projectRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found.' });
});

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 NAGORA Express API Server listening on port ${PORT} [Environment: ${process.env.NODE_ENV || 'development'}]`);
});


