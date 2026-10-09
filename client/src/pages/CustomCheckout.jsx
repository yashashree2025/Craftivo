
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createCustomOrder } from "../services/orderService";

const CustomCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const request = location.state?.request;

    const [shippingAddress, setShippingAddress] =
        useState({
            name: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
        });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!request) {
        return (
            <div className="page-container">
                <div className="custom-checkout-page">
                    <h1>Custom Order Not Found</h1>

                    <p>
                        Please return to your custom
                        requests and try again.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/custom-requests")
                        }
                    >
                        Back to Custom Requests
                    </button>
                </div>
            </div>
        );
    }

    const product = request.productId;

    const artisanPrice =
        Number(request.artisanPrice) || 0;

    const deliveryCharge = 50;

    const totalAmount =
        artisanPrice + deliveryCharge;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setShippingAddress((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const {
            name,
            phone,
            address,
            city,
            state,
            pincode,
        } = shippingAddress;

        if (
            !name ||
            !phone ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {
            setError(
                "Please fill in all shipping details."
            );
            return;
        }

        try {
            setLoading(true);

            const data = await createCustomOrder(
                request._id,
                shippingAddress,
                deliveryCharge
            );

            const order =
                data.order || data;

            navigate(`/orders/${order._id}`, {
                state: {
                    customOrderCreated: true,
                },
            });
        } catch (error) {
            console.error(
                "Custom order creation error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create custom order."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            <div className="custom-checkout-page">

                <button
                    type="button"
                    className="custom-checkout-back"
                    onClick={() =>
                        navigate("/custom-requests")
                    }
                >
                    ← Back to Custom Requests
                </button>

                <div className="custom-checkout-header">
                    <h1>Custom Order Checkout</h1>

                    <p>
                        Complete your shipping details
                        to place your custom order.
                    </p>
                </div>

                <div className="custom-order-summary">

                    <div>
                        <h2>
                            {product?.name ||
                                "Custom Product"}
                        </h2>

                        <p>
                            Artisan Price: ₹
                            {artisanPrice}
                        </p>

                        <p>
                            Delivery Charge: ₹
                            {deliveryCharge}
                        </p>

                        <strong>
                            Total: ₹
                            {totalAmount}
                        </strong>
                    </div>

                </div>

                <form
                    className="custom-checkout-form"
                    onSubmit={handleSubmit}
                >

                    <h2>
                        Shipping Address
                    </h2>

                    <div className="custom-checkout-grid">

                        <div className="checkout-form-group">
                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    shippingAddress.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="checkout-form-group">
                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={
                                    shippingAddress.phone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter phone number"
                            />
                        </div>

                    </div>

                    <div className="checkout-form-group">
                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={
                                shippingAddress.address
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter complete delivery address"
                            rows="4"
                        />
                    </div>

                    <div className="custom-checkout-grid">

                        <div className="checkout-form-group">
                            <label>
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                value={
                                    shippingAddress.city
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter city"
                            />
                        </div>

                        <div className="checkout-form-group">
                            <label>
                                State
                            </label>

                            <input
                                type="text"
                                name="state"
                                value={
                                    shippingAddress.state
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter state"
                            />
                        </div>

                    </div>

                    <div className="checkout-form-group">
                        <label>
                            Pincode
                        </label>

                        <input
                            type="text"
                            name="pincode"
                            value={
                                shippingAddress.pincode
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter pincode"
                        />
                    </div>

                    {error && (
                        <div className="custom-checkout-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="place-custom-order-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Order..."
                            : `Place Custom Order • ₹${totalAmount}`}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CustomCheckout;

