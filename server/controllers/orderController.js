const Order = require("../models/Order");
const CustomRequest = require("../models/CustomRequest");
const OrderStatusHistory = require("../models/OrderStatusHistory");

// =====================================================
// Create Order from Approved Custom Request
// =====================================================
const createCustomOrder = async (req, res) => {
    try {
        const { shippingAddress, deliveryCharge = 0 } = req.body;

        // Validate shipping address
        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        // Find custom request
        const customRequest = await CustomRequest.findById(
            req.params.customRequestId
        );

        if (!customRequest) {
            return res.status(404).json({
                message: "Custom request not found"
            });
        }

        // Check customer ownership
        if (customRequest.customerId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only create an order for your own request"
            });
        }

        // Request must be approved
        if (customRequest.status !== "approved") {
            return res.status(400).json({
                message: "Custom request must be approved before creating an order"
            });
        }

        // Artisan price must exist
        if (customRequest.artisanPrice === null) {
            return res.status(400).json({
                message: "Artisan price is not available"
            });
        }

        // Check whether order already exists
        const existingOrder = await Order.findOne({
            customRequestId: customRequest._id
        });

        if (existingOrder) {
            return res.status(400).json({
                message: "Order already created for this custom request"
            });
        }

        // Calculate total
        const subtotal = customRequest.artisanPrice;
        const totalAmount = subtotal + Number(deliveryCharge);

        // Create order
        const order = await Order.create({
            customerId: customRequest.customerId,
            artisanId: customRequest.artisanId,
            productId: customRequest.productId,
            customRequestId: customRequest._id,
            customizationDetails: customRequest.customizationDetails,
            shippingAddress,
            subtotal,
            deliveryCharge: Number(deliveryCharge),
            totalAmount
        });

        // Create initial order status history
        await OrderStatusHistory.create({
            orderId: order._id,
            status: "placed"
        });

        // Update custom request
        customRequest.status = "completed";
        await customRequest.save();

        res.status(201).json({
            message: "Custom order created successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create custom order",
            error: error.message
        });
    }
};


// =====================================================
// Get Orders for Customer
// =====================================================
const getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            customerId: req.user.id
        })
            .populate("artisanId", "name")
            .populate("productId", "name price images")
            .sort({ createdAt: -1 });

        const formattedOrders = orders.map((order) => ({
            orderId: order._id,

            product: order.productId
                ? {
                      // IMPORTANT:
                      // Frontend expects product._id
                      _id: order.productId._id,

                      name: order.productId.name,

                      price: order.productId.price,

                      images: order.productId.images
                  }
                : null,

            artisan: order.artisanId
                ? {
                      name: order.artisanId.name
                  }
                : null,

            subtotal: order.subtotal,

            deliveryCharge: order.deliveryCharge,

            totalAmount: order.totalAmount,

            paymentStatus: order.paymentStatus,

            orderStatus: order.orderStatus,

            createdAt: order.createdAt
        }));

        res.status(200).json({
            message: "Customer orders fetched successfully",
            count: formattedOrders.length,
            orders: formattedOrders
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch customer orders",
            error: error.message
        });
    }
};


// =====================================================
// Get Single Order Details for Customer
// =====================================================
const getCustomerOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("artisanId", "name email phone")
            .populate(
                "productId",
                "name price images category material"
            );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check customer ownership
        if (order.customerId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only view your own orders"
            });
        }

        const formattedOrder = {
            orderId: order._id,

            product: order.productId
                ? {
                      _id: order.productId._id,

                      name: order.productId.name,

                      price: order.productId.price,

                      images: order.productId.images,

                      category: order.productId.category,

                      material: order.productId.material
                  }
                : null,

            artisan: order.artisanId
                ? {
                      name: order.artisanId.name,

                      email: order.artisanId.email,

                      phone: order.artisanId.phone
                  }
                : null,

            customizationDetails: order.customizationDetails,

            shippingAddress: order.shippingAddress,

            subtotal: order.subtotal,

            deliveryCharge: order.deliveryCharge,

            totalAmount: order.totalAmount,

            paymentStatus: order.paymentStatus,

            orderStatus: order.orderStatus,

            createdAt: order.createdAt,

            updatedAt: order.updatedAt
        };

        res.status(200).json({
            message: "Order details fetched successfully",
            order: formattedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch order details",
            error: error.message
        });
    }
};


