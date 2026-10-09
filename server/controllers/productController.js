const Product = require("../models/Product");
const Review = require("../models/Review");
// Add Product
// Add Product
const addProduct = async (req, res) => {
    try {
        console.log("FILES:", req.files);
        console.log("BODY:", req.body);

        const {
            name,
            description,
            category,
            price,
            material,
            stock,
            isCustomizable,
            customizationOptions
        } = req.body;

        if (!name || !description || !category || price === undefined) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        // Get uploaded image paths from Multer
        const images = req.files
    ? req.files.map((file) => file.path.replace(/\\/g, "/"))
    : [];

        const product = await Product.create({
            artisanId: req.user.id,
            name,
            description,
            category,
            price,
            material,
            stock: stock || 0,

            // Convert string "true" to boolean true
            isCustomizable: isCustomizable === "true",

            // Convert comma-separated string into array
            customizationOptions: customizationOptions
                ? customizationOptions
                    .split(",")
                    .map(option => option.trim())
                : [],

            // Save Multer image paths
            images
        });

        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {
        console.error("ADD PRODUCT ERROR:", error);

        res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
};
// Get All Products
// Get All Products with Search and Category Filter
// Get All Products with Search, Category and Price Filter
const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            isCustomizable
        } = req.query;

        let filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        if (isCustomizable !== undefined) {
            filter.isCustomizable = isCustomizable === "true";
        }

        const products = await Product.find(filter);

        const productsWithRatings = await Promise.all(
            products.map(async (product) => {
                const reviews = await Review.find({
                    productId: product._id
                });

                const totalReviews = reviews.length;

                const averageRating =
                    totalReviews === 0
                        ? 0
                        : Number(
                              (
                                  reviews.reduce(
                                      (sum, review) => sum + review.rating,
                                      0
                                  ) / totalReviews
                              ).toFixed(1)
                          );

                return {
                    ...product.toObject(),
                    averageRating,
                    totalReviews
                };
            })
        );

        res.status(200).json({
            message: "Products fetched successfully",
            count: productsWithRatings.length,
            products: productsWithRatings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });
    }
};
// Get Single Product
// Get Single Product with Rating Summary
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("artisanId", "name email");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const reviews = await Review.find({
            productId: product._id
        });

        const totalReviews = reviews.length;

        const averageRating =
            totalReviews === 0
                ? 0
                : Number(
                      (
                          reviews.reduce(
                              (sum, review) => sum + review.rating,
                              0
                          ) / totalReviews
                      ).toFixed(1)
                  );

        res.status(200).json({
            message: "Product fetched successfully",
            product: {
                ...product.toObject(),
                averageRating,
                totalReviews
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message
        });
    }
};

// Get Artisan's Own Products
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({
            artisanId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Your products fetched successfully",
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your products",
            error: error.message
        });
    }
};
// Update Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check product ownership
        if (product.artisanId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only update your own products"
            });
        }

        const {
            name,
            description,
            category,
            price,
            material,
            stock,
            isCustomizable,
            customizationOptions
        } = req.body;

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.category = category ?? product.category;
        product.price = price ?? product.price;
        product.material = material ?? product.material;
        product.stock = stock ?? product.stock;
        product.isCustomizable = isCustomizable ?? product.isCustomizable;
        product.customizationOptions =
            customizationOptions ?? product.customizationOptions;

        const updatedProduct = await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
};


// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check product ownership
        if (product.artisanId.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own products"
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });
    }
};

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    getMyProducts,
    updateProduct,
    deleteProduct

};