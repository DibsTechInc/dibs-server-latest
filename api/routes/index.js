const express = require('express');

const router = express();

router.get('/test2', (req, res) => {
    res.json({
        message: 'Welcome to Dibs Base TEST 2 API Back End Start.'
    });
});
router.get('/test5', (req, res) => {
    res.json({
        message: 'Welcome to Dibs Base TEST 5 API Back End Start.'
    });
});

module.exports = router;
