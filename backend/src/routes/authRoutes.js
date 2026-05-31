const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Register & Login
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', protect, authController.logout);

// Profile Management (protected)
router.get('/profile', protect, authController.getProfile);
router.patch('/profile', protect, authController.updateProfile);
router.delete('/profile', protect, authController.deleteProfile);

// Password Management (protected)
router.post('/change-password', protect, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Email & OTP verification (simulated)
router.post('/verify-email', authController.verifyEmail);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-verification', authController.resendVerification);

// Session
router.get('/session', protect, authController.getSession);
router.delete('/session', protect, authController.logoutAll);

module.exports = router;
