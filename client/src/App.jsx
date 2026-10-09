
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import OrderDetails from "./pages/OrderDetails";
import OrderTracking from "./pages/OrderTracking";
import Orders from "./pages/Orders";

import Wishlist from "./pages/Wishlist";

import CustomRequest from "./pages/CustomRequest";
import Custom from "./pages/Custom";
import CustomRequests from "./pages/CustomRequests";
import ArtisanCustomRequests from "./pages/ArtisanCustomRequests";
import CustomCheckout from "./pages/CustomCheckout";

import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";

import ArtisanDashboard from "./pages/ArtisanDashboard";
import ArtisanAddProduct from "./pages/ArtisanAddProduct";
import ArtisanProducts from "./pages/ArtisanProducts";
import ArtisanEditProduct from "./pages/ArtisanEditProduct";
import ArtisanOrders from "./pages/ArtisanOrders";
import ArtisanOrderDetails from "./pages/ArtisanOrderDetails";

import CustomerDashboard from "./pages/CustomerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Artisans from "./pages/Artisans";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* ========================================= */}
                {/* PUBLIC ROUTES */}
                {/* ========================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/custom"
                    element={<Custom />}
                />

                {/* Artisans - Public */}
                <Route
                    path="/artisans"
                    element={<Artisans />}
                />


                {/* ========================================= */}
                {/* LOGGED-IN USER ROUTES */}
                {/* Customer OR Artisan */}
                {/* ========================================= */}

                <Route element={<ProtectedRoute />}>

                    {/* Cart */}
                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    {/* Checkout */}
                    <Route
                        path="/checkout"
                        element={<Checkout />}
                    />

                    {/* Orders */}
                    <Route
                        path="/orders"
                        element={<Orders />}
                    />

                    <Route
                        path="/orders/:id"
                        element={<OrderDetails />}
                    />

                    <Route
                        path="/orders/:id/tracking"
                        element={<OrderTracking />}
                    />

                    {/* Wishlist */}
                    <Route
                        path="/wishlist"
                        element={<Wishlist />}
                    />

                    {/* Custom Request */}
                    <Route
                        path="/custom-request/:productId"
                        element={<CustomRequest />}
                    />

                    <Route
                        path="/custom-requests"
                        element={<CustomRequests />}
                    />

                    {/* Custom Checkout */}
                    <Route
                        path="/custom-checkout"
                        element={<CustomCheckout />}
                    />

                    {/* Payment */}
                    <Route
                        path="/payment/:orderId"
                        element={<Payment />}
                    />

                    {/* Payment Success */}
                    <Route
                        path="/payment-success/:orderId"
                        element={<PaymentSuccess />}
                    />

                </Route>


                {/* ========================================= */}
                {/* CUSTOMER ONLY ROUTES */}
                {/* ========================================= */}

                <Route
                    element={<ProtectedRoute role="customer" />}
                >

                    <Route
                        path="/customer/dashboard"
                        element={<CustomerDashboard />}
                    />

                </Route>


                {/* ========================================= */}
                {/* ARTISAN ONLY ROUTES */}
                {/* ========================================= */}

                <Route
                    element={<ProtectedRoute role="artisan" />}
                >

                    {/* Artisan Dashboard */}
                    <Route
                        path="/artisan/dashboard"
                        element={<ArtisanDashboard />}
                    />

                    {/* Add Product */}
                    <Route
                        path="/artisan/add-product"
                        element={<ArtisanAddProduct />}
                    />

                    {/* Artisan Products */}
                    <Route
                        path="/artisan/products"
                        element={<ArtisanProducts />}
                    />

                    {/* Edit Product */}
                    <Route
                        path="/artisan/products/edit/:id"
                        element={<ArtisanEditProduct />}
                    />

                    {/* Artisan Orders */}
                    <Route
                        path="/artisan/orders"
                        element={<ArtisanOrders />}
                    />

                    <Route
                        path="/artisan/orders/:id"
                        element={<ArtisanOrderDetails />}
                    />

                    {/* Artisan Custom Requests */}
                    <Route
                        path="/artisan/custom-requests"
                        element={<ArtisanCustomRequests />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;
