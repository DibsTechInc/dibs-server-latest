const express = require('express');

const getStudioEmployeeInfo = require('./studio/get-studio-employee-info');
const getDashboardData = require('./studio/get-dashboard-data');
const getEarliestRevenueYear = require('./studio/get-earliest-revenue-year');
const getDashboardSalesGrowthData = require('./studio/get-dashboard-sales-growth-data');
const findOrCreateStripeCustomer = require('./studio/find-or-create-stripe-customer');
const getClientSearchResults = require('./studio/get-client-search-results');
const getClientInfo = require('./studio/get-client-info');
const stripeSetupIntent = require('./studio/stripe-setup-intent');
const stripeGetPaymentMethods = require('./studio/stripe-get-payment-methods');
const updateClientInfo = require('./studio/update-client-info');
// const stripeSetUpIntentMoreCards = require('./studio/stripe-setup-intent-more-cards');

const router = express();

router.post('/login-studio-admin', getStudioEmployeeInfo);
router.post('/get-dashboard-data', getDashboardData);
router.post('/get-earliest-revenue-year', getEarliestRevenueYear);
router.post('/get-dashboard-sales-growth-data', getDashboardSalesGrowthData);
router.post('/find-or-create-stripe-customer', findOrCreateStripeCustomer);
router.post('/get-client-search-results', getClientSearchResults);
router.post('/get-client-info', getClientInfo);
router.post('/stripe-setup-intent', stripeSetupIntent);
router.post('/stripe-get-payment-methods', stripeGetPaymentMethods);
router.post('/update-client-info', updateClientInfo);
// router.post('./stripe-add-next-card', stripeSetUpIntentMoreCards);

module.exports = router;
