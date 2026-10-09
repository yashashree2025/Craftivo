const Order = require("../models/Order");

// Simulate Payment
const simulatePayment = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check order ownership
        if (order.customerId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only pay for your own orders"
            });
        }

        // Check if already paid
        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                message: "Order is already paid"
            });
        }

        // Simulate successful payment
        order.paymentStatus = "paid";

        await order.save();

        res.status(200).json({
            message: "Payment successful",
            paymentStatus: order.paymentStatus,
            orderId: order._id,
            amountPaid: order.totalAmount
        });

    } catch (error) {
        res.status(500).json({
            message: "Payment failed",
            error: error.message
        });
    }
};

module.exports = {
    simulatePayment
};