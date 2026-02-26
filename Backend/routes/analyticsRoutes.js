const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        const totalDevices = await Device.countDocuments();

        const statusCounts = await Device.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const typeCounts = await Device.aggregate([
            { $group: { _id: "$deviceType", count: { $sum: 1 } } }
        ]);

        res.json({
            totalDevices,
            statusCounts: statusCounts.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            typeCounts: typeCounts.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {})
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
