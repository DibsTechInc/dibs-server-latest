const express = require('express');

const getStudioEmployeeInfo = require('./studio/get-studio-employee-info');
const getDashboardData = require('./studio/get-dashboard-data');
const getEarliestRevenueYear = require('./studio/get-earliest-revenue-year');
const getDashboardSalesGrowthData = require('./studio/get-dashboard-sales-growth-data');
const createNewStripeCustomer = require('./studio/create-new-stripe-customer');

const router = express();

router.post('/login-studio-admin', getStudioEmployeeInfo);
router.post('/get-dashboard-data', getDashboardData);
router.post('/get-earliest-revenue-year', getEarliestRevenueYear);
router.post('/get-dashboard-sales-growth-data', getDashboardSalesGrowthData);
router.post('/create-new-stripe-customer', createNewStripeCustomer);

module.exports = router;
