const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const customerController = require('../controllers/customerController');
const analyticsController = require('../controllers/analyticsController');
const statsController = require('../controllers/statsController');

// --- ADMIN ROUTES (Role Protected) ---
router.get('/customers', protect, authorize('admin'), customerController.getAllCustomers);
router.get('/stats', protect, authorize('admin'), statsController.getTotalCount);
router.get('/churn-analysis', protect, authorize('admin'), analyticsController.getChurnAnalysis);

// --- PROTECTED CRUD ROUTES ---
router.post('/customers', protect, customerController.createCustomer);
router.patch('/customers/:id', protect, customerController.patchCustomer);
router.delete('/customers/:id', protect, customerController.deleteCustomer);

// --- MIDDLEWARE DEMO ROUTES ---

// Logger demo
router.get('/logger', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logger middleware working',
    log: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      timestamp: new Date().toISOString()
    }
  });
});

// Auth middleware demo
router.get('/auth', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth middleware working. You are authenticated.',
    user: req.user
  });
});

// Rate limit demo
router.get('/rate-limit', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rate limiting middleware is active on this server. Try hitting /api/auth/login rapidly to see it in action.',
  });
});

// Error handler demo
router.get('/error-handler', (req, res, next) => {
  const error = new Error('This is a test error from the error-handler demo route');
  error.status = 500;
  next(error);
});

// Request time demo
router.get('/request-time', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Request timing middleware working',
    serverTime: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)} seconds`
  });
});

module.exports = router;
