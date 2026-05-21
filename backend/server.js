const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;
const axios = require("axios");
// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("🚀 Backend is running");
});

// Main API (this matches your frontend)
app.post("/recommend", async (req, res) => {

    try {
        const { soil, temperature, rainfall, humidity } = req.body;

        console.log("Incoming Data:", req.body);

        // 🔗 Call AI Service
        const aiResponse = await axios.post("http://ai-service:5001/predict", {
            soil,
            temperature,
            rainfall,
            humidity
        });

        // Forward AI response
        res.json(aiResponse.data);

    } catch (error) {
        console.error("Error calling AI Service:", error.message);
        console.error("Full error:", error);

        res.status(500).json({
            error: "AI Service not responding",
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});