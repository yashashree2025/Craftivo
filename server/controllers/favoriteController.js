const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

// Add Product to Favorites
const addFavorite = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check if already favorite
        const existingFavorite = await Favorite.findOne({
            customerId: req.user.id,
            productId
        });

        if (existingFavorite) {
            return res.status(400).json({
                message: "Product is already in favorites"
            });
        }

        const favorite = await Favorite.create({
            customerId: req.user.id,
            productId
        });

        res.status(201).json({
            message: "Product added to favorites",
            favorite
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add favorite",
            error: error.message
        });
    }
};

// Get Customer Favorites
const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({
            customerId: req.user.id
        })
            .populate("productId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Favorites fetched successfully",
            count: favorites.length,
            favorites
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch favorites",
            error: error.message
        });
    }
};

// Remove Product from Favorites
const removeFavorite = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        const favorite = await Favorite.findOneAndDelete({
            customerId: req.user.id,
            productId
        });

        if (!favorite) {
            return res.status(404).json({
                message: "Product is not in your favorites"
            });
        }

        res.status(200).json({
            message: "Product removed from favorites"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove favorite",
            error: error.message
        });
    }
};

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite

};