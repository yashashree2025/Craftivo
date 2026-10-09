import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    ShoppingBag,
    CheckCircle,
} from "lucide-react";

import { getCart } from "../services/cartService";
import { createNormalOrder } from "../services/orderService";

function Checkout() {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    // Fetch cart
    useEffect(() => {
        const fetchCart = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getCart();

                setCart(data.cart);
            } catch (error) {
                console.error("Checkout cart error:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load your cart."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setFormError("");
    };

    // Validate shipping address
    const validateForm = () => {
        const {
            name,
            phone,
            address,
            city,
            state,
            pincode,
        } = formData;

        if (
            !name.trim() ||
            !phone.trim() ||
            !address.trim() ||
            !city.trim() ||
            !state.trim() ||
            !pincode.trim()
        ) {
            setFormError(
                "Please fill in all shipping address fields."
            );

            return false;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            setFormError(
                "Please enter a valid 10-digit phone number."
            );

            return false;
        }

        if (!/^[0-9]{6}$/.test(pincode)) {
            setFormError(
                "Please enter a valid 6-digit pincode."
            );

            return false;
        }

        return true;
    };

    // Place order
    const handlePlaceOrder = async () => {
        setFormError("");
        setError("");

        if (!validateForm()) {
            return;
        }

        try {
            setPlacingOrder(true);

            const data = await createNormalOrder(formData);

            console.log("ORDER RESPONSE:", data);

            setSuccess(true);

            // Go to order details after a short moment
            setTimeout(() => {
                navigate(`/orders/${data.order._id}`);
            }, 1200);

        } catch (error) {
            console.error("Place order error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to place your order."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <main className="checkout-page">
                <div className="checkout-loading">
                    Loading checkout...
                </div>
            </main>
        );
    }

    if (error && !cart) {
        return (
            <main className="checkout-page">
                <div className="checkout-container">
                    <div className="checkout-error">
                        {error}
                    </div>

                    <Link
                        to="/cart"
                        className="back-link"
                    >
                        <ArrowLeft size={18} />
                        Back to Cart
                    </Link>
                </div>
            </main>
        );
    }

    const items = cart?.items || [];

    if (items.length === 0 && !success) {
        return (
            <main className="checkout-page">

                <div className="checkout-container">

                    <Link
                        to="/products"
                        className="back-link"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>

                    <div className="empty-checkout">

                        <div className="empty-checkout-icon">
                            <ShoppingBag size={40} />
                        </div>

                        <h1>Your cart is empty</h1>

                        <p>
                            Add some handmade products before
                            proceeding to checkout.
                        </p>

                        <Link
                            to="/products"
                            className="shop-now-button"
                        >
                            Explore Products
                        </Link>

                    </div>

                </div>

            </main>
        );
    }

    const subtotal = items.reduce(
        (total, item) =>
            total +
            (item.productId?.price || 0) *
            item.quantity,
        0
    );

    const deliveryCharge = 50;

    const total = subtotal + deliveryCharge;

    return (
        <main className="checkout-page">

            <div className="checkout-container">

                {/* Back */}
                <Link
                    to="/cart"
                    className="back-link"
                >
                    <ArrowLeft size={18} />
                    Back to Cart
                </Link>

                {/* Heading */}
                <div className="checkout-heading">

                    <p className="section-label">
                        COMPLETE YOUR ORDER
                    </p>

                    <h1>Checkout</h1>

                    <p>
                        Almost there! Tell us where you'd
                        like your handmade treasures delivered.
                    </p>

                </div>

                {/* Success */}
                {success && (
                    <div className="checkout-success">

                        <CheckCircle size={22} />

                        <div>
                            <strong>
                                Order placed successfully!
                            </strong>

                            <p>
                                Redirecting to your order...
                            </p>
                        </div>

                    </div>
                )}

                {/* General error */}
                {error && (
                    <div className="checkout-error">
                        {error}
                    </div>
                )}

                <div className="checkout-layout">

                    {/* LEFT SIDE */}
                    <div className="checkout-main">

                        {/* Shipping Address */}
                        <section className="checkout-card">

                            <div className="checkout-card-heading">

                                <div className="checkout-card-icon">
                                    <MapPin size={20} />
                                </div>

                                <div>
                                    <h2>
                                        Shipping Address
                                    </h2>

                                    <p>
                                        Where should we deliver
                                        your order?
                                    </p>
                                </div>

                            </div>

                            {formError && (
                                <div className="checkout-form-error">
                                    {formError}
                                </div>
                            )}

                            <div className="checkout-form">

                                {/* Name */}
                                <div className="form-group">

                                    <label htmlFor="name">
                                        Full Name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />

                                </div>

                                {/* Phone */}
                                <div className="form-group">

                                    <label htmlFor="phone">
                                        Phone Number
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        placeholder="10-digit phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={10}
                                    />

                                </div>

                                {/* Address */}
                                <div className="form-group full-width">

                                    <label htmlFor="address">
                                        Address
                                    </label>

                                    <textarea
                                        id="address"
                                        name="address"
                                        placeholder="House no., street, area"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="4"
                                    />

                                </div>

                                {/* City */}
                                <div className="form-group">

                                    <label htmlFor="city">
                                        City
                                    </label>

                                    <input
                                        id="city"
                                        type="text"
                                        name="city"
                                        placeholder="Enter city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />

                                </div>

                                {/* State */}
                                <div className="form-group">

                                    <label htmlFor="state">
                                        State
                                    </label>

                                    <input
                                        id="state"
                                        type="text"
                                        name="state"
                                        placeholder="Enter state"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />

                                </div>

                                {/* Pincode */}
                                <div className="form-group">

                                    <label htmlFor="pincode">
                                        Pincode
                                    </label>

                                    <input
                                        id="pincode"
                                        type="text"
                                        name="pincode"
                                        placeholder="6-digit pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        maxLength={6}
                                    />

                                </div>

                            </div>

                        </section>

                        {/* Items */}
                        <section className="checkout-card">

                            <div className="checkout-card-heading">

                                <div className="checkout-card-icon">
                                    <ShoppingBag size={20} />
                                </div>

                                <div>
                                    <h2>
                                        Your Items
                                    </h2>

                                    <p>
                                        {items.length}{" "}
                                        {items.length === 1
                                            ? "product"
                                            : "products"}{" "}
                                        in your order
                                    </p>
                                </div>

                            </div>

                            <div className="checkout-items">

                                {items.map((item) => {

                                    const product =
                                        item.productId;

                                    if (!product) {
                                        return null;
                                    }

                                    const imageUrl =
                                        product.images &&
                                        product.images.length > 0
                                            ? `http://localhost:5000/${product.images[0]}`
                                            : null;

                                    return (
                                        <div
                                            className="checkout-item"
                                            key={product._id}
                                        >

                                            <div className="checkout-item-image">

                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={product.name}
                                                    />
                                                ) : (
                                                    <span>
                                                        ✦
                                                    </span>
                                                )}

                                            </div>

                                            <div className="checkout-item-info">

                                                <h3>
                                                    {product.name}
                                                </h3>

                                                <p>
                                                    Quantity:{" "}
                                                    {item.quantity}
                                                </p>

                                            </div>

                                            <strong>
                                                ₹
                                                {product.price *
                                                    item.quantity}
                                            </strong>

                                        </div>
                                    );
                                })}

                            </div>

                        </section>

                    </div>

                    {/* RIGHT SIDE */}
                    <aside className="checkout-summary">

                        <h2>Order Summary</h2>

                        <div className="checkout-summary-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹{subtotal}
                            </strong>

                        </div>

                        <div className="checkout-summary-row">

                            <span>
                                Delivery
                            </span>

                            <strong>
                                ₹{deliveryCharge}
                            </strong>

                        </div>

                        <div className="checkout-summary-divider" />

                        <div className="checkout-summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹{total}
                            </strong>

                        </div>

                        <button
                            type="button"
                            className="place-order-button"
                            onClick={handlePlaceOrder}
                            disabled={placingOrder || success}
                        >

                            {placingOrder
                                ? "Placing Order..."
                                : success
                                ? "Order Placed ✓"
                                : "Place Order"}

                        </button>

                        <p className="checkout-note">
                            Payment will be completed after
                            placing your order.
                        </p>

                    </aside>

                </div>

            </div>

        </main>
    );
}

export default Checkout;