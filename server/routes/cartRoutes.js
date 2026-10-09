const express = require("express");

const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
} = require("../controllers/cartController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// Add product to cart - Logged in customer
router.post("/add", protect, addToCart);

// Get customer cart
router.get("/", protect, getCart);

// Update cart item quantity
router.put("/update", protect, updateCartQuantity);

// Remove product from cart
router.delete("/remove", protect, removeFromCart);

module.exports = router;