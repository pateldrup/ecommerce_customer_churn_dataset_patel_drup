const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const customerController = require('../controllers/customerController');
const statsController = require('../controllers/statsController');

// JWT Token Management
router.post('/generate-token', authController.generateJWTToken);
router.post('/verify-token', authController.verifyJWTToken);
router.post('/refresh-token', authController.refreshToken);
router.delete('/revoke-token', protect, authController.revokeToken);

// Protected Customer & Stats Routes (JWT guarded)
router.get('/profile', protect, authController.getProfile);
router.get('/dashboard', protect, (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to protected JWT dashboard', user: req.user });
});
router.get('/private-customers', protect, customerController.getAllCustomers);
router.get('/private-stats', protect, statsController.getTotalCount);
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome Admin!' });
});
router.get('/customer-insights', protect, (req, res) => {
  res.status(200).json({ success: true, message: 'Customer Insight Dashboard (JWT Protected)' });
});

module.exports = router;
