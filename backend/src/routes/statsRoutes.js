const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/customers/count', statsController.getTotalCount);
router.get('/customers/average-age', statsController.getAverageAge);
router.get('/customers/average-lifetime', statsController.getAverageLifetime);
router.get('/customers/average-credit', statsController.getAverageCredit);
router.get('/customers/average-order-value', statsController.getAverageOrderValue);
router.get('/customers/highest-purchases', statsController.getHighestPurchases);
router.get('/customers/highest-lifetime', statsController.getHighestLifetime);
router.get('/customers/highest-credit', statsController.getHighestCredit);
router.get('/customers/country-count', statsController.getCountryCount);
router.get('/customers/city-count', statsController.getCityCount);
router.get('/customers/gender-count', statsController.getGenderCount);
router.get('/customers/churn-count', statsController.getChurnCount);
router.get('/customers/signup-quarter-count', statsController.getSignupQuarterCount);
router.get('/customers/review-count', statsController.getReviewCount);
router.get('/customers/mobile-usage', statsController.getMobileUsageStats);

module.exports = router;
