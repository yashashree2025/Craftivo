const CustomRequest = require("../models/CustomRequest");
const Product = require("../models/Product");

// Create Custom Request
const createCustomRequest = async (req, res) => {
    try {
        const {
            productId,
            customizationDetails,
            estimatedPrice,
            customerMessage
        } = req.body;

        // Validate required fields
        if (
            !productId ||
            !customizationDetails ||
            estimatedPrice === undefined
        ) {
            return res.status(400).json({
                message: "Product, customization details and estimated price are required"
            });
        }

        // Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check whether product is customizable
       console.log("PRODUCT FOUND:", product);
       console.log("ARTISAN ID:", product.artisanId);

        // Create request
        const customRequest = await CustomRequest.create({
        customerId: req.user.id,
        artisanId: product.artisanId,
        productId: product._id,
        customizationDetails,
        estimatedPrice,
        customerMessage
        });

        res.status(201).json({
            message: "Custom request created successfully",
            customRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create custom request",
            error: error.message
        });
    }
};

// Get Custom Requests for Artisan
const getArtisanRequests = async (req, res) => {
    try {
        const requests = await CustomRequest.find({
            artisanId: req.user.id
        })
            .populate("customerId", "name email phone")
            .populate("productId", "name price images")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Artisan custom requests fetched successfully",
            count: requests.length,
            requests
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch custom requests",
            error: error.message
        });
    }
};

// Artisan Responds to Custom Request
const respondToCustomRequest = async (req, res) => {
    try {
        const { status, artisanPrice, artisanMessage } = req.body;

        // Find request
        const customRequest = await CustomRequest.findById(req.params.id);

        if (!customRequest) {
            return res.status(404).json({
                message: "Custom request not found"
            });
        }

        // Check ownership
        if (customRequest.artisanId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only respond to your own custom requests"
            });
        }

        // Validate status
        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be accepted or rejected"
            });
        }

        // If accepted, artisan price is required
        if (status === "accepted" && artisanPrice === undefined) {
            return res.status(400).json({
                message: "Artisan price is required when accepting a request"
            });
        }

        // Update request
        customRequest.status = status;

        if (artisanPrice !== undefined) {
            customRequest.artisanPrice = artisanPrice;
        }

        if (artisanMessage !== undefined) {
            customRequest.artisanMessage = artisanMessage;
        }

        const updatedRequest = await customRequest.save();

        res.status(200).json({
            message: "Custom request responded successfully",
            customRequest: updatedRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to respond to custom request",
            error: error.message
        });
    }
};

// Get Custom Requests for Customer
const getCustomerRequests = async (req, res) => {
    try {
        const requests = await CustomRequest.find({
            customerId: req.user.id
        })
            .populate("artisanId", "name email phone")
            .populate("productId", "name price images")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Customer custom requests fetched successfully",
            count: requests.length,
            requests
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch customer custom requests",
            error: error.message
        });
    }
};

// Customer Approves or Rejects Artisan Price
const customerRespondToRequest = async (req, res) => {
    try {
        const { status } = req.body;

        // Find custom request
        const customRequest = await CustomRequest.findById(req.params.id);

        if (!customRequest) {
            return res.status(404).json({
                message: "Custom request not found"
            });
        }

        // Check ownership
        if (customRequest.customerId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only respond to your own custom requests"
            });
        }

        // Customer can respond only after artisan accepts
        if (customRequest.status !== "accepted") {
            return res.status(400).json({
                message: "You can respond only after artisan accepts the request"
            });
        }

        // Validate status
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be approved or rejected"
            });
        }

        // Update status
        customRequest.status = status;

        const updatedRequest = await customRequest.save();

        res.status(200).json({
            message: `Custom request ${status} successfully`,
            customRequest: updatedRequest
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to respond to custom request",
            error: error.message
        });
    }
};
module.exports = {
    createCustomRequest,
    getArtisanRequests,
    respondToCustomRequest,
    getCustomerRequests,
    customerRespondToRequest
};