const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        artisanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        images: [
            {
                type: String
            }
        ],

        material: {
            type: String
        },

        stock: {
            type: Number,
            default: 0,
            min: 0
        },

        isCustomizable: {
            type: Boolean,
            default: false
        },

        customizationOptions: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);