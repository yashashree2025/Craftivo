const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        artisanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        customRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomRequest",
        default: null
        },

        customizationDetails: {
        type: Object,
        default: null
        },

        shippingAddress: {
            type: Object,
            required: true
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        deliveryCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "placed",
                "confirmed",
                "in_progress",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "placed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);