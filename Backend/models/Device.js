const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
    deviceType: String,
    brand: String,
    model: String,
    serialNumber: { type: String, unique: true },
    assetTag: String,
    department: String,
    assignedUser: String,
    purchaseDate: Date,
    status: {
        type: String,
        enum: ["Active", "Under Repair", "Retired"]
    },
    hardwareConfig: {
        cpu: String,
        ram: String,
        storageType: String,
        storageCapacity: String,
        operatingSystem: String,
        graphicsCard: String,
        displaySize: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Device", DeviceSchema);
