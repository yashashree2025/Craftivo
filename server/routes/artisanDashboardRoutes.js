const express = require("express");

const {
    getArtisanDashboard
} = require("../controllers/artisanDashboardController");

const {
    protect,
    artisanOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Artisan Dashboard
router.get("/", protect, artisanOnly, getArtisanDashboard);

module.exports = router;