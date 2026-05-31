const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Search Route explicitly mapped
router.get('/customers', customerController.getAllCustomers);

module.exports = router;
