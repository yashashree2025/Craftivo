
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
} from "lucide-react";
import {
    getCart,
    updateCartQuantity,
    removeFromCart,
} from "../services/cartService";

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState("");

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCart();

            setCart(data.cart);
        } catch (error) {
            console.error("Cart error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load your cart."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            return;
        }

        try {
            setUpdating(productId);

            await updateCartQuantity(
                productId,
                newQuantity
            );

            await fetchCart();
        } catch (error) {
            console.error("Quantity update error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to update quantity."
            );
        } finally {
            setUpdating("");
        }
    };

    const handleRemove = async (productId) => {
        try {
            setUpdating(productId);

            await removeFromCart(productId);

            await fetchCart();
        } catch (error) {
            console.error("Remove cart error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to remove product."
            );
        } finally {
            setUpdating("");
        }
    };

    if (loading) {
        return (
            <main className="cart-page">
                <div className="cart-loading">
                    Loading your cart...
                </div>
            </main>
        );
    }

    if (error && !cart) {
        return (
            <main className="cart-page">
                <div className="cart-error">
                    {error}
                </div>
            </main>
        );
    }

    const items = cart?.items || [];

    if (items.length === 0) {
        return (
            <main className="cart-page">

                <div className="cart-container">

                    <Link
                        to="/products"
                        className="back-link"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>

                    <div className="empty-cart">

                        <div className="empty-cart-icon">
                            <ShoppingBag size={42} />
                        </div>

                        <h1>Your cart is empty</h1>

                        <p>
                            Discover something beautiful
                            and handmade for your collection.
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

    const deliveryCharge = subtotal > 0 ? 50 : 0;

    const total = subtotal + deliveryCharge;

    return (
        <main className="cart-page">

            <div className="cart-container">

                <Link
                    to="/products"
                    className="back-link"
                >
                    <ArrowLeft size={18} />
                    Continue Shopping
                </Link>

                <div className="cart-heading">

                    <div>
                        <p className="section-label">
                            YOUR CRAFTIVO CART
                        </p>

                        <h1>Your Cart</h1>

                        <p>
                            Review your handmade
                            treasures before checkout.
                        </p>
                    </div>

                    <span className="cart-item-count">
                        {items.length}{" "}
                        {items.length === 1
                            ? "item"
                            : "items"}
                    </span>

                </div>

                {error && (
                    <div className="cart-error">
                        {error}
                    </div>
                )}

                <div className="cart-layout">

                    {/* Cart Items */}
                    <div className="cart-items">

                        {items.map((item) => {

                            const product = item.productId;

                            if (!product) {
                                return null;
                            }

                            const imageUrl =
                                product.images &&
                                product.images.length > 0
                                    ? `http://localhost:5000/${product.images[0]}`
                                    : null;

                            const itemTotal =
                                product.price *
                                item.quantity;

                            return (
                                <div
                                    className="cart-item"
                                    key={product._id}
                                >

                                    {/* Image */}
                                    <Link
                                        to={`/products/${product._id}`}
                                        className="cart-item-image"
                                    >
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
                                    </Link>

                                    {/* Details */}
                                    <div className="cart-item-details">

                                        <p className="cart-item-category">
                                            {product.category}
                                        </p>

                                        <Link
                                            to={`/products/${product._id}`}
                                            className="cart-item-name"
                                        >
                                            {product.name}
                                        </Link>

                                        <p className="cart-item-material">
                                            {product.material ||
                                                "Handmade"}
                                        </p>

                                        <div className="cart-item-price">
                                            ₹{product.price}
                                        </div>

                                    </div>

                                    {/* Quantity */}
                                    <div className="cart-quantity">

                                        <button
                                            type="button"
                                            disabled={
                                                updating ===
                                                    product._id ||
                                                item.quantity <= 1
                                            }
                                            onClick={() =>
                                                handleQuantityChange(
                                                    product._id,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            <Minus size={16} />
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={
                                                updating ===
                                                product._id
                                            }
                                            onClick={() =>
                                                handleQuantityChange(
                                                    product._id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            <Plus size={16} />
                                        </button>

                                    </div>

                                    {/* Total + Remove */}
                                    <div className="cart-item-actions">

                                        <strong>
                                            ₹{itemTotal}
                                        </strong>

                                        <button
                                            type="button"
                                            className="remove-item-button"
                                            disabled={
                                                updating ===
                                                product._id
                                            }
                                            onClick={() =>
                                                handleRemove(
                                                    product._id
                                                )
                                            }
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    {/* Summary */}
                    <aside className="cart-summary">

                        <h2>Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <strong>
                                ₹{subtotal}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <strong>
                                ₹{deliveryCharge}
                            </strong>
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-total">
                            <span>Total</span>
                            <strong>
                                ₹{total}
                            </strong>
                        </div>

                        <Link
                            to="/checkout"
                            className="checkout-button"
                        >
                            Proceed to Checkout
                        </Link>

                        <p className="secure-checkout">
                            Handmade with care, delivered
                            with love.
                        </p>

                    </aside>

                </div>

            </div>

        </main>
    );
}

export default Cart;

