
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    ShoppingBag,
    Trash2,
    Eye,
} from "lucide-react";

import {
    getFavorites,
    removeFavorite,
} from "../services/favoriteService";

function Wishlist() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removing, setRemoving] = useState("");

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getFavorites();

            console.log("FAVORITES:", data);

            setFavorites(data.favorites || []);
        } catch (error) {
            console.error("Favorites error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load your wishlist."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleRemove = async (productId) => {
        try {
            setRemoving(productId);

            await removeFavorite(productId);

            setFavorites((previous) =>
                previous.filter(
                    (favorite) =>
                        favorite.productId?._id !== productId
                )
            );
        } catch (error) {
            console.error("Remove favorite error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to remove product from wishlist."
            );
        } finally {
            setRemoving("");
        }
    };

    if (loading) {
        return (
            <main className="wishlist-page">
                <div className="wishlist-loading">
                    Loading your wishlist...
                </div>
            </main>
        );
    }

    if (error && favorites.length === 0) {
        return (
            <main className="wishlist-page">
                <div className="wishlist-container">

                    <Link
                        to="/"
                        className="back-link"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <div className="wishlist-error">
                        {error}
                    </div>

                </div>
            </main>
        );
    }

    if (favorites.length === 0) {
        return (
            <main className="wishlist-page">

                <div className="wishlist-container">

                    <Link
                        to="/products"
                        className="back-link"
                    >
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </Link>

                    <div className="wishlist-heading">

                        <p className="section-label">
                            CRAFTIVO FAVORITES
                        </p>

                        <h1>My Wishlist</h1>

                        <p>
                            Save the handmade creations
                            that you love.
                        </p>

                    </div>

                    <div className="empty-wishlist">

                        <div className="empty-wishlist-icon">
                            <Heart size={42} />
                        </div>

                        <h2>Your wishlist is empty</h2>

                        <p>
                            Discover beautiful handmade
                            products and save your favorites
                            for later.
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
        <main className="wishlist-page">

            <div className="wishlist-container">

                <Link
                    to="/products"
                    className="back-link"
                >
                    <ArrowLeft size={18} />
                    Continue Shopping
                </Link>

                <div className="wishlist-heading">

                    <div>
                        <p className="section-label">
                            CRAFTIVO FAVORITES
                        </p>

                        <h1>My Wishlist</h1>

                        <p>
                            Your collection of handmade
                            favorites.
                        </p>
                    </div>

                    <div className="wishlist-count">
                        {favorites.length}{" "}
                        {favorites.length === 1
                            ? "Favorite"
                            : "Favorites"}
                    </div>

                </div>

                {error && (
                    <div className="wishlist-error">
                        {error}
                    </div>
                )}

                <div className="wishlist-grid">

                    {favorites.map((favorite) => {

                        const product = favorite.productId;

                        if (!product) {
                            return null;
                        }

                        const imageUrl =
                            product.images &&
                            product.images.length > 0
                                ? `http://localhost:5000/${product.images[0]}`
                                : null;

                        return (
                            <article
                                className="wishlist-card"
                                key={favorite._id}
                            >

                                <div className="wishlist-image-wrapper">

                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            className="wishlist-image"
                                        />
                                    ) : (
                                        <div className="wishlist-placeholder">
                                            ✦
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        className="wishlist-remove-button"
                                        disabled={
                                            removing ===
                                            product._id
                                        }
                                        onClick={() =>
                                            handleRemove(
                                                product._id
                                            )
                                        }
                                        aria-label="Remove from wishlist"
                                    >
                                        <Heart
                                            size={19}
                                            fill="currentColor"
                                        />
                                    </button>

                                </div>

                                <div className="wishlist-card-content">

                                    <p className="wishlist-category">
                                        {product.category ||
                                            "Handmade Product"}
                                    </p>

                                    <h2>
                                        {product.name}
                                    </h2>

                                    <p className="wishlist-material">
                                        {product.material ||
                                            "Handmade"}
                                    </p>

                                    <div className="wishlist-card-bottom">

                                        <strong>
                                            ₹{product.price}
                                        </strong>

                                        <Link
                                            to={`/products/${product._id}`}
                                            className="wishlist-view-button"
                                        >
                                            <Eye size={16} />
                                            View
                                        </Link>

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

export default Wishlist;

