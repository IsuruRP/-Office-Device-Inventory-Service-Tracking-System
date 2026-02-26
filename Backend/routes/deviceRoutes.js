const express = require("express");
const router = express.Router();

const Device = require("../models/Device");
const { protect, authorize } = require("../middleware/authMiddleware");

// Add Device (Admin only)
router.post("/", protect, authorize('Admin'), async (req, res) => {
    try {
        const device = new Device(req.body);
        await device.save();
        res.status(201).json(device);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get All Devices
router.get("/", protect, async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Device
router.get("/:id", protect, async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) return res.status(404).json({ error: "Device not found" });
        res.json(device);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Device (Admin only)
router.put("/:id", protect, authorize('Admin'), async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!device) return res.status(404).json({ error: "Device not found" });
        res.json(device);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Device (Admin only)
router.delete("/:id", protect, authorize('Admin'), async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) return res.status(404).json({ error: "Device not found" });
        res.json({ message: "Device deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
