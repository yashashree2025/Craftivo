import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Eye,
    Truck,
    ShoppingBag,
    Star,
} from "lucide-react";

import { getCustomerOrders } from "../services/orderService";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getCustomerOrders();

                console.log("CUSTOMER ORDERS:", data);

                setOrders(data.orders || []);
            } catch (error) {
                console.error("Orders error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load your orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatStatus = (status) => {
        if (!status) return "Unknown";

        return status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <main className="orders-page">
                <div className="orders-loading">
                    Loading your orders...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="orders-page">
                <div className="orders-container">

                    <Link
                        to="/"
                        className="back-link"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <div className="orders-error">
                        {error}
                    </div>

                </div>
            </main>
        );
    }

    if (orders.length === 0) {
        return (
            <main className="orders-page">

                <div className="orders-container">

                    <Link
                        to="/products"
                        className="back-link"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>

                    <div className="orders-heading">

                        <p className="section-label">
                            CRAFTIVO ORDERS
                        </p>

                        <h1>My Orders</h1>

                        <p>
                            Keep track of your handmade
                            creations in one place.
                        </p>

                    </div>

                    <div className="empty-orders">

                        <div className="empty-orders-icon">
                            <ShoppingBag size={42} />
                        </div>

                        <h2>No orders yet</h2>

                        <p>
                            Your handmade journey starts here.
                            Discover something beautiful from
                            our artisans.
                        </p>

                        <Link
                            to="/products"
                            className="browse-products-button"
                        >
                            Discover Products
                        </Link>

                    </div>

                </div>

            </main>
        );
    }

    return (
        <main className="orders-page">

            <div className="orders-container">

                <Link
                    to="/"
                    className="back-link"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <div className="orders-heading">

                    <div>

                        <p className="section-label">
                            CRAFTIVO ORDERS
                        </p>

                        <h1>My Orders</h1>

                        <p>
                            Keep track of your handmade
                            creations and deliveries.
                        </p>

                    </div>

                    <div className="orders-count">
                        {orders.length}{" "}
                        {orders.length === 1
                            ? "Order"
                            : "Orders"}
                    </div>

                </div>

                <div className="orders-list">

                    {orders.map((order) => {

                        const product = order.product;

                        const imageUrl =
                            product?.images &&
                            product.images.length > 0
                                ? `http://localhost:5000/${product.images[0]}`
                                : null;

                        return (
                            <article
                                className="order-list-card"
                                key={order.orderId}
                            >

                                {/* ORDER HEADER */}

                                <div className="order-list-top">

                                    <div>

                                        <span>
                                            ORDER ID
                                        </span>

                                        <strong>
                                            #
                                            {String(
                                                order.orderId
                                            ).slice(-8)}
                                        </strong>

                                    </div>

                                    <div className="order-list-date">

                                        <span>
                                            ORDERED ON
                                        </span>

                                        <strong>
                                            {formatDate(
                                                order.createdAt
                                            )}
                                        </strong>

                                    </div>

                                </div>

                                {/* PRODUCT INFORMATION */}

                                <div className="order-list-content">

                                    <div className="order-list-image">

                                        {imageUrl ? (

                                            <img
                                                src={imageUrl}
                                                alt={
                                                    product?.name ||
                                                    "Product"
                                                }
                                            />

                                        ) : (

                                            <span>
                                                ✦
                                            </span>

                                        )}

                                    </div>

                                    <div className="order-list-product">

                                        <p>
                                            {product?.category ||
                                                "Handmade Product"}
                                        </p>

                                        <h2>
                                            {product?.name ||
                                                "Craftivo Product"}
                                        </h2>

                                        <span>
                                            {product?.material ||
                                                "Handmade"}
                                        </span>

                                    </div>

                                    <div className="order-list-total">

                                        <span>
                                            TOTAL
                                        </span>

                                        <strong>
                                            ₹
                                            {order.totalAmount}
                                        </strong>

                                    </div>

                                </div>

                                {/* ORDER STATUS */}

                                <div className="order-list-bottom">

                                    <div className="order-status-group">

                                        <div>

                                            <span>
                                                ORDER STATUS
                                            </span>

                                            <strong
                                                className={`order-status ${order.orderStatus}`}
                                            >
                                                {formatStatus(
                                                    order.orderStatus
                                                )}
                                            </strong>

                                        </div>

                                        <div>

                                            <span>
                                                PAYMENT
                                            </span>

                                            <strong
                                                className={`payment-status-label ${order.paymentStatus}`}
                                            >
                                                {formatStatus(
                                                    order.paymentStatus
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="order-list-actions">

                                        <Link
                                            to={`/orders/${order.orderId}`}
                                            className="view-order-link"
                                        >
                                            <Eye size={17} />
                                            View Details
                                        </Link>

                                        <Link
                                            to={`/orders/${order.orderId}/tracking`}
                                            className="track-order-link"
                                        >
                                            <Truck size={17} />
                                            Track Order
                                        </Link>

                                        {/* REVIEW PRODUCT */}
                                        {order.orderStatus === "delivered" &&
                                            product?._id && (
                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="review-product-link"
                                                >
                                                    <Star size={17} />
                                                    Review Product
                                                </Link>
                                            )}

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </div>

            </div>

        </main>
    );
}

export default Orders;