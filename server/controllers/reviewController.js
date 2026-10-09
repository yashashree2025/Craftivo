const Review = require("../models/Review");
const Order = require("../models/Order");

// Create Review
const createReview = async (req, res) => {
    try {
        const { productId, orderId, rating, comment } = req.body;

        if (!productId || !orderId || !rating || !comment) {
            return res.status(400).json({
                message: "Product ID, order ID, rating and comment are required"
            });
        }

        // Check order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check customer ownership
        if (order.customerId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only review your own order"
            });
        }

        // Product must belong to the order
        if (order.productId.toString() !== productId) {
            return res.status(400).json({
                message: "Product does not belong to this order"
            });
        }

        // Review only after delivery
        if (order.orderStatus !== "delivered") {
            return res.status(400).json({
                message: "You can review the product only after delivery"
            });
        }

        // Check duplicate review
        const existingReview = await Review.findOne({
            customerId: req.user.id,
            orderId
        });

        if (existingReview) {
            return res.status(400).json({
                message: "You have already reviewed this order"
            });
        }

        const review = await Review.create({
            customerId: req.user.id,
            productId,
            orderId,
            rating,
            comment
        });

        res.status(201).json({
            message: "Review created successfully",
            review
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create review",
            error: error.message
        });
    }
};

// Get Product Reviews
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            productId: req.params.productId
        })
            .populate("customerId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Product reviews fetched successfully",
            count: reviews.length,
            reviews
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product reviews",
            error: error.message
        });
    }
};

// Get Product Rating Summary
const getProductRatingSummary = async (req, res) => {
    try {
        const reviews = await Review.find({
            productId: req.params.productId
        });

        const totalReviews = reviews.length;

        if (totalReviews === 0) {
            return res.status(200).json({
                message: "Product rating summary fetched successfully",
                averageRating: 0,
                totalReviews: 0
            });
        }

        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        const averageRating = Number(
            (totalRating / totalReviews).toFixed(1)
        );

        res.status(200).json({
            message: "Product rating summary fetched successfully",
            averageRating,
            totalReviews
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product rating summary",
            error: error.message
        });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    getProductRatingSummary
};