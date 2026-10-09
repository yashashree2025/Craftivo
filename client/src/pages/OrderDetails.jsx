
import { useEffect, useState } from "react";
import {
    Link,
    useParams,
    useNavigate,
} from "react-router-dom";
import {
    ArrowLeft,
    Package,
    MapPin,
    User,
    CreditCard,
    CheckCircle,
} from "lucide-react";
import { getOrderById } from "../services/orderService";

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getOrderById(id);

                setOrder(data.order);
            } catch (error) {
                console.error(
                    "Order details error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load order details."
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) {
        return (
            <main className="order-details-page">
                <div className="order-loading">
                    Loading your order...
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="order-details-page">
                <div className="order-error">
                    {error || "Order not found."}
                </div>
            </main>
        );
    }

    const product = order.product;

    const imageUrl =
        product?.images &&
        product.images.length > 0
            ? `http://localhost:5000/${product.images[0]}`
            : null;

    const customizationEntries =
        order.customizationDetails
            ? Object.entries(
                  order.customizationDetails
              )
            : [];

    const formattedDate = order.createdAt
        ? new Date(
              order.createdAt
          ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "—";

    /*
     * The URL already contains the real MongoDB order ID.
     * Example:
     * /orders/6a9aee040001c2fef8835632
     */
    const realOrderId = id;

    return (
        <main className="order-details-page">

            <div className="order-details-container">

                {/* Back */}
                <Link
                    to="/"
                    className="back-link"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                {/* Heading */}
                <div className="order-details-heading">

                    <div>
                        <p className="section-label">
                            CRAFTIVO ORDER
                        </p>

                        <h1>
                            Order Details
                        </h1>

                        <p>
                            Thank you for choosing
                            handmade. Here is
                            everything about your
                            order.
                        </p>
                    </div>

                    <div className="order-number">

                        <span>
                            Order ID
                        </span>

                        <strong>
                            #{String(realOrderId).slice(-8)}
                        </strong>

                    </div>

                </div>

                {/* Order Status */}
                <div className="order-status-banner">

                    <div className="order-status-icon">
                        <CheckCircle
                            size={25}
                        />
                    </div>

                    <div>
                        <span>
                            Current Order Status
                        </span>

                        <strong>
                            {order.orderStatus
                                ?.replace(
                                    "_",
                                    " "
                                )
                                .replace(
                                    /\b\w/g,
                                    (letter) =>
                                        letter.toUpperCase()
                                )}
                        </strong>
                    </div>

                    <div className="order-date">

                        <span>
                            Placed on
                        </span>

                        <strong>
                            {formattedDate}
                        </strong>

                    </div>

                </div>

                {/* Main Layout */}
                <div className="order-details-layout">

                    <div className="order-main-content">

                        {/* Product */}
                        <section className="order-card">

                            <div className="order-card-heading">

                                <Package
                                    size={21}
                                />

                                <h2>
                                    Ordered Product
                                </h2>

                            </div>

                            <div className="ordered-product">

                                <div className="ordered-product-image">

                                    {imageUrl ? (
                                        <img
                                            src={
                                                imageUrl
                                            }
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

                                <div className="ordered-product-info">

                                    <p>
                                        {
                                            product?.category
                                        }
                                    </p>

                                    <h3>
                                        {
                                            product?.name
                                        }
                                    </h3>

                                    <span>
                                        {
                                            product?.material ||
                                            "Handmade"
                                        }
                                    </span>

                                </div>

                                <div className="ordered-product-price">

                                    ₹
                                    {
                                        product?.price
                                    }

                                </div>

                            </div>

                        </section>

                        {/* Artisan */}
                        <section className="order-card">

                            <div className="order-card-heading">

                                <User
                                    size={21}
                                />

                                <h2>
                                    Your Artisan
                                </h2>

                            </div>

                            <div className="artisan-info">

                                <div className="artisan-avatar">

                                    {order.artisan?.name
                                        ?.charAt(
                                            0
                                        )
                                        ?.toUpperCase() ||
                                        "A"}

                                </div>

                                <div>

                                    <h3>
                                        {
                                            order
                                                .artisan
                                                ?.name ||
                                            "Craftivo Artisan"
                                        }
                                    </h3>

                                    <p>
                                        {
                                            order
                                                .artisan
                                                ?.email ||
                                            "Artisan seller"
                                        }
                                    </p>

                                </div>

                            </div>

                        </section>

                        {/* Shipping */}
                        <section className="order-card">

                            <div className="order-card-heading">

                                <MapPin
                                    size={21}
                                />

                                <h2>
                                    Shipping Address
                                </h2>

                            </div>

                            <div className="shipping-address">

                                <strong>
                                    {
                                        order
                                            .shippingAddress
                                            ?.name
                                    }
                                </strong>

                                <p>
                                    {
                                        order
                                            .shippingAddress
                                            ?.phone
                                    }
                                </p>

                                <p>
                                    {
                                        order
                                            .shippingAddress
                                            ?.address
                                    }
                                </p>

                                <p>
                                    {
                                        order
                                            .shippingAddress
                                            ?.city
                                    }
                                    ,{" "}
                                    {
                                        order
                                            .shippingAddress
                                            ?.state
                                    }
                                </p>

                                <p>
                                    {
                                        order
                                            .shippingAddress
                                            ?.pincode
                                    }
                                </p>

                            </div>

                        </section>

                        {/* Customization */}
                        {customizationEntries.length >
                            0 && (
                            <section className="order-card">

                                <div className="order-card-heading">

                                    <span className="custom-icon">
                                        ✦
                                    </span>

                                    <h2>
                                        Customization
                                        Details
                                    </h2>

                                </div>

                                <div className="customization-details">

                                    {customizationEntries.map(
                                        ([
                                            key,
                                            value,
                                        ]) => (
                                            <div
                                                className="custom-detail-row"
                                                key={
                                                    key
                                                }
                                            >

                                                <span>
                                                    {
                                                        key
                                                    }
                                                </span>

                                                <strong>
                                                    {
                                                        value ||
                                                        "Not specified"
                                                    }
                                                </strong>

                                            </div>
                                        )
                                    )}

                                </div>

                            </section>
                        )}

                    </div>

                    {/* Payment Summary */}
                    <aside className="order-summary-card">

                        <div className="order-summary-heading">

                            <CreditCard
                                size={21}
                            />

                            <h2>
                                Payment Summary
                            </h2>

                        </div>

                        <div className="order-summary-row">

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

                        <div className="order-summary-row">

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

                        <div className="order-summary-divider" />

                        <div className="order-summary-total">

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

                        {/* Payment Status */}
                        <div className="payment-status">

                            <span>
                                Payment Status
                            </span>

                            <strong>
                                {order.paymentStatus
                                    ?.replace(
                                        "_",
                                        " "
                                    )
                                    .replace(
                                        /\b\w/g,
                                        (letter) =>
                                            letter.toUpperCase()
                                    )}
                            </strong>

                        </div>

                        {/* Pay Now */}
                        {order.paymentStatus ===
                            "pending" && (
                            <button
                                type="button"
                                className="pay-now-order-button"
                                onClick={() =>
                                    navigate(
                                        `/payment/${realOrderId}`,
                                        {
                                            state: {
                                                order,
                                            },
                                        }
                                    )
                                }
                            >
                                <CreditCard
                                    size={18}
                                />

                                Pay Now ₹
                                {
                                    order.totalAmount
                                }
                            </button>
                        )}

                        {/* Track Order */}
                        <Link
                            to={`/orders/${realOrderId}/tracking`}
                            className="track-order-button"
                        >
                            <Package
                                size={18}
                            />

                            Track Order
                        </Link>

                    </aside>

                </div>

            </div>

        </main>
    );
}

export default OrderDetails;
