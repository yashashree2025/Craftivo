const mongoose = require("mongoose");

const customRequestSchema = new mongoose.Schema(
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

        customizationDetails: {
            type: Object,
            required: true
        },

        referenceImage: {
            type: String,
            default: ""
        },

        estimatedPrice: {
            type: Number,
            required: true,
            min: 0
        },

        artisanPrice: {
            type: Number,
            default: null,
            min: 0
        },

        customerMessage: {
            type: String,
            default: ""
        },

        artisanMessage: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "price_updated",
                "approved",
                "rejected",
                "completed"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("CustomRequest", customRequestSchema);