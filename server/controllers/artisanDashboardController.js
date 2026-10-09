const Product = require("../models/Product");
const Order = require("../models/Order");
const CustomRequest = require("../models/CustomRequest");

// Get Artisan Dashboard Summary
const getArtisanDashboard = async (req, res) => {
    try {
        const artisanId = req.user.id;

        // Total Products
        const totalProducts = await Product.countDocuments({
            artisanId
        });

        // Total Orders
        const totalOrders = await Order.countDocuments({
            artisanId
        });

        // Pending Custom Requests
        const pendingCustomRequests = await CustomRequest.countDocuments({
            artisanId,
            status: "pending"
        });

        // Completed Orders
        const completedOrders = await Order.countDocuments({
            artisanId,
            orderStatus: "delivered"
        });

        // Calculate Total Sales
        const salesResult = await Order.aggregate([
            {
                $match: {
                    artisanId: require("mongoose").Types.ObjectId.createFromHexString(
                        artisanId
                    ),
                    orderStatus: "delivered",
                    paymentStatus: "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalSales =
            salesResult.length > 0
                ? salesResult[0].totalSales
                : 0;

        res.status(200).json({
            message: "Artisan dashboard fetched successfully",
            dashboard: {
                totalProducts,
                totalOrders,
                pendingCustomRequests,
                completedOrders,
                totalSales
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch artisan dashboard",
            error: error.message
        });
    }
};

module.exports = {
    getArtisanDashboard
};