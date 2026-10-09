
import { useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import axios from "axios";

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = useParams();

    const order = location.state?.order;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!order) {
        return (
            <div className="page-container">

                <div className="payment-page">

                    <div className="payment-card">

                        <h1>
                            Payment Details Not Found
                        </h1>

                        <p className="payment-subtitle">
                            Please open payment from
                            your order details page.
                        </p>

                        <button
                            type="button"
                            className="pay-now-button"
                            onClick={() =>
                                navigate("/orders")
                            }
                        >
                            Go to My Orders
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login to make payment."
                );

                setLoading(false);
                return;
            }

            /*
             * Use orderId from the URL.
             * This is the real MongoDB order ID.
             */
            await axios.put(
                `http://localhost:5000/api/orders/${orderId}/payment`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            /*
             * Payment successful
             */
            navigate(
                `/payment-success/${orderId}`,
                {
                    state: {
                        order: {
                            ...order,
                            paymentStatus: "paid",
                        },
                    },
                }
            );

        } catch (error) {
            console.error(
                "Payment error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Payment failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            <div className="payment-page">

                {/* Back */}
                <button
                    type="button"
                    className="payment-back-button"
                    onClick={() =>
                        navigate(
                            `/orders/${orderId}`
                        )
                    }
                >
                    ← Back to Order
                </button>

                {/* Payment Card */}
                <div className="payment-card">

                    <div className="payment-icon">
                        💳
                    </div>

                    <h1>
                        Complete Your Payment
                    </h1>

                    <p className="payment-subtitle">
                        Complete your Craftivo
                        order payment.
                    </p>

                    {/* Order Information */}
                    <div className="payment-order-info">

                        <div>

                            <span>
                                Order ID
                            </span>

                            <strong>
                                #
                                {String(
                                    orderId
                                ).slice(-8)}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Payment Amount
                            </span>

                            <strong>
                                ₹
                                {
                                    order.totalAmount
                                }
                            </strong>

                        </div>

                    </div>

                    {/* Total */}
                    <div className="payment-total">

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

                    {/* Error */}
                    {error && (
                        <div className="payment-error">
                            {error}
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        type="button"
                        className="pay-now-button"
                        onClick={
                            handlePayment
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Processing Payment..."
                            : `Pay Now ₹${order.totalAmount}`}
                    </button>

                    {/* Demo Notice */}
                    <p className="demo-payment-note">
                        This is a demo payment for
                        the Craftivo project. No real
                        money will be charged.
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Payment;

