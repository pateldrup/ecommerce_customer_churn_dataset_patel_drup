const express = require('express');
const router = express.Router();
const adv = require('../controllers/advancedController');
const { protect } = require('../middlewares/authMiddleware');

// Random, Trending, Recent
router.get('/random', adv.getRandomCustomer);
router.get('/trending', adv.getTrending);
router.get('/recent', adv.getRecent);
router.get('/recommendations', adv.getRecommendations);

// Predictions
router.get('/predictions/churn', adv.predictChurn);
router.get('/predictions/retention', adv.predictRetention);

// Segments
router.get('/segments/premium', adv.getSegmentPremium);
router.get('/segments/high-value', adv.getSegmentHighValue);
router.get('/segments/loyal', adv.getSegmentLoyal);
router.get('/segments/risky', adv.getSegmentRisky);
router.get('/segments/inactive', adv.getSegmentInactive);

// Heatmaps
router.get('/heatmap/countries', adv.getHeatmapCountries);
router.get('/heatmap/cities', adv.getHeatmapCities);

// Insights
router.get('/insights/purchases', adv.getInsightsPurchases);
router.get('/insights/mobile-usage', adv.getInsightsMobileUsage);
router.get('/insights/discounts', adv.getInsightsDiscounts);
router.get('/insights/engagement', adv.getInsightsEngagement);

// Alerts
router.get('/alerts/high-churn', adv.getAlertHighChurn);
router.get('/alerts/inactive-users', adv.getAlertInactiveUsers);
router.get('/alerts/high-cart-abandonment', adv.getAlertCartAbandonment);

// System
router.get('/system/health', adv.systemHealth);
router.get('/system/version', adv.systemVersion);
router.get('/system/config', adv.systemConfig);

// Cache, Logs, Activity
router.post('/cache/clear', protect, adv.clearCache);
router.get('/logs', protect, adv.getLogs);
router.get('/activity', protect, adv.getActivity);

// Live Search
router.get('/live-search', adv.liveSearch);

// Dashboard
router.get('/dashboard/summary', adv.getDashboardSummary);
router.get('/dashboard/revenue', adv.getDashboardRevenue);

module.exports = router;
