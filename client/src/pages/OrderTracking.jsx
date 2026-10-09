
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    CheckCircle,
    Clock,
    Truck,
    XCircle,
} from "lucide-react";
import { getOrderTracking } from "../services/orderService";

function OrderTracking() {
    const { id } = useParams();

    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTracking = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getOrderTracking(id);

                setTracking(data);
            } catch (error) {
                console.error("Tracking error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load order tracking."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTracking();
    }, [id]);

    if (loading) {
        return (
            <main className="order-tracking-page">
                <div className="tracking-loading">
                    Loading order tracking...
                </div>
            </main>
        );
    }

    if (error || !tracking) {
        return (
            <main className="order-tracking-page">
                <div className="tracking-error">
                    {error || "Tracking information not found."}
                </div>
            </main>
        );
    }

    const statusLabels = {
        placed: "Order Placed",
        confirmed: "Order Confirmed",
        in_progress: "Crafting in Progress",
        shipped: "Order Shipped",
        delivered: "Order Delivered",
    };

    const statusIcons = {
        placed: Package,
        confirmed: CheckCircle,
        in_progress: Clock,
        shipped: Truck,
        delivered: CheckCircle,
    };

    const currentStatus = tracking.orderStatus;

    return (
        <main className="order-tracking-page">

            <div className="order-tracking-container">

                <Link
                    to={`/orders/${id}`}
                    className="back-link"
                >
                    <ArrowLeft size={18} />
                    Back to Order
                </Link>

                <div className="tracking-heading">

                    <div>
                        <p className="section-label">
                            CRAFTIVO DELIVERY
                        </p>

                        <h1>Track Your Order</h1>

                        <p>
                            Follow your handmade creation from
                            the artisan's workspace to your doorstep.
                        </p>
                    </div>

                    <div className="tracking-order-id">
                        <span>Order ID</span>
                        <strong>
                            #{String(tracking.orderId).slice(-8)}
                        </strong>
                    </div>

                </div>

                {/* Product Summary */}

                <section className="tracking-product-card">

                    <div className="tracking-product-image">

                        {tracking.product?.images?.length > 0 ? (
                            <img
                                src={`http://localhost:5000/${tracking.product.images[0]}`}
                                alt={tracking.product.name}
                            />
                        ) : (
                            <span>✦</span>
                        )}

                    </div>

                    <div className="tracking-product-info">

                        <p>
                            {tracking.product?.category ||
                                "Handmade Product"}
                        </p>

                        <h2>
                            {tracking.product?.name ||
                                "Your Craftivo Order"}
                        </h2>

                        <span>
                            Artisan:{" "}
                            {tracking.artisan?.name ||
                                "Craftivo Artisan"}
                        </span>

                    </div>

                    <div className="tracking-current-status">

                        <span>Current Status</span>

                        <strong>
                            {statusLabels[currentStatus] ||
                                currentStatus}
                        </strong>

                    </div>

                </section>

                {/* Timeline */}

                <section className="tracking-card">

                    <div className="tracking-card-heading">

                        <Package size={22} />

                        <div>
                            <h2>Order Journey</h2>

                            <p>
                                Your handmade creation's journey
                            </p>
                        </div>

                    </div>

                    <div className="tracking-timeline">

                        {tracking.tracking?.map(
                            (step, index) => {

                                const Icon =
                                    statusIcons[step.status] ||
                                    Package;

                                const isCompleted =
                                    step.completed;

                                const isCurrent =
                                    step.status ===
                                    currentStatus;

                                return (
                                    <div
                                        className={`tracking-step ${
                                            isCompleted
                                                ? "completed"
                                                : ""
                                        } ${
                                            isCurrent
                                                ? "current"
                                                : ""
                                        }`}
                                        key={step.status}
                                    >

                                        <div className="timeline-line">

                                            {index > 0 && (
                                                <span
                                                    className={
                                                        step.completed
                                                            ? "line-completed"
                                                            : ""
                                                    }
                                                />
                                            )}

                                        </div>

                                        <div className="timeline-icon">

                                            <Icon size={19} />

                                        </div>

                                        <div className="timeline-content">

                                            <h3>
                                                {statusLabels[
                                                    step.status
                                                ] ||
                                                    step.status}
                                            </h3>

                                            <p>
                                                {isCompleted
                                                    ? "Completed"
                                                    : isCurrent
                                                    ? "Currently here"
                                                    : "Waiting"}
                                            </p>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                </section>

                {/* Payment Information */}

                <section className="tracking-payment-card">

                    <div>
                        <span>Payment Status</span>

                        <strong>
                            {tracking.paymentStatus
                                ?.replace("_", " ")
                                .replace(/\b\w/g, (letter) =>
                                    letter.toUpperCase()
                                )}
                        </strong>
                    </div>

                    <Link
                        to={`/orders/${id}`}
                        className="view-order-button"
                    >
                        View Order Details
                    </Link>

                </section>

                {/* Cancelled */}

                {currentStatus === "cancelled" && (
                    <div className="cancelled-order-message">

                        <XCircle size={22} />

                        <div>
                            <strong>
                                Order Cancelled
                            </strong>

                            <p>
                                This order has been cancelled.
                            </p>
                        </div>

                    </div>
                )}

            </div>

        </main>
    );
}

export default OrderTracking;

