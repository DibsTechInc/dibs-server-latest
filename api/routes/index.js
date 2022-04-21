const express = require('express');

const getStudioEmployeeInfo = require('./studio/get-studio-employee-info');
const getDashboardData = require('./studio/get-dashboard-data');
const getEarliestRevenueYear = require('./studio/get-earliest-revenue-year');
const getDashboardSalesGrowthData = require('./studio/get-dashboard-sales-growth-data');
const findOrCreateStripeCustomer = require('./studio/find-or-create-stripe-customer');
const getClientSearchResults = require('./studio/get-client-search-results');

const router = express();

router.post('/login-studio-admin', getStudioEmployeeInfo);
router.post('/get-dashboard-data', getDashboardData);
router.post('/get-earliest-revenue-year', getEarliestRevenueYear);
router.post('/get-dashboard-sales-growth-data', getDashboardSalesGrowthData);
router.post('/find-or-create-stripe-customer', findOrCreateStripeCustomer);
router.post('/get-client-search-results', getClientSearchResults);

module.exports = router;
