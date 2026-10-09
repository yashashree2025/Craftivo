const Order = require("../models/Order");
const Favorite = require("../models/Favorite");
const CustomRequest = require("../models/CustomRequest");

// Get Customer Dashboard Summary
const getCustomerDashboard = async (req, res) => {
    try {
        const customerId = req.user.id;

        const totalOrders = await Order.countDocuments({
            customerId
        });

        const pendingOrders = await Order.countDocuments({
            customerId,
            orderStatus: {
                $in: ["placed", "confirmed", "in_progress", "shipped"]
            }
        });

        const deliveredOrders = await Order.countDocuments({
            customerId,
            orderStatus: "delivered"
        });

        const salesResult = await Order.aggregate([
            {
                $match: {
                    customerId: require("mongoose").Types.ObjectId.createFromHexString(
                        customerId
                    ),
                    paymentStatus: "paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalSpent =
            salesResult.length > 0
                ? salesResult[0].totalSpent
                : 0;

        const favoritesCount = await Favorite.countDocuments({
            customerId
        });

        const pendingCustomRequests = await CustomRequest.countDocuments({
            customerId,
            status: "pending"
        });

        res.status(200).json({
            message: "Customer dashboard fetched successfully",
            dashboard: {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalSpent,
                favoritesCount,
                pendingCustomRequests
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch customer dashboard",
            error: error.message
        });
    }
};

module.exports = {
    getCustomerDashboard
};