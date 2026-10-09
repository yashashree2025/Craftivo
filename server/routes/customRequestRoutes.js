const express = require("express");

const {
    createCustomRequest,
    getArtisanRequests,
    respondToCustomRequest,
    getCustomerRequests,
    customerRespondToRequest
} = require("../controllers/customRequestController");

const {
    protect,
    artisanOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create custom request - Logged in user
router.post("/", protect, createCustomRequest);

// Get custom requests - Artisan only
router.get("/artisan", protect, artisanOnly, getArtisanRequests);

// Respond to custom request - Artisan only
router.put("/:id/respond", protect, artisanOnly, respondToCustomRequest);

// Get custom requests - Customer only
router.get("/customer", protect, getCustomerRequests);

// Customer approves or rejects artisan price
router.put("/:id/customer-response", protect, customerRespondToRequest);

module.exports = router;