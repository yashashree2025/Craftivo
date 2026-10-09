const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add Product to Cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        // Find customer's cart
        let cart = await Cart.findOne({
            customerId: req.user.id
        });

        // Create cart if it doesn't exist
        if (!cart) {
            cart = await Cart.create({
                customerId: req.user.id,
                items: [
                    {
                        productId: product._id,
                        quantity,
                        price: product.price
                    }
                ]
            });

            return res.status(201).json({
                message: "Product added to cart successfully",
                cart
            });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(
            (item) =>
                item.productId.toString() === productId
        );

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + Number(quantity);

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: "Insufficient stock"
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                productId: product._id,
                quantity,
                price: product.price
            });
        }

        await cart.save();

        res.status(200).json({
            message: "Product added to cart successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add product to cart",
            error: error.message
        });
    }
};

// Get Customer Cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            customerId: req.user.id
        }).populate(
            "items.productId",
            "name price images category stock isCustomizable"
        );

        if (!cart) {
            return res.status(200).json({
                message: "Cart is empty",
                cart: {
                    items: []
                }
            });
        }

        res.status(200).json({
            message: "Cart fetched successfully",
            cart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch cart",
            error: error.message
        });
    }
};

// Update Cart Item Quantity
const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                message: "Product ID and quantity are required"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        const cart = await Cart.findOne({
            customerId: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const cartItem = cart.items.find(
            (item) =>
                item.productId.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        cartItem.quantity = Number(quantity);

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate(
            "items.productId",
            "name price images category stock isCustomizable"
        );

        res.status(200).json({
            message: "Cart quantity updated successfully",
            cart: updatedCart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update cart quantity",
            error: error.message
        });
    }
};

// Remove Product from Cart
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        const cart = await Cart.findOne({
            customerId: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const itemExists = cart.items.some(
            (item) =>
                item.productId.toString() === productId
        );

        if (!itemExists) {
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }

        cart.items = cart.items.filter(
            (item) =>
                item.productId.toString() !== productId
        );

        await cart.save();

        const updatedCart = await Cart.findById(cart._id).populate(
            "items.productId",
            "name price images category stock isCustomizable"
        );

        res.status(200).json({
            message: "Product removed from cart successfully",
            cart: updatedCart
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to remove product from cart",
            error: error.message
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
};