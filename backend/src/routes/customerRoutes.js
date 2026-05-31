const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');

// Destructure controller methods for cleaner code
const {
  getAllCustomers, getCustomerById, createCustomer, updateCustomer, 
  patchCustomer, deleteCustomer, checkCustomerExists, bulkCreateCustomers, 
  bulkUpdateCustomers, bulkDeleteCustomers, injectQuery
} = customerController;

// --- BULK ROUTES ---
router.post('/bulk-create', bulkCreateCustomers);
router.patch('/bulk-update', bulkUpdateCustomers);
router.delete('/bulk-delete', bulkDeleteCustomers);

// --- SPECIFIC CUSTOMER INFO / FILTERING ROUTES (Mapping to getAllCustomers with injected queries) ---

// Demographics & Basics
router.get('/country/:country', injectQuery({ country: 'req.params.country' }), getAllCustomers);
router.get('/city/:city', injectQuery({ city: 'req.params.city' }), getAllCustomers);
router.get('/gender/:gender', injectQuery({ gender: 'req.params.gender' }), getAllCustomers);
router.get('/age/:age', injectQuery({ Age: 'req.params.age' }), getAllCustomers);
router.get('/signup-quarter/:quarter', injectQuery({ signupQuarter: 'req.params.quarter' }), getAllCustomers);

// High/Low Value Filters
router.get('/churned', injectQuery({ churned: 1 }), getAllCustomers);
router.get('/active', injectQuery({ churned: 0 }), getAllCustomers);
router.get('/high-value', injectQuery({ minLifetime: 1000 }), getAllCustomers);
router.get('/high-purchases', injectQuery({ minPurchases: 10 }), getAllCustomers);
router.get('/high-credit', injectQuery({ minCredit: 2000 }), getAllCustomers);
router.get('/high-engagement', injectQuery({ minLoginFrequency: 20 }), getAllCustomers);
router.get('/high-mobile-usage', injectQuery({ minMobileUsage: 25 }), getAllCustomers);
router.get('/high-discount-users', injectQuery({ minDiscountRate: 40 }), getAllCustomers);
router.get('/recent-buyers', injectQuery({ Days_Since_Last_Purchase: { $lte: 10 } }), getAllCustomers);
router.get('/inactive', injectQuery({ Days_Since_Last_Purchase: { $gte: 90 } }), getAllCustomers);
router.get('/top-reviewers', injectQuery({ Product_Reviews_Written: { $gte: 10 } }), getAllCustomers);
router.get('/high-cart-abandonment', injectQuery({ Cart_Abandonment_Rate: { $gte: 70 } }), getAllCustomers);
router.get('/frequent-logins', injectQuery({ minLoginFrequency: 30 }), getAllCustomers);
router.get('/loyal', injectQuery({ membershipYears: 5 }), getAllCustomers);
router.get('/premium', injectQuery({ minLifetime: 5000, membershipYears: 3 }), getAllCustomers);

// Route Parameter Maps (dynamic injected values)
router.get('/login-frequency/:value', injectQuery({ minLoginFrequency: 'req.params.value' }), getAllCustomers);
router.get('/session-duration/:value', injectQuery({ minSessionDuration: 'req.params.value' }), getAllCustomers);
router.get('/purchases/:value', injectQuery({ minPurchases: 'req.params.value' }), getAllCustomers);
router.get('/lifetime/:value', injectQuery({ minLifetime: 'req.params.value' }), getAllCustomers);
router.get('/credit/:value', injectQuery({ minCredit: 'req.params.value' }), getAllCustomers);
router.get('/churn-status/:status', injectQuery({ churned: 'req.params.status' }), getAllCustomers);
router.get('/mobile-usage/:value', injectQuery({ minMobileUsage: 'req.params.value' }), getAllCustomers);
router.get('/discount-rate/:value', injectQuery({ minDiscountRate: 'req.params.value' }), getAllCustomers);
router.get('/reviews/:value', injectQuery({ Product_Reviews_Written: 'req.params.value' }), getAllCustomers);

// Dedicated Filter Sub-paths (as per requirements)
router.get('/filter/high-purchases', injectQuery({ minPurchases: 20 }), getAllCustomers);
router.get('/filter/high-lifetime', injectQuery({ minLifetime: 2000 }), getAllCustomers);
router.get('/filter/high-credit', injectQuery({ minCredit: 3000 }), getAllCustomers);
router.get('/filter/high-login', injectQuery({ minLoginFrequency: 25 }), getAllCustomers);
router.get('/filter/high-mobile', injectQuery({ minMobileUsage: 30 }), getAllCustomers);
router.get('/filter/high-discount', injectQuery({ minDiscountRate: 50 }), getAllCustomers);
router.get('/filter/high-cart-abandonment', injectQuery({ Cart_Abandonment_Rate: { $gte: 80 } }), getAllCustomers);
router.get('/filter/high-engagement', injectQuery({ minSessionDuration: 40 }), getAllCustomers);
router.get('/filter/high-reviews', injectQuery({ Product_Reviews_Written: { $gte: 15 } }), getAllCustomers);
router.get('/filter/churned', injectQuery({ churned: 1 }), getAllCustomers);
router.get('/filter/active', injectQuery({ churned: 0 }), getAllCustomers);
router.get('/filter/low-session', injectQuery({ Session_Duration_Avg: { $lte: 10 } }), getAllCustomers);
router.get('/filter/high-session', injectQuery({ minSessionDuration: 30 }), getAllCustomers);
router.get('/filter/high-order-value', injectQuery({ Average_Order_Value: { $gte: 200 } }), getAllCustomers);
router.get('/filter/loyal', injectQuery({ membershipYears: 4 }), getAllCustomers);

// Sort Sub-paths
router.get('/sort/age-desc', injectQuery({ sort: '-age' }), getAllCustomers);
router.get('/sort/purchases-desc', injectQuery({ sort: '-purchases' }), getAllCustomers);
router.get('/sort/lifetime-desc', injectQuery({ sort: '-lifetimeValue' }), getAllCustomers);
router.get('/sort/login-desc', injectQuery({ sort: '-loginFrequency' }), getAllCustomers);
router.get('/sort/credit-desc', injectQuery({ sort: '-creditBalance' }), getAllCustomers);

// Exist Check Route
router.get('/exists/:id', checkCustomerExists);

// --- BASIC CRUD ROUTES ---
router.route('/')
  .get(getAllCustomers)
  .post(createCustomer);

router.route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .patch(patchCustomer)
  .delete(deleteCustomer);

module.exports = router;
