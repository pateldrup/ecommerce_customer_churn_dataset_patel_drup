const Customer = require('../models/Customer');

// @desc    Get random customer
// @route   GET /api/customers/random
exports.getRandomCustomer = async (req, res, next) => {
  try {
    const count = await Customer.countDocuments();
    const random = Math.floor(Math.random() * count);
    const customer = await Customer.findOne().skip(random);
    res.status(200).json({ success: true, data: customer });
  } catch (error) { next(error); }
};

// @desc    Get trending analytics
// @route   GET /api/customers/trending
exports.getTrending = async (req, res, next) => {
  try {
    const trending = await Customer.aggregate([
      { $match: { Churned: 0 } },
      { $sort: { Login_Frequency: -1, Total_Purchases: -1 } },
      { $limit: 10 },
      { $project: { Age: 1, Gender: 1, Country: 1, City: 1, Login_Frequency: 1, Total_Purchases: 1, Lifetime_Value: 1 } }
    ]);
    res.status(200).json({ success: true, data: trending });
  } catch (error) { next(error); }
};

// @desc    Get recently active customers
// @route   GET /api/customers/recent
exports.getRecent = async (req, res, next) => {
  try {
    const recent = await Customer.find({ Days_Since_Last_Purchase: { $lte: 5 } })
      .sort({ Days_Since_Last_Purchase: 1 }).limit(20);
    res.status(200).json({ success: true, count: recent.length, data: recent });
  } catch (error) { next(error); }
};

// @desc    Get customer recommendations for marketing
// @route   GET /api/customers/recommendations
exports.getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await Customer.aggregate([
      { $match: { Churned: 0, Lifetime_Value: { $gte: 500 }, Total_Purchases: { $gte: 5 } } },
      { $sort: { Email_Open_Rate: -1, Social_Media_Engagement_Score: -1 } },
      { $limit: 15 },
      { $project: { Age: 1, Gender: 1, Country: 1, City: 1, Email_Open_Rate: 1, Social_Media_Engagement_Score: 1, Total_Purchases: 1, Lifetime_Value: 1 } }
    ]);
    res.status(200).json({ success: true, count: recommendations.length, data: recommendations });
  } catch (error) { next(error); }
};

// @desc    Predict churn probability (rule-based)
// @route   GET /api/customers/predictions/churn
exports.predictChurn = async (req, res, next) => {
  try {
    const highRisk = await Customer.aggregate([
      { $match: { Churned: 0 } },
      { $addFields: {
          churnScore: {
            $add: [
              { $cond: [{ $gte: ['$Days_Since_Last_Purchase', 60] }, 30, 0] },
              { $cond: [{ $lte: ['$Login_Frequency', 5] }, 25, 0] },
              { $cond: [{ $gte: ['$Cart_Abandonment_Rate', 70] }, 20, 0] },
              { $cond: [{ $lte: ['$Total_Purchases', 3] }, 15, 0] },
              { $cond: [{ $gte: ['$Customer_Service_Calls', 8] }, 10, 0] }
            ]
          }
      }},
      { $match: { churnScore: { $gte: 40 } } },
      { $sort: { churnScore: -1 } },
      { $limit: 20 },
      { $project: { Age: 1, Gender: 1, Country: 1, churnScore: 1, Days_Since_Last_Purchase: 1, Login_Frequency: 1, Cart_Abandonment_Rate: 1 } }
    ]);
    res.status(200).json({ success: true, count: highRisk.length, data: highRisk });
  } catch (error) { next(error); }
};

// @desc    Predict retention trends
// @route   GET /api/customers/predictions/retention
exports.predictRetention = async (req, res, next) => {
  try {
    const retained = await Customer.aggregate([
      { $match: { Churned: 0 } },
      { $addFields: {
          retentionScore: {
            $add: [
              { $cond: [{ $gte: ['$Membership_Years', 3] }, 25, 0] },
              { $cond: [{ $gte: ['$Login_Frequency', 15] }, 25, 0] },
              { $cond: [{ $gte: ['$Total_Purchases', 10] }, 25, 0] },
              { $cond: [{ $lte: ['$Days_Since_Last_Purchase', 15] }, 25, 0] }
            ]
          }
      }},
      { $match: { retentionScore: { $gte: 50 } } },
      { $sort: { retentionScore: -1 } },
      { $limit: 20 },
      { $project: { Age: 1, Gender: 1, Country: 1, retentionScore: 1, Membership_Years: 1, Login_Frequency: 1, Total_Purchases: 1 } }
    ]);
    res.status(200).json({ success: true, count: retained.length, data: retained });
  } catch (error) { next(error); }
};

