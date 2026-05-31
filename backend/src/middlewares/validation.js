const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Customer creation validation rules
const customerValidationRules = [
  body('Age').notEmpty().withMessage('Age is required').isNumeric().withMessage('Age must be a number'),
  body('Gender').notEmpty().withMessage('Gender is required').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  body('Country').notEmpty().withMessage('Country is required').isString(),
  body('City').notEmpty().withMessage('City is required').isString(),
  body('Membership_Years').optional().isNumeric().withMessage('Membership_Years must be a number'),
  body('Login_Frequency').optional().isNumeric().withMessage('Login_Frequency must be a number'),
  body('Session_Duration_Avg').optional().isNumeric().withMessage('Session_Duration_Avg must be a number'),
  body('Pages_Per_Session').optional().isNumeric().withMessage('Pages_Per_Session must be a number'),
  body('Cart_Abandonment_Rate').optional().isNumeric().withMessage('Cart_Abandonment_Rate must be a number'),
  body('Total_Purchases').optional().isNumeric().withMessage('Total_Purchases must be a number'),
  body('Average_Order_Value').optional().isNumeric().withMessage('Average_Order_Value must be a number'),
  body('Lifetime_Value').optional().isNumeric().withMessage('Lifetime_Value must be a number'),
  body('Credit_Balance').optional().isNumeric().withMessage('Credit_Balance must be a number'),
  body('Mobile_App_Usage').optional().isNumeric().withMessage('Mobile_App_Usage must be a number'),
  body('Churned').notEmpty().withMessage('Churned is required').isIn([0, 1]).withMessage('Churned must be 0 or 1'),
];

// Customer update validation rules
const customerUpdateRules = [
  body('Age').optional().isNumeric().withMessage('Age must be a number'),
  body('Gender').optional().isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  body('Churned').optional().isIn([0, 1]).withMessage('Churned must be 0 or 1'),
];

// Auth registration validation rules
const registerValidationRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Auth login validation rules
const loginValidationRules = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Bulk create validation
const bulkCreateValidation = [
  body().isArray().withMessage('Body must be an array of customer records'),
];

// Pagination validation
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

// Param ID validation
const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

module.exports = {
  validate,
  customerValidationRules,
  customerUpdateRules,
  registerValidationRules,
  loginValidationRules,
  bulkCreateValidation,
  paginationValidation,
  idParamValidation
};
