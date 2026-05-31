const Customer = require('../models/Customer');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all customers (handles pagination, sorting, search, filtering)
// @route   GET /api/customers
exports.getAllCustomers = async (req, res, next) => {
  try {
    // Merge injected filters into a combined query string for APIFeatures
    const combinedQuery = { ...req.query, ...(req.injectedQuery || {}) };
    
    // Apply pre-filters injected by injectQuery middleware (direct MongoDB filter objects)
    const baseQuery = req.preFilter ? Customer.find(req.preFilter) : Customer.find();
    
    const features = new APIFeatures(baseQuery, combinedQuery)
      .filter()
      .search()
      .sort()
      .paginate();

    const customers = await features.query;
    res.status(200).json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new customer
// @route   POST /api/customers
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update customer (replace)
// @route   PUT /api/customers/:id
exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      overwrite: true
    });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Patch customer
// @route   PATCH /api/customers/:id
exports.patchCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Check customer exists
// @route   GET /api/customers/exists/:id
exports.checkCustomerExists = async (req, res, next) => {
  try {
    const exists = await Customer.exists({ _id: req.params.id });
    res.status(200).json({ success: true, exists: !!exists });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create
// @route   POST /api/customers/bulk-create
exports.bulkCreateCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.insertMany(req.body);
    res.status(201).json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Bulk update
// @route   PATCH /api/customers/bulk-update
exports.bulkUpdateCustomers = async (req, res, next) => {
  try {
    // Expects an array of objects like { id, updates }
    const bulkOps = req.body.map(item => ({
      updateOne: { filter: { _id: item.id }, update: { $set: item.updates } }
    }));
    const result = await Customer.bulkWrite(bulkOps);
    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete
// @route   DELETE /api/customers/bulk-delete
exports.bulkDeleteCustomers = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const result = await Customer.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, count: result.deletedCount });
  } catch (error) {
    next(error);
  }
};

// Helper middleware to inject custom query params for specific routes before calling getAllCustomers
exports.injectQuery = (queryObj) => {
  return (req, res, next) => {
    req.injectedQuery = req.injectedQuery || {};
    req.preFilter = req.preFilter || {};
    for (let key in queryObj) {
      let val = queryObj[key];
      if (typeof val === 'string' && val.startsWith('req.params.')) {
        const paramKey = val.split('.')[2];
        req.injectedQuery[key] = req.params[paramKey];
      } else if (typeof val === 'object' && val !== null) {
        // Direct MongoDB filter object like { $gte: 10 }
        req.preFilter[key] = val;
      } else {
        req.injectedQuery[key] = val;
      }
    }
    next();
  };
};
