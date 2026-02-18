import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

import goatRoutes from './views/goatRoutes.js';
import breedingRoutes from './views/breedingRoutes.js';
import kidGrowthRoutes from './views/kidGrowthRoutes.js';
import healthRoutes from './views/healthRoutes.js';
import vaccinationRoutes from './views/vaccinationRoutes.js';
import feedingRoutes from './views/feedingRoutes.js';
import salesBreedingRoutes from './views/salesBreedingRoutes.js';
import salesMeatRoutes from './views/salesMeatRoutes.js';
import expensesRoutes from './views/expensesRoutes.js';
import monthlySummaryRoutes from './views/monthlySummaryRoutes.js';
import matookeRoutes from './views/matookeRoutes.js';
import coffeeRoutes from './views/coffeeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import { verifyToken } from './middleware/auth.js';
import notificationService from './services/notificationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1230;

// Trust proxy - required when behind Render/Heroku/etc for rate limiting and IP detection
app.set('trust proxy', 1);

// Set up helmet for security headers - protects against common vulnerabilities
app.use(helmet());

// Configure CORS to allow requests from our frontend
// In production, this will use the FRONTEND_URL env variable
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:2340',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Enable gzip compression for responses
// This significantly reduces bandwidth usage for JSON responses
app.use(compression({
  level: 6,
  threshold: 1024, // only compress if response is bigger than 1KB
  filter: (req, res) => {
    // skip compression if client requests it
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// General API rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Stricter rate limiting for auth endpoints to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // only 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later.'
});

// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files (goat photos, reports, etc.)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Simple health check endpoint for monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hannan Agribusiness Limited - Business Management System',
    status: 'Online',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes (login, register) - with rate limiting
app.use('/api/auth', authLimiter, authRoutes);

// All routes below require authentication via JWT token
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/reports', verifyToken, reportRoutes);
app.use('/api/upload', verifyToken, uploadRoutes);
app.use('/api/search', verifyToken, searchRoutes);

// Breeding farm routes
app.use('/api/breeding-farm/goats', verifyToken, goatRoutes);
app.use('/api/breeding-farm/breeding', verifyToken, breedingRoutes);
app.use('/api/breeding-farm/kid-growth', verifyToken, kidGrowthRoutes);
app.use('/api/breeding-farm/health', verifyToken, healthRoutes);
app.use('/api/breeding-farm/vaccination', verifyToken, vaccinationRoutes);
app.use('/api/breeding-farm/feeding', verifyToken, feedingRoutes);
app.use('/api/breeding-farm/sales-breeding', verifyToken, salesBreedingRoutes);
app.use('/api/breeding-farm/sales-meat', verifyToken, salesMeatRoutes);
app.use('/api/breeding-farm/expenses', verifyToken, expensesRoutes);
app.use('/api/breeding-farm/monthly-summary', verifyToken, monthlySummaryRoutes);

// Matooke Project
app.use('/api/matooke', verifyToken, matookeRoutes);

// Coffee Project
app.use('/api/coffee', verifyToken, coffeeRoutes);

// Root route with all projects
app.get('/', (req, res) => {
  res.json({
    company: 'Hannan Agribusiness Limited',
    system: 'Business Management System',
    version: '2.0.0',
    projects: [
      {
        name: 'Hannan Breeding Farm',
        description: 'Goat breeding and livestock management',
        endpoint: '/api/breeding-farm/goats'
      },
      {
        name: 'Matooke Project',
        description: 'Matooke farming and production management',
        endpoint: '/api/matooke'
      },
      {
        name: 'Coffee Project',
        description: 'Coffee farming and production management',
        endpoint: '/api/coffee'
      }
    ],
    endpoints: {
      health: '/api/health',
      breedingFarm: '/api/breeding-farm/goats',
      matooke: '/api/matooke',
      coffee: '/api/coffee'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🏢 HANNAN AGRIBUSINESS LIMITED');
  console.log('   Business Management System v2.0');
  console.log('========================================');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log('\n📊 Active Projects (🔒 Protected):');
  console.log('  🐐 Breeding Farm (Goats): /api/breeding-farm/goats');
  console.log('  🍌 Matooke Project:       /api/matooke');
  console.log('  ☕ Coffee Project:        /api/coffee');
  console.log('\n🔐 Security Features:');
  console.log('  ✓ JWT Authentication');
  console.log('  ✓ Rate Limiting');
  console.log('  ✓ CORS Protection');
  console.log('  ✓ Security Headers (Helmet)');
  console.log('========================================\n');
});

export default app;
