const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: { success: false, message: 'Too many requests from this IP, please try again after 1 minute' }
});

// Auth rate limiter (stricter for login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Please try again after 15 minutes' }
});

// Search rate limiter
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many search requests. Please slow down.' }
});

// Analytics rate limiter
const analyticsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many analytics requests. Please try again shortly.' }
});

// Admin rate limiter
const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Admin route rate limit exceeded.' }
});

module.exports = { generalLimiter, authLimiter, searchLimiter, analyticsLimiter, adminLimiter };
