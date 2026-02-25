const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const deviceRoutes = require("./routes/deviceRoutes");
app.use("/api/devices", deviceRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Office Device Inventory API is running!" });
});

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: "Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || "Internal Server Error"
    });
});

// Database Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
    });

