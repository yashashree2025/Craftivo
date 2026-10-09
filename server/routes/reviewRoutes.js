const express = require("express");

const {
    createReview,
    getProductReviews,
    getProductRatingSummary
} = require("../controllers/reviewController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// Create Review
router.post("/", protect, createReview);

// Get Product Reviews
router.get("/product/:productId", getProductReviews);

// Get Product Rating Summary
router.get("/product/:productId/rating-summary", getProductRatingSummary);

module.exports = router;