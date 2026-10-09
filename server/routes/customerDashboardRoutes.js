const express = require("express");

const {
    getCustomerDashboard
} = require("../controllers/customerDashboardController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCustomerDashboard);

module.exports = router;