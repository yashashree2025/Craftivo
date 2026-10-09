
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Package,
    Eye,
    Truck,
    CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ArtisanOrders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login as an artisan to view orders."
                );
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/orders/artisan",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrders(
                response.data.orders || []
            );
        } catch (error) {
            console.error(
                "Fetch artisan orders error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (letter) =>
                letter.toUpperCase()
            );
    };

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getProductName = (order) => {
        return (
            order.product?.name ||
            order.productId?.name ||
            "Custom Order"
        );
    };

    const getCustomerName = (order) => {
        return (
            order.customer?.name ||
            order.customerId?.name ||
            order.shippingAddress?.name ||
            "Customer"
        );
    };

    const getOrderId = (order) => {
        return order.orderId || order._id;
    };

    if (loading) {
        return (
            <main className="artisan-orders-page">
                <div className="artisan-orders-container">
                    <div className="artisan-orders-loading">
                        Loading orders...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="artisan-orders-page">
                <div className="artisan-orders-container">
                    <button
                        type="button"
                        className="artisan-orders-back"
                        onClick={() =>
                            navigate(
                                "/artisan/dashboard"
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>

                    <div className="artisan-orders-error">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="artisan-orders-page">
            <div className="artisan-orders-container">

                <button
                    type="button"
                    className="artisan-orders-back"
                    onClick={() =>
                        navigate(
                            "/artisan/dashboard"
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                <div className="artisan-orders-header">
                    <div>
                        <p>CRAFTIVO ARTISAN</p>

                        <h1>Customer Orders</h1>

                        <span>
                            View and manage orders
                            placed for your handmade
                            products.
                        </span>
                    </div>
                </div>

                <div className="artisan-orders-summary">
                    <div className="artisan-order-summary-card">
                        <Package size={20} />

                        <div>
                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {orders.length}
                            </strong>
                        </div>
                    </div>

                    <div className="artisan-order-summary-card">
                        <Truck size={20} />

                        <div>
                            <span>
                                Active Orders
                            </span>

                            <strong>
                                {
                                    orders.filter(
                                        (order) =>
                                            ![
                                                "delivered",
                                                "cancelled",
                                            ].includes(
                                                order.orderStatus
                                            )
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="artisan-order-summary-card">
                        <CreditCard size={20} />

                        <div>
                            <span>
                                Paid Orders
                            </span>

                            <strong>
                                {
                                    orders.filter(
                                        (order) =>
                                            order.paymentStatus ===
                                            "paid"
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="artisan-orders-empty">
                        <div className="artisan-orders-empty-icon">
                            <Package size={36} />
                        </div>

                        <h2>
                            No Orders Yet
                        </h2>

                        <p>
                            Customer orders for your
                            products will appear here.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/artisan/products"
                                )
                            }
                        >
                            View My Products
                        </button>
                    </div>
                ) : (
                    <div className="artisan-orders-list">
                        {orders.map((order) => {
                            const orderId =
                                getOrderId(order);

                            return (
                                <article
                                    className="artisan-order-card"
                                    key={orderId}
                                >
                                    <div className="artisan-order-main">

                                        <div className="artisan-order-product-image">
                                            {order.product
                                                ?.images
                                                ?.length >
                                            0 ? (
                                                <img
                                                    src={`http://localhost:5000/${order.product.images[0]}`}
                                                    alt={getProductName(
                                                        order
                                                    )}
                                                />
                                            ) : (
                                                <Package
                                                    size={32}
                                                />
                                            )}
                                        </div>

                                        <div className="artisan-order-info">
                                            <div className="artisan-order-id">
                                                Order #
                                                {String(
                                                    orderId
                                                ).slice(-8)}
                                            </div>

                                            <h2>
                                                {getProductName(
                                                    order
                                                )}
                                            </h2>

                                            <p>
                                                Customer:{" "}
                                                <strong>
                                                    {getCustomerName(
                                                        order
                                                    )}
                                                </strong>
                                            </p>

                                            <span>
                                                Ordered on{" "}
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </span>
                                        </div>

                                        <div className="artisan-order-amount">
                                            <span>
                                                Total Amount
                                            </span>

                                            <strong>
                                                ₹
                                                {
                                                    order.totalAmount
                                                }
                                            </strong>
                                        </div>

                                        <div className="artisan-order-status-area">
                                            <span
                                                className={`artisan-payment-status ${
                                                    order.paymentStatus ===
                                                    "paid"
                                                        ? "paid"
                                                        : "pending"
                                                }`}
                                            >
                                                {order.paymentStatus ===
                                                "paid"
                                                    ? "Paid"
                                                    : "Payment Pending"}
                                            </span>

                                            <span
                                                className={`artisan-order-status status-${order.orderStatus}`}
                                            >
                                                {formatStatus(
                                                    order.orderStatus
                                                )}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="artisan-view-order-button"
                                            onClick={() =>
                                                navigate(`/artisan/orders/${orderId}`)
                                            }
                                        >
                                            <Eye size={17} />
                                            View
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ArtisanOrders;
