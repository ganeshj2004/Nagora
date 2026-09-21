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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Header Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible video embeds & fonts in dev
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiting
app.use('/api', apiRateLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    agency: 'NAGORA Digital Agency',
    tagline: 'GROWING YOUR PROFIT, TOGETHER',
    timestamp: new Date().toISOString(),
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
  console.log(`🚀 NAGORA Express API Server running on port ${PORT}`);
});
