const Customer = require('../models/Customer');

exports.getTotalCount = async (req, res, next) => {
  try {
    const count = await Customer.countDocuments();
    res.status(200).json({ success: true, total: count });
  } catch (error) { next(error); }
};

exports.getAverageAge = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: null, averageAge: { $avg: '$Age' } } }
    ]);
    res.status(200).json({ success: true, averageAge: result[0]?.averageAge?.toFixed(2) || '0' });
  } catch (error) { next(error); }
};

exports.getAverageLifetime = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: null, averageLifetimeValue: { $avg: '$Lifetime_Value' } } }
    ]);
    res.status(200).json({ success: true, averageLifetimeValue: result[0]?.averageLifetimeValue?.toFixed(2) || '0' });
  } catch (error) { next(error); }
};

exports.getAverageCredit = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: null, averageCreditBalance: { $avg: '$Credit_Balance' } } }
    ]);
    res.status(200).json({ success: true, averageCreditBalance: result[0]?.averageCreditBalance?.toFixed(2) || '0' });
  } catch (error) { next(error); }
};

exports.getAverageOrderValue = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: null, averageOrderValue: { $avg: '$Average_Order_Value' } } }
    ]);
    res.status(200).json({ success: true, averageOrderValue: result[0]?.averageOrderValue?.toFixed(2) || '0' });
  } catch (error) { next(error); }
};

exports.getHighestPurchases = async (req, res, next) => {
  try {
    const customer = await Customer.findOne().sort({ Total_Purchases: -1 }).select('Age Gender Country Total_Purchases Lifetime_Value');
    res.status(200).json({ success: true, data: customer });
  } catch (error) { next(error); }
};

exports.getHighestLifetime = async (req, res, next) => {
  try {
    const customer = await Customer.findOne().sort({ Lifetime_Value: -1 }).select('Age Gender Country Total_Purchases Lifetime_Value');
    res.status(200).json({ success: true, data: customer });
  } catch (error) { next(error); }
};

exports.getHighestCredit = async (req, res, next) => {
  try {
    const customer = await Customer.findOne().sort({ Credit_Balance: -1 }).select('Age Gender Country Credit_Balance Lifetime_Value');
    res.status(200).json({ success: true, data: customer });
  } catch (error) { next(error); }
};

exports.getCountryCount = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: '$Country', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getCityCount = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: '$City', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getGenderCount = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: '$Gender', count: { $sum: 1 } } }
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getChurnCount = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: '$Churned', count: { $sum: 1 } } }
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getSignupQuarterCount = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: '$Signup_Quarter', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
};

exports.getReviewCount = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: { _id: null, totalReviews: { $sum: '$Product_Reviews_Written' }, avgReviews: { $avg: '$Product_Reviews_Written' } } }
    ]);
    res.status(200).json({ success: true, data: result[0] });
  } catch (error) { next(error); }
};

exports.getMobileUsageStats = async (req, res, next) => {
  try {
    const result = await Customer.aggregate([
      { $group: {
          _id: null,
          avgMobileUsage: { $avg: '$Mobile_App_Usage' },
          maxMobileUsage: { $max: '$Mobile_App_Usage' },
          minMobileUsage: { $min: '$Mobile_App_Usage' }
      }}
    ]);
    res.status(200).json({ success: true, data: result[0] });
  } catch (error) { next(error); }
};
