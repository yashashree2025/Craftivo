const express = require("express");

const {
    addProduct,
    getProducts,
    getProductById,
    getMyProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const {
    protect,
    artisanOnly
} = require("../middleware/authMiddleware");

const upload = require("../config/multer");

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get artisan's own products
router.get("/my-products", protect, artisanOnly, getMyProducts);

// Get single product
router.get("/:id", getProductById);

// Add product
router.post("/", protect, artisanOnly, upload.array("images", 5), addProduct);

// Update product
router.put("/:id", protect, artisanOnly, updateProduct);

// Delete product
router.delete("/:id", protect, artisanOnly, deleteProduct);

module.exports = router;