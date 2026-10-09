const express = require("express");

const {
    addFavorite,
    getFavorites,
    removeFavorite
} = require("../controllers/favoriteController");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// Add Product to Favorites
router.post("/", protect, addFavorite);

// Get My Favorites
router.get("/", protect, getFavorites);

// Remove Product from Favorites
router.delete("/remove", protect, removeFavorite);

module.exports = router;