// @desc    Get premium customer segments
// @route   GET /api/customers/segments/premium
exports.getSegmentPremium = async (req, res, next) => {
  try {
    const data = await Customer.find({ Lifetime_Value: { $gte: 5000 }, Membership_Years: { $gte: 3 } }).limit(20);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

// @desc    Get high-value customer segments
// @route   GET /api/customers/segments/high-value
exports.getSegmentHighValue = async (req, res, next) => {
  try {
    const data = await Customer.find({ Lifetime_Value: { $gte: 3000 } }).sort({ Lifetime_Value: -1 }).limit(20);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

// @desc    Get loyal customer segments
// @route   GET /api/customers/segments/loyal
exports.getSegmentLoyal = async (req, res, next) => {
  try {
    const data = await Customer.find({ Membership_Years: { $gte: 4 }, Churned: 0 }).sort({ Membership_Years: -1 }).limit(20);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

// @desc    Get risky customer segments
// @route   GET /api/customers/segments/risky
exports.getSegmentRisky = async (req, res, next) => {
  try {
    const data = await Customer.find({
      Churned: 0,
      Days_Since_Last_Purchase: { $gte: 60 },
      Login_Frequency: { $lte: 5 }
    }).limit(20);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

// @desc    Get inactive customer segments
// @route   GET /api/customers/segments/inactive
exports.getSegmentInactive = async (req, res, next) => {
  try {
    const data = await Customer.find({ Days_Since_Last_Purchase: { $gte: 90 } }).sort({ Days_Since_Last_Purchase: -1 }).limit(20);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { next(error); }
};

// @desc    Country heatmap
// @route   GET /api/customers/heatmap/countries
exports.getHeatmapCountries = async (req, res, next) => {
  try {
    const data = await Customer.aggregate([
      { $group: { _id: '$Country', count: { $sum: 1 }, totalLifetime: { $sum: '$Lifetime_Value' }, avgPurchases: { $avg: '$Total_Purchases' } } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc    City heatmap
// @route   GET /api/customers/heatmap/cities
exports.getHeatmapCities = async (req, res, next) => {
  try {
    const data = await Customer.aggregate([
      { $group: { _id: '$City', count: { $sum: 1 }, totalLifetime: { $sum: '$Lifetime_Value' } } },
      { $sort: { count: -1 } },
      { $limit: 25 }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

// @desc    Purchase insights
// @route   GET /api/customers/insights/purchases
exports.getInsightsPurchases = async (req, res, next) => {
  try {
    const data = await Customer.aggregate([
      { $group: { _id: null, avgPurchases: { $avg: '$Total_Purchases' }, maxPurchases: { $max: '$Total_Purchases' }, minPurchases: { $min: '$Total_Purchases' }, totalPurchases: { $sum: '$Total_Purchases' } } }
    ]);
    res.status(200).json({ success: true, data: data[0] });
  } catch (error) { next(error); }
};

// @desc    Mobile usage insights
// @route   GET /api/customers/insights/mobile-usage
exports.getInsightsMobileUsage = async (req, res, next) => {
  try {
    const data = await Customer.aggregate([
      { $group: { _id: null, avgMobileUsage: { $avg: '$Mobile_App_Usage' }, maxMobileUsage: { $max: '$Mobile_App_Usage' }, minMobileUsage: { $min: '$Mobile_App_Usage' } } }
    ]);
    res.status(200).json({ success: true, data: data[0] });
  } catch (error) { next(error); }
};

// @desc    Discount insights
// @route   GET /api/customers/insights/discounts
exports.getInsightsDiscounts = async (req, res, next) => {
  try {
    const data = await Customer.aggregate([
      { $group: { _id: null, avgDiscountRate: { $avg: '$Discount_Usage_Rate' }, maxDiscountRate: { $max: '$Discount_Usage_Rate' } } }
    ]);
    res.status(200).json({ success: true, data: data[0] });
  } catch (error) { next(error); }
};

// @desc    Engagement insights
// @route   GET /api/customers/insights/engagement
exports.getInsightsEngagement = async (req, res, next) => {
  try {
    const data = await Customer.aggregate([
      { $group: { _id: null, avgLoginFreq: { $avg: '$Login_Frequency' }, avgSessionDuration: { $avg: '$Session_Duration_Avg' }, avgSocialMedia: { $avg: '$Social_Media_Engagement_Score' } } }
    ]);
    res.status(200).json({ success: true, data: data[0] });
  } catch (error) { next(error); }
};

// @desc    High churn alert
// @route   GET /api/customers/alerts/high-churn
exports.getAlertHighChurn = async (req, res, next) => {
  try {
    const data = await Customer.find({
      Churned: 0,
      Days_Since_Last_Purchase: { $gte: 50 },
      Cart_Abandonment_Rate: { $gte: 60 }
    }).sort({ Cart_Abandonment_Rate: -1 }).limit(15);
    res.status(200).json({ success: true, alert: 'HIGH CHURN RISK', count: data.length, data });
  } catch (error) { next(error); }
};

// @desc    Inactive user alert
// @route   GET /api/customers/alerts/inactive-users
exports.getAlertInactiveUsers = async (req, res, next) => {
  try {
    const data = await Customer.find({
      Days_Since_Last_Purchase: { $gte: 90 },
      Login_Frequency: { $lte: 3 }
    }).limit(15);
    res.status(200).json({ success: true, alert: 'INACTIVE USERS', count: data.length, data });
  } catch (error) { next(error); }
};

// @desc    Cart abandonment alert
// @route   GET /api/customers/alerts/high-cart-abandonment
exports.getAlertCartAbandonment = async (req, res, next) => {
  try {
    const data = await Customer.find({ Cart_Abandonment_Rate: { $gte: 80 } }).sort({ Cart_Abandonment_Rate: -1 }).limit(15);
    res.status(200).json({ success: true, alert: 'HIGH CART ABANDONMENT', count: data.length, data });
  } catch (error) { next(error); }
};

// @desc    System health check
// @route   GET /api/customers/system/health
exports.systemHealth = async (req, res, next) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    uptime: `${process.uptime().toFixed(2)} seconds`,
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage()
  });
};

// @desc    API version
// @route   GET /api/customers/system/version
exports.systemVersion = async (req, res, next) => {
  res.status(200).json({
    success: true,
    version: '1.0.0',
    name: 'E-Commerce Customer Analytics API',
    node: process.version
  });
};

// @desc    Public config
// @route   GET /api/customers/system/config
exports.systemConfig = async (req, res, next) => {
  res.status(200).json({
    success: true,
    defaultPageSize: 10,
    maxPageSize: 100,
    supportedSortFields: ['age', 'membershipYears', 'loginFrequency', 'sessionDuration', 'purchases', 'averageOrderValue', 'lifetimeValue', 'creditBalance', 'discountRate', 'mobileUsage']
  });
};

// @desc    Clear cache (simulated)
// @route   POST /api/customers/cache/clear
exports.clearCache = async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Cache cleared successfully (simulated)' });
};

// @desc    API logs (simulated)
// @route   GET /api/customers/logs
exports.getLogs = async (req, res, next) => {
  res.status(200).json({
    success: true,
    logs: [
      { timestamp: new Date().toISOString(), action: 'GET /api/customers', status: 200 },
      { timestamp: new Date().toISOString(), action: 'POST /api/auth/login', status: 200 }
    ]
  });
};

// @desc    API activity (simulated)
// @route   GET /api/customers/activity
exports.getActivity = async (req, res, next) => {
  res.status(200).json({
    success: true,
    recentActivity: [
      { action: 'Customer created', timestamp: new Date().toISOString() },
      { action: 'Bulk update performed', timestamp: new Date().toISOString() }
    ]
  });
};

// @desc    Live search
// @route   GET /api/customers/live-search
exports.liveSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
    const results = await Customer.find({
      $or: [
        { Country: { $regex: q, $options: 'i' } },
        { City: { $regex: q, $options: 'i' } },
        { Gender: { $regex: q, $options: 'i' } },
        { Signup_Quarter: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) { next(error); }
};

// @desc    Dashboard summary
// @route   GET /api/customers/dashboard/summary
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const churned = await Customer.countDocuments({ Churned: 1 });
    const active = await Customer.countDocuments({ Churned: 0 });
    const avgLifetime = await Customer.aggregate([{ $group: { _id: null, avg: { $avg: '$Lifetime_Value' } } }]);
    const avgPurchases = await Customer.aggregate([{ $group: { _id: null, avg: { $avg: '$Total_Purchases' } } }]);
    res.status(200).json({
      success: true,
      summary: {
        totalCustomers,
        activeCustomers: active,
        churnedCustomers: churned,
        churnRate: `${((churned / totalCustomers) * 100).toFixed(2)}%`,
        averageLifetimeValue: avgLifetime[0]?.avg?.toFixed(2) || '0',
        averagePurchases: avgPurchases[0]?.avg?.toFixed(2) || '0'
      }
    });
  } catch (error) { next(error); }
};

// @desc    Revenue analytics dashboard
// @route   GET /api/customers/dashboard/revenue
exports.getDashboardRevenue = async (req, res, next) => {
  try {
    const data = await Customer.aggregate([
      { $group: {
          _id: '$Country',
          totalRevenue: { $sum: '$Lifetime_Value' },
          avgOrderValue: { $avg: '$Average_Order_Value' },
          totalPurchases: { $sum: '$Total_Purchases' },
          customerCount: { $sum: 1 }
      }},
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};
