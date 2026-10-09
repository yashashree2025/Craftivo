const mongoose = require("mongoose");

const orderStatusHistorySchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        status: {
            type: String,
            enum: [
                "placed",
                "confirmed",
                "in_progress",
                "shipped",
                "delivered",
                "cancelled"
            ],
            required: true
        },

        changedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "OrderStatusHistory",
    orderStatusHistorySchema
);