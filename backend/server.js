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

// Import routes
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

// Import middleware
import { verifyToken } from './middleware/auth.js';

// Import services
import notificationService from './services/notificationService.js';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1230;

// ========== SECURITY MIDDLEWARE ==========
// Helmet for security headers
app.use(helmet());

// CORS configuration - restrict to frontend origin
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:2340',
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression middleware - compress all HTTP responses
app.use(compression({
  level: 6, // Compression level (0-9, higher = better but slower)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Rate limiting - prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 login attempts
  message: 'Too many login attempts, please try again later.'
});

// Body parser and cookie parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (uploaded files) - uploads folder is at project root
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ========== PUBLIC ROUTES ==========
// Health check route (no auth required)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hannan Agribusiness Limited - Business Management System',
    status: 'Online',
    timestamp: new Date().toISOString()
  });
});

// ========== AUTHENTICATION ROUTES ==========
app.use('/api/auth', authLimiter, authRoutes);

// ========== PROTECTED ROUTES (Require Authentication) ==========
// User management (admin only)
app.use('/api/users', usersRoutes);

// Notifications and reminders
app.use('/api/notifications', notificationRoutes);
app.use('/api/reminders', reminderRoutes);

// Reports (PDF and Excel exports)
app.use('/api/reports', verifyToken, reportRoutes);

// File uploads
app.use('/api/upload', verifyToken, uploadRoutes);

// Search and filtering
app.use('/api/search', verifyToken, searchRoutes);

// Breeding Farm Project (Goats & Breeding)
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
  console.log('\n👤 Default Admin:');
  console.log('  Email: admin@hannan.com');
  console.log('  Password: Admin123!');
  console.log('  ⚠️  CHANGE PASSWORD IMMEDIATELY!');
  console.log('========================================\n');
});

export default app;
