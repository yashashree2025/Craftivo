
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ArtisanOrderDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] =
        useState(false);

    const [error, setError] = useState("");
    const [statusMessage, setStatusMessage] =
        useState("");

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login as an artisan."
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

            const orders =
                response.data.orders || [];

            const foundOrder = orders.find(
                (item) =>
                    String(item.orderId) ===
                    String(id)
            );

            if (!foundOrder) {
                setError("Order not found.");
                return;
            }

            setOrder(foundOrder);
        } catch (error) {
            console.error(
                "Fetch artisan order details error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load order details."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (
        nextStatus
    ) => {
        try {
            setUpdatingStatus(true);
            setError("");
            setStatusMessage("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login as an artisan."
                );
                return;
            }

            const response = await axios.put(
                `http://localhost:5000/api/orders/${id}/status`,
                {
                    orderStatus: nextStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrder((previousOrder) => ({
                ...previousOrder,
                orderStatus:
                    response.data.order
                        ?.orderStatus ||
                    nextStatus,
            }));

            setStatusMessage(
                `Order status updated to ${formatStatus(
                    nextStatus
                )}.`
            );
        } catch (error) {
            console.error(
                "Update order status error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to update order status."
            );
        } finally {
            setUpdatingStatus(false);
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
                month: "long",
                year: "numeric",
            }
        );
    };

    const getCustomizationEntries = () => {
        if (!order?.customizationDetails) {
            return [];
        }

        return Object.entries(
            order.customizationDetails
        ).filter(
            ([, value]) =>
                value !== null &&
                value !== undefined &&
                value !== ""
        );
    };

    const getNextStatus = () => {
        const nextStatuses = {
            placed: "confirmed",
            confirmed: "in_progress",
            in_progress: "shipped",
            shipped: "delivered",
        };

        return nextStatuses[order?.orderStatus] || null;
    };

    const getNextStatusLabel = () => {
        const nextStatus = getNextStatus();

        if (!nextStatus) {
            return null;
        }

        const labels = {
            confirmed: "Confirm Order",
            in_progress: "Start Processing",
            shipped: "Mark as Shipped",
            delivered: "Mark as Delivered",
        };

        return labels[nextStatus];
    };

    if (loading) {
        return (
            <main className="artisan-order-details-page">
                <div className="artisan-order-details-container">
                    <div className="artisan-order-details-loading">
                        Loading order details...
                    </div>
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="artisan-order-details-page">
                <div className="artisan-order-details-container">

                    <button
                        type="button"
                        className="artisan-order-details-back"
                        onClick={() =>
                            navigate(
                                "/artisan/orders"
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Orders
                    </button>

                    <div className="artisan-order-details-error">
                        {error ||
                            "Order not found."}
                    </div>
                </div>
            </main>
        );
    }

    const product =
        order.product || {};

    const customer =
        order.customer || {};

    const shippingAddress =
        order.shippingAddress || {};

    const customizationEntries =
        getCustomizationEntries();

    const nextStatus =
        getNextStatus();

    const nextStatusLabel =
        getNextStatusLabel();

    return (
        <main className="artisan-order-details-page">
            <div className="artisan-order-details-container">

                <button
                    type="button"
                    className="artisan-order-details-back"
                    onClick={() =>
                        navigate(
                            "/artisan/orders"
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Orders
                </button>

                {/* Header */}

                <div className="artisan-order-details-header">

                    <div>
                        <p>CRAFTIVO ARTISAN</p>

                        <h1>
                            Order Details
                        </h1>

                        <span>
                            Order #
                            {String(
                                order.orderId
                            ).slice(-8)}
                        </span>
                    </div>

                    <div className="artisan-order-header-status">

                        <span
                            className={`artisan-detail-payment ${
                                order.paymentStatus ===
                                "paid"
                                    ? "paid"
                                    : "pending"
                            }`}
                        >
                            {order.paymentStatus ===
                            "paid"
                                ? "Payment Paid"
                                : "Payment Pending"}
                        </span>

                        <span
                            className={`artisan-detail-order-status status-${order.orderStatus}`}
                        >
                            {formatStatus(
                                order.orderStatus
                            )}
                        </span>

                    </div>
                </div>

                <div className="artisan-order-details-grid">

                    {/* Product */}

                    <section className="artisan-detail-card artisan-product-detail-card">

                        <div className="artisan-detail-card-title">
                            <Package size={20} />

                            <h2>
                                Product
                            </h2>
                        </div>

                        <div className="artisan-product-detail-content">

                            <div className="artisan-detail-product-image">
                                {product.images
                                    ?.length >
                                0 ? (
                                    <img
                                        src={`http://localhost:5000/${product.images[0]}`}
                                        alt={
                                            product.name ||
                                            "Product"
                                        }
                                    />
                                ) : (
                                    <Package
                                        size={42}
                                    />
                                )}
                            </div>

                            <div>
                                <h3>
                                    {product.name ||
                                        "Custom Product"}
                                </h3>

                                {product.category && (
                                    <p>
                                        Category:{" "}
                                        {
                                            product.category
                                        }
                                    </p>
                                )}

                                {product.material && (
                                    <p>
                                        Material:{" "}
                                        {
                                            product.material
                                        }
                                    </p>
                                )}
                            </div>

                        </div>
                    </section>

                    {/* Customer */}

                    <section className="artisan-detail-card">

                        <div className="artisan-detail-card-title">
                            <User size={20} />

                            <h2>
                                Customer
                            </h2>
                        </div>

                        <div className="artisan-customer-details">

                            <div>
                                <span>
                                    Name
                                </span>

                                <strong>
                                    {customer.name ||
                                        "N/A"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Email
                                </span>

                                <strong>
                                    {customer.email ||
                                        "N/A"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {customer.phone ||
                                        "N/A"}
                                </strong>
                            </div>

                        </div>
                    </section>

                    {/* Shipping Address */}

                    <section className="artisan-detail-card">

                        <div className="artisan-detail-card-title">
                            <MapPin size={20} />

                            <h2>
                                Shipping Address
                            </h2>
                        </div>

                        <div className="artisan-shipping-details">

                            <strong>
                                {shippingAddress.name ||
                                    customer.name ||
                                    "Customer"}
                            </strong>

                            {shippingAddress.phone && (
                                <p>
                                    Phone:{" "}
                                    {
                                        shippingAddress.phone
                                    }
                                </p>
                            )}

                            {shippingAddress.address && (
                                <p>
                                    {
                                        shippingAddress.address
                                    }
                                </p>
                            )}

                            <p>
                                {[
                                    shippingAddress.city,
                                    shippingAddress.state,
                                    shippingAddress.pincode,
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>

                        </div>
                    </section>

                    {/* Payment */}

                    <section className="artisan-detail-card">

                        <div className="artisan-detail-card-title">
                            <CreditCard size={20} />

                            <h2>
                                Payment Summary
                            </h2>
                        </div>

                        <div className="artisan-payment-summary">

                            <div>
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {
                                        order.subtotal
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    ₹
                                    {
                                        order.deliveryCharge
                                    }
                                </strong>
                            </div>

                            <div className="artisan-payment-total">
                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {
                                        order.totalAmount
                                    }
                                </strong>
                            </div>

                            <div className="artisan-payment-status-row">
                                <span>
                                    Payment Status
                                </span>

                                <strong>
                                    {order.paymentStatus ===
                                    "paid"
                                        ? "Paid"
                                        : "Pending"}
                                </strong>
                            </div>

                        </div>
                    </section>

                    {/* Customization */}

                    {customizationEntries.length >
                        0 && (
                        <section className="artisan-detail-card artisan-customization-card">

                            <div className="artisan-detail-card-title">
                                <Package size={20} />

                                <h2>
                                    Customization
                                    Details
                                </h2>
                            </div>

                            <div className="artisan-customization-grid">

                                {customizationEntries.map(
                                    ([
                                        key,
                                        value,
                                    ]) => (
                                        <div
                                            key={key}
                                        >
                                            <span>
                                                {key
                                                    .replace(
                                                        /_/g,
                                                        " "
                                                    )
                                                    .replace(
                                                        /\b\w/g,
                                                        (
                                                            letter
                                                        ) =>
                                                            letter.toUpperCase()
                                                    )}
                                            </span>

                                            <strong>
                                                {String(
                                                    value
                                                )}
                                            </strong>
                                        </div>
                                    )
                                )}

                            </div>
                        </section>
                    )}

                    {/* Order Information */}

                    <section className="artisan-detail-card">

                        <div className="artisan-detail-card-title">
                            <Clock size={20} />

                            <h2>
                                Order Information
                            </h2>
                        </div>

                        <div className="artisan-order-information">

                            <div>
                                <span>
                                    Order ID
                                </span>

                                <strong>
                                    #
                                    {String(
                                        order.orderId
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Order Date
                                </span>

                                <strong>
                                    {formatDate(
                                        order.createdAt
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Current Status
                                </span>

                                <strong>
                                    {formatStatus(
                                        order.orderStatus
                                    )}
                                </strong>
                            </div>

                        </div>
                    </section>

                </div>

                {/* Status Management */}

                <section className="artisan-status-management">

                    <div className="artisan-status-management-title">
                        <Truck size={22} />

                        <div>
                            <h2>
                                Manage Order Status
                            </h2>

                            <p>
                                Update the order as you
                                complete each stage.
                            </p>
                        </div>
                    </div>

                    <div className="artisan-status-timeline">

                        {[
                            "placed",
                            "confirmed",
                            "in_progress",
                            "shipped",
                            "delivered",
                        ].map(
                            (
                                status,
                                index
                            ) => {

                                const statuses = [
                                    "placed",
                                    "confirmed",
                                    "in_progress",
                                    "shipped",
                                    "delivered",
                                ];

                                const currentIndex =
                                    statuses.indexOf(
                                        order.orderStatus
                                    );

                                const completed =
                                    index <=
                                    currentIndex;

                                const current =
                                    status ===
                                    order.orderStatus;

                                return (
                                    <div
                                        className={`artisan-status-step ${
                                            completed
                                                ? "completed"
                                                : ""
                                        } ${
                                            current
                                                ? "current"
                                                : ""
                                        }`}
                                        key={status}
                                    >
                                        <div className="artisan-status-icon">
                                            {completed ? (
                                                <CheckCircle
                                                    size={
                                                        22
                                                    }
                                                />
                                            ) : (
                                                <span>
                                                    {index +
                                                        1}
                                                </span>
                                            )}
                                        </div>

                                        <span>
                                            {formatStatus(
                                                status
                                            )}
                                        </span>
                                    </div>
                                );
                            }
                        )}

                    </div>

                    {/* Success */}

                    {statusMessage && (
                        <div className="artisan-status-success">
                            <CheckCircle
                                size={18}
                            />

                            {statusMessage}
                        </div>
                    )}

                    {/* Error */}

                    {error && (
                        <div className="artisan-status-error">
                            <XCircle
                                size={18}
                            />

                            {error}
                        </div>
                    )}

                    {/* Update Button */}

                    {nextStatus && (
                        <div className="artisan-status-action">

                            <button
                                type="button"
                                className="artisan-update-status-button"
                                onClick={() =>
                                    updateOrderStatus(
                                        nextStatus
                                    )
                                }
                                disabled={
                                    updatingStatus
                                }
                            >
                                {updatingStatus
                                    ? "Updating..."
                                    : nextStatusLabel}
                            </button>

                        </div>
                    )}

                    {order.orderStatus ===
                        "delivered" && (
                        <div className="artisan-order-completed">
                            <CheckCircle
                                size={20}
                            />

                            <span>
                                This order has been
                                successfully delivered.
                            </span>
                        </div>
                    )}

                    {order.orderStatus ===
                        "cancelled" && (
                        <div className="artisan-order-cancelled">
                            <XCircle
                                size={20}
                            />

                            <span>
                                This order has been
                                cancelled.
                            </span>
                        </div>
                    )}

                </section>

            </div>
        </main>
    );
};

export default ArtisanOrderDetails;

