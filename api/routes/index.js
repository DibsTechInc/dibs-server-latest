const express = require('express');

const getStudioEmployeeInfo = require('./studio/get-studio-employee-info');
const getDashboardData = require('./studio/get-dashboard-data');
const getEarliestRevenueYear = require('./studio/get-earliest-revenue-year');

const router = express();

router.get('/test2', (req, res) => {
    res.json({
        message: 'Welcome to Dibs Base TEST 2 API Back End Start.'
    });
});
router.post('/login-studio-admin', getStudioEmployeeInfo);
router.post('/get-dashboard-data', getDashboardData);
router.post('/get-earliest-revenue-year', getEarliestRevenueYear);

module.exports = router;
