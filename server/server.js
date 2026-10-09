const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customRequestRoutes = require("./routes/customRequestRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const artisanDashboardRoutes = require("./routes/artisanDashboardRoutes");
const customerDashboardRoutes = require("./routes/customerDashboardRoutes");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/custom-requests", customRequestRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/artisan-dashboard", artisanDashboardRoutes);
app.use("/api/customer-dashboard", customerDashboardRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


connectDB();

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Craftivo API"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Craftivo server running on port ${PORT}`);
});