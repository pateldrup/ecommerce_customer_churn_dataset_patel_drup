const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// In-memory token blacklist (for demo — production use Redis)
const tokenBlacklist = new Set();

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
};

// @desc    Logout (invalidate token client-side; blacklist server-side)
// @route   POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) tokenBlacklist.add(token);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

// @desc    Update profile
// @route   PATCH /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};

// @desc    Delete profile
// @route   DELETE /api/auth/profile
exports.deleteProfile = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) { next(error); }
};

// @desc    Change password
// @route   POST /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
};

// @desc    Forgot password (simulated)
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'Email not found' });
    res.status(200).json({ success: true, message: 'Password reset link sent to email (simulated)' });
  } catch (error) { next(error); }
};

// @desc    Reset password (simulated)
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Password reset successful (simulated)' });
};

// @desc    Verify email (simulated)
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Email verified successfully (simulated)' });
};

// @desc    Send OTP (simulated)
// @route   POST /api/auth/send-otp
exports.sendOTP = async (req, res, next) => {
  res.status(200).json({ success: true, message: 'OTP sent to registered email (simulated)', otp: '123456' });
};

// @desc    Verify OTP (simulated)
// @route   POST /api/auth/verify-otp
exports.verifyOTP = async (req, res, next) => {
  const { otp } = req.body;
  if (otp === '123456') return res.status(200).json({ success: true, message: 'OTP verified successfully' });
  res.status(400).json({ success: false, message: 'Invalid OTP' });
};

// @desc    Resend verification (simulated)
// @route   POST /api/auth/resend-verification
exports.resendVerification = async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Verification email resent (simulated)' });
};

// @desc    Get active session info
// @route   GET /api/auth/session
exports.getSession = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user, message: 'Session is active' });
  } catch (error) { next(error); }
};

// @desc    Logout all sessions (simulated by returning message)
// @route   DELETE /api/auth/session
exports.logoutAll = async (req, res, next) => {
  res.status(200).json({ success: true, message: 'All sessions logged out (simulated)' });
};

// --- JWT Specific Controllers ---

// @desc    Generate a new JWT token
// @route   POST /api/jwt/generate-token
exports.generateJWTToken = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'User id required' });
    const token = generateToken(id);
    res.status(200).json({ success: true, token });
  } catch (error) { next(error); }
};

// @desc    Verify a JWT token
// @route   POST /api/jwt/verify-token
exports.verifyJWTToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ success: true, decoded });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// @desc    Refresh JWT token
// @route   POST /api/jwt/refresh-token
exports.refreshToken = async (req, res, next) => {
  try {
    const oldToken = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
    const newToken = generateToken(decoded.id);
    res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token, cannot refresh' });
  }
};

// @desc    Revoke a JWT token
// @route   DELETE /api/jwt/revoke-token
exports.revokeToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) tokenBlacklist.add(token);
    res.status(200).json({ success: true, message: 'Token revoked successfully' });
  } catch (error) { next(error); }
};
