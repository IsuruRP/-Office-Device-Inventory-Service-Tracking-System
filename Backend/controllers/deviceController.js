const Device = require("../models/Device");

// @desc    Get all devices
// @route   GET /api/devices
exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json({ success: true, count: devices.length, data: devices });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single device
// @route   GET /api/devices/:id
exports.getDevice = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ success: false, error: "Device not found" });
        }
        res.status(200).json({ success: true, data: device });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create new device
// @route   POST /api/devices
exports.createDevice = async (req, res) => {
    try {
        const device = await Device.create(req.body);
        res.status(201).json({ success: true, data: device });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: "Duplicate serial number" });
        }
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update device
// @route   PUT /api/devices/:id
exports.updateDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!device) {
            return res.status(404).json({ success: false, error: "Device not found" });
        }
        res.status(200).json({ success: true, data: device });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) {
            return res.status(404).json({ success: false, error: "Device not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
