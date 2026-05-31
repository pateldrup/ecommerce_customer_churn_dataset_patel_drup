const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');
const { generalLimiter, authLimiter, searchLimiter, analyticsLimiter, adminLimiter } = require('./middlewares/rateLimiter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));

// Enable CORS
app.use(cors());

// Logging middleware
app.use(logger);

// General rate limiter
app.use(generalLimiter);

// Route files
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const jwtRoutes = require('./routes/jwtRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const statsRoutes = require('./routes/statsRoutes');
const searchRoutes = require('./routes/searchRoutes');
const advancedRoutes = require('./routes/advancedRoutes');
const middlewareRoutes = require('./routes/middlewareRoutes');

// Import validation middleware
const { registerValidationRules, loginValidationRules, validate, customerValidationRules, customerUpdateRules, idParamValidation, paginationValidation } = require('./middlewares/validation');

// ===================== MOUNT ROUTERS =====================

// Home route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'E-Commerce Customer Analytics API is running...',
    version: '1.0.0',
    endpoints: {
      customers: '/api/customers',
      auth: '/api/auth',
      jwt: '/api/jwt',
      analytics: '/api/analytics',
      stats: '/api/stats',
      search: '/api/search',
      admin: '/api/admin',
      middleware: '/api/middleware'
    }
  });
});

// Customer Routes (with rate limiter)
app.use('/api/customers', customerRoutes);

// Advanced Customer Routes (mounted BEFORE /:id to avoid conflicts)
app.use('/api/customers', advancedRoutes);

// Auth Routes (with auth rate limiter)
app.use('/api/auth', authLimiter, authRoutes);

// JWT Routes
app.use('/api/jwt', jwtRoutes);

// Analytics Routes (with analytics rate limiter)
app.use('/api/analytics', analyticsLimiter, analyticsRoutes);

// Stats Routes
app.use('/api/stats', statsRoutes);

// Search Routes (with search rate limiter)
app.use('/api/search', searchLimiter, searchRoutes);

// Admin & Protected Routes (with admin rate limiter)
app.use('/api/admin', adminLimiter, middlewareRoutes);
app.use('/api/protected', middlewareRoutes);
app.use('/api/middleware', middlewareRoutes);

// ===================== HEAD ROUTES =====================
const Customer = require('./models/Customer');

app.head('/api/customers', async (req, res) => {
  const count = await Customer.countDocuments();
  res.set('X-Total-Count', count);
  res.status(200).end();
});

app.head('/api/customers/:id', async (req, res) => {
  const exists = await Customer.exists({ _id: req.params.id });
  res.set('X-Exists', !!exists);
  res.status(exists ? 200 : 404).end();
});

app.head('/api/customers/country/:country', async (req, res) => {
  const count = await Customer.countDocuments({ Country: req.params.country });
  res.set('X-Total-Count', count);
  res.status(200).end();
});

app.head('/api/stats/customers/count', async (req, res) => {
  const count = await Customer.countDocuments();
  res.set('X-Total-Count', count);
  res.status(200).end();
});

app.head('/api/analytics/customers/top-buyers', (req, res) => {
  res.set('X-Route', 'analytics-top-buyers');
  res.status(200).end();
});

app.head('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization;
  res.set('X-Authenticated', !!token);
  res.status(token ? 200 : 401).end();
});

app.head('/api/customers/system/health', (req, res) => {
  res.set('X-Status', 'OK');
  res.set('X-Uptime', `${process.uptime().toFixed(2)}s`);
  res.status(200).end();
});

// ===================== OPTIONS ROUTES =====================
app.options('/api/customers', (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.status(200).json({ methods: ['GET', 'POST', 'HEAD', 'OPTIONS'] });
});

app.options('/api/customers/:id', (req, res) => {
  res.set('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
  res.status(200).json({ methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] });
});

app.options('/api/auth/login', (req, res) => {
  res.set('Allow', 'POST, OPTIONS');
  res.status(200).json({ methods: ['POST', 'OPTIONS'] });
});

app.options('/api/admin/customers', (req, res) => {
  res.set('Allow', 'GET, OPTIONS');
  res.status(200).json({ methods: ['GET', 'OPTIONS'] });
});

app.options('/api/search/customers', (req, res) => {
  res.set('Allow', 'GET, OPTIONS');
  res.status(200).json({ methods: ['GET', 'OPTIONS'] });
});

app.options('/api/jwt/profile', (req, res) => {
  res.set('Allow', 'GET, OPTIONS');
  res.status(200).json({ methods: ['GET', 'OPTIONS'] });
});

app.options('/api/customers/system/health', (req, res) => {
  res.set('Allow', 'GET, HEAD, OPTIONS');
  res.status(200).json({ methods: ['GET', 'HEAD', 'OPTIONS'] });
});

// ===================== ERROR HANDLING =====================

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler Middleware (must be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