// =====================================================
// Get Orders for Artisan
// =====================================================
const getArtisanOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            artisanId: req.user.id
        })
            .populate("customerId", "name email phone")
            .populate("productId", "name price images")
            .sort({ createdAt: -1 });

        const formattedOrders = orders.map((order) => ({
            orderId: order._id,

            customer: order.customerId
                ? {
                      name: order.customerId.name,

                      email: order.customerId.email,

                      phone: order.customerId.phone
                  }
                : null,

            product: order.productId
                ? {
                      name: order.productId.name,

                      price: order.productId.price,

                      images: order.productId.images
                  }
                : null,

            customizationDetails: order.customizationDetails,

            shippingAddress: order.shippingAddress,

            subtotal: order.subtotal,

            deliveryCharge: order.deliveryCharge,

            totalAmount: order.totalAmount,

            paymentStatus: order.paymentStatus,

            orderStatus: order.orderStatus,

            createdAt: order.createdAt,

            updatedAt: order.updatedAt
        }));

        res.status(200).json({
            message: "Artisan orders fetched successfully",

            count: formattedOrders.length,

            orders: formattedOrders
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch artisan orders",

            error: error.message
        });
    }
};


// =====================================================
// Update Order Status - Artisan
// =====================================================
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check order ownership
        if (order.artisanId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only update your own orders"
            });
        }

        // Allowed status flow
        const allowedTransitions = {
            placed: ["confirmed", "cancelled"],

            confirmed: ["in_progress", "cancelled"],

            in_progress: ["shipped", "cancelled"],

            shipped: ["delivered"],

            delivered: [],

            cancelled: []
        };

        if (
            !allowedTransitions[order.orderStatus].includes(
                orderStatus
            )
        ) {
            return res.status(400).json({
                message: `Cannot change order status from ${order.orderStatus} to ${orderStatus}`
            });
        }

        order.orderStatus = orderStatus;

        const updatedOrder = await order.save();

        // Save status history
        await OrderStatusHistory.create({
            orderId: order._id,

            status: orderStatus
        });

        res.status(200).json({
            message: "Order status updated successfully",

            order: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update order status",

            error: error.message
        });
    }
};


// =====================================================
// Get Order Tracking for Customer
// =====================================================
const getCustomerOrderTracking = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("productId", "name images")
            .populate("artisanId", "name email");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check if order belongs to logged-in customer
        if (order.customerId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only track your own orders"
            });
        }

        const statusSteps = [
            "placed",
            "confirmed",
            "in_progress",
            "shipped",
            "delivered"
        ];

        const currentStatus = order.orderStatus;

        const currentIndex =
            statusSteps.indexOf(currentStatus);

        const tracking = statusSteps.map(
            (status, index) => ({
                status,

                completed:
                    index <= currentIndex,

                current:
                    index === currentIndex
            })
        );

        res.status(200).json({
            message:
                "Order tracking fetched successfully",

            orderId: order._id,

            product: order.productId
                ? {
                      name: order.productId.name,

                      images: order.productId.images
                  }
                : null,

            artisan: order.artisanId
                ? {
                      name: order.artisanId.name,

                      email: order.artisanId.email
                  }
                : null,

            orderStatus: order.orderStatus,

            paymentStatus: order.paymentStatus,

            tracking
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch order tracking",

            error: error.message
        });
    }
};


// =====================================================
// Cancel Order - Customer
// =====================================================
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.customerId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only cancel your own orders"
            });
        }

        const allowedStatuses = [
            "placed",
            "confirmed"
        ];

        if (!allowedStatuses.includes(order.orderStatus)) {
            return res.status(400).json({
                message: `Order cannot be cancelled when status is ${order.orderStatus}`
            });
        }

        order.orderStatus = "cancelled";

        await order.save();

        // Save cancellation history
        await OrderStatusHistory.create({
            orderId: order._id,

            status: "cancelled"
        });

        res.status(200).json({
            message: "Order cancelled successfully",

            orderId: order._id,

            orderStatus: order.orderStatus
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel order",

            error: error.message
        });
    }
};


// =====================================================
// Get Order Status History - Customer
// =====================================================
const getOrderStatusHistory = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check customer ownership
        if (order.customerId.toString() !== req.user.id) {
            return res.status(403).json({
                message:
                    "You can only view history of your own orders"
            });
        }

        const history =
            await OrderStatusHistory.find({
                orderId: order._id
            }).sort({
                changedAt: 1
            });

        res.status(200).json({
            message:
                "Order status history fetched successfully",

            orderId: order._id,

            history
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to fetch order status history",

            error: error.message
        });
    }
};


// =====================================================
// Update Payment Status
// =====================================================
const updatePaymentStatus = async (req, res) => {
    try {
        const order = await Order.findById(
            req.params.orderId
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Make sure the order belongs to logged-in customer
        if (
            order.customerId.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                    "You can only update your own order payment"
            });
        }

        order.paymentStatus = "paid";

        const updatedOrder =
            await order.save();

        res.status(200).json({
            message:
                "Payment status updated successfully",

            order: updatedOrder
        });

    } catch (error) {
        console.error(
            "Update payment status error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update payment status",

            error: error.message
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================
module.exports = {
    createCustomOrder,
    getCustomerOrders,
    getCustomerOrderById,
    getCustomerOrderTracking,
    getArtisanOrders,
    updateOrderStatus,
    cancelOrder,
    getOrderStatusHistory,
    updatePaymentStatus
};