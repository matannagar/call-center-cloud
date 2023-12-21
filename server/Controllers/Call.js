const express = require('express');
const Call = require('../models/Call');
const router = express.Router();

router.get('/calls', async (req, res) => {
    try {
        const calls = await Call.find();
        res.status(200).json(calls);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/calls-per-month', async (req, res) => {
    try {
        const calls = await Call.aggregate([
            {
                $group: {
                    _id: { $month: "$callStartTime" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(calls);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/calls-per-day', async (req, res) => {
    try {
        const calls = await Call.aggregate([
            {
                $group: {
                    _id: { $dayOfWeek: "$callStartTime" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(calls);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
