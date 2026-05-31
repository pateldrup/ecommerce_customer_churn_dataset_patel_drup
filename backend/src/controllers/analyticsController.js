const Customer = require('../models/Customer');

exports.getTopBuyers = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $sort: { Total_Purchases: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getTopLifetime = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $sort: { Lifetime_Value: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getTopCredit = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $sort: { Credit_Balance: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getTopEngagement = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $sort: { Login_Frequency: -1, Session_Duration_Avg: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getTopMobileUsers = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $sort: { Mobile_App_Usage: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getTopDiscountUsers = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $sort: { Discount_Usage_Rate: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getTopReviewers = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $sort: { Product_Reviews_Written: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getChurnAnalysis = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $group: {
          _id: '$Churned',
          count: { $sum: 1 },
          avgLifetime: { $avg: '$Lifetime_Value' },
          avgPurchases: { $avg: '$Total_Purchases' }
      }}
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getRetention = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $match: { Churned: 0 } },
      { $group: {
          _id: '$Membership_Years',
          count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getSessionAnalysis = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $group: {
          _id: '$Country',
          avgSessionDuration: { $avg: '$Session_Duration_Avg' },
          avgPagesPerSession: { $avg: '$Pages_Per_Session' }
      }},
      { $sort: { avgSessionDuration: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getPurchaseAnalysis = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $group: {
          _id: '$Signup_Quarter',
          totalPurchases: { $sum: '$Total_Purchases' },
          avgOrderValue: { $avg: '$Average_Order_Value' }
      }},
      { $sort: { totalPurchases: -1 } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getCountryAnalysis = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $group: {
          _id: '$Country',
          count: { $sum: 1 },
          totalValue: { $sum: '$Lifetime_Value' }
      }},
      { $sort: { totalValue: -1 } },
      { $limit: 15 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getCityAnalysis = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $group: {
          _id: '$City',
          count: { $sum: 1 },
          totalValue: { $sum: '$Lifetime_Value' }
      }},
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getSignupAnalysis = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $group: {
          _id: '$Signup_Quarter',
          count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};

exports.getPaymentAnalysis = async (req, res, next) => {
  try {
    const stats = await Customer.aggregate([
      { $group: {
          _id: '$Payment_Method_Diversity',
          count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json({ success: true, data: stats });
  } catch (error) { next(error); }
};
