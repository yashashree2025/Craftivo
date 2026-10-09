
import { useLocation, useNavigate, useParams } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const location = useLocation();

    const order = location.state?.order;

    const handleViewOrder = () => {
        navigate(`/orders/${orderId}`);
    };

    return (
        <div className="page-container">

            <div className="payment-success-page">

                <div className="payment-success-card">

                    <div className="success-icon">
                        ✓
                    </div>

                    <h1>
                        Payment Successful!
                    </h1>

                    <p className="success-message">
                        Thank you for your payment.
                        Your Craftivo order has been
                        successfully paid.
                    </p>

                    <div className="success-order-info">

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

                        {order?.totalAmount && (
                            <div>
                                <span>
                                    Amount Paid
                                </span>

                                <strong>
                                    ₹
                                    {
                                        order.totalAmount
                                    }
                                </strong>
                            </div>
                        )}

                    </div>

                    <div className="payment-success-actions">

                        <button
                            type="button"
                            onClick={
                                handleViewOrder
                            }
                            className="view-order-button"
                        >
                            View Order
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/orders"
                                )
                            }
                            className="my-orders-button"
                        >
                            My Orders
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default PaymentSuccess;

