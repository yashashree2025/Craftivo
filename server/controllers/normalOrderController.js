
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const OrderStatusHistory = require("../models/OrderStatusHistory");
const Product = require("../models/Product");

// Create Normal Order from Cart
const createNormalOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        const cart = await Cart.findOne({
            customerId: req.user.id
        }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let subtotal = 0;

        // Check products and stock before creating order
        for (const item of cart.items) {

            // Product reference is missing/deleted
            if (!item.productId) {
                return res.status(400).json({
                    message:
                        "One of the products in your cart is no longer available. Please remove it from the cart and try again."
                });
            }

            const product = await Product.findById(item.productId._id);

            if (!product) {
                return res.status(404).json({
                    message:
                        `Product not found: ${item.productId._id}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message:
                        `Insufficient stock for ${product.name}. Available stock: ${product.stock}`
                });
            }

            subtotal += item.price * item.quantity;
        }

        const deliveryCharge = 50;
        const totalAmount = subtotal + deliveryCharge;

        // Create order
        const order = await Order.create({
            customerId: req.user.id,

            artisanId: cart.items[0].productId.artisanId,

            productId: cart.items[0].productId._id,

            customRequestId: null,

            customizationDetails: null,

            shippingAddress,

            subtotal,

            deliveryCharge,

            totalAmount,

            paymentStatus: "pending",

            orderStatus: "placed"
        });

        // Create initial order status history
        await OrderStatusHistory.create({
            orderId: order._id,
            status: "placed"
        });

        // Reduce product stock
        for (const item of cart.items) {
            const product = await Product.findById(
                item.productId._id
            );

            if (product) {
                product.stock -= item.quantity;
                await product.save();
            }
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: "Normal order created successfully",
            order
        });

    } catch (error) {

        console.error(
            "CREATE NORMAL ORDER ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to create normal order",
            error: error.message
        });
    }
};

module.exports = {
    createNormalOrder
};

