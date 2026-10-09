import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    ShoppingBag,
    Star,
} from "lucide-react";

import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";

import {
    addFavorite,
    getFavorites,
    removeFavorite,
} from "../services/favoriteService";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [customization, setCustomization] = useState({});

    // =========================================================
    // CART STATES
    // =========================================================

    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [cartError, setCartError] = useState("");

    // =========================================================
    // FAVORITE STATES
    // =========================================================

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [favoriteMessage, setFavoriteMessage] = useState("");
    const [favoriteError, setFavoriteError] = useState("");

    // =========================================================
    // REVIEW STATES
    // =========================================================

    const [deliveredOrder, setDeliveredOrder] = useState(null);

    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");

    const [reviewLoading, setReviewLoading] = useState(false);

    const [reviewMessage, setReviewMessage] = useState("");
    const [reviewError, setReviewError] = useState("");

    // All reviews
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    // Rating summary
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    // =========================================================
    // FETCH PRODUCT
    // =========================================================

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProductById(id);

                setProduct(data.product);

                const initialCustomization = {};

                data.product.customizationOptions?.forEach(
                    (option) => {
                        initialCustomization[option] = "";
                    }
                );

                setCustomization(initialCustomization);
            } catch (error) {
                console.error(
                    "Fetch product error:",
                    error
                );

                setError("Unable to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // =========================================================
    // CHECK FAVORITE STATUS
    // =========================================================

    useEffect(() => {
        const checkFavorite = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setIsFavorite(false);
                return;
            }

            try {
                const data = await getFavorites();

                const favorites = data.favorites || [];

                const exists = favorites.some(
                    (favorite) => {
                        const favoriteProductId =
                            favorite.productId?._id ||
                            favorite.productId;

                        return (
                            String(favoriteProductId) ===
                            String(id)
                        );
                    }
                );

                setIsFavorite(exists);
            } catch (error) {
                console.error(
                    "Check favorite error:",
                    error
                );

                setIsFavorite(false);
            }
        };

        checkFavorite();
    }, [id]);

    // =========================================================
    // FETCH REVIEWS + RATING SUMMARY
    // =========================================================

    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);

            const reviewsResponse = await fetch(
                `http://localhost:5000/api/reviews/product/${id}`
            );

            const reviewsData =
                await reviewsResponse.json();

            if (reviewsResponse.ok) {
                setReviews(
                    reviewsData.reviews || []
                );
            }

            const ratingResponse = await fetch(
                `http://localhost:5000/api/reviews/product/${id}/rating-summary`
            );

            const ratingData =
                await ratingResponse.json();

            if (ratingResponse.ok) {
                setAverageRating(
                    ratingData.averageRating || 0
                );

                setTotalReviews(
                    ratingData.totalReviews || 0
                );
            }
        } catch (error) {
            console.error(
                "Fetch reviews error:",
                error
            );
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [id]);

    // =========================================================
    // FIND DELIVERED ORDER FOR REVIEW
    // =========================================================

    useEffect(() => {
        const findDeliveredOrder = async () => {
            const token =
                localStorage.getItem("token");

            if (!token) {
                setDeliveredOrder(null);
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:5000/api/orders/customer",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    return;
                }

                const customerOrders =
                    data.orders || [];

                const delivered =
                    customerOrders.find(
                        (order) => {
                            const orderProductId =
                                order.product?._id;

                            const orderStatus =
                                String(
                                    order.orderStatus ||
                                    ""
                                ).toLowerCase();

                            return (
                                String(
                                    orderProductId
                                ) === String(id) &&
                                orderStatus ===
                                    "delivered"
                            );
                        }
                    );

                setDeliveredOrder(
                    delivered || null
                );
            } catch (error) {
                console.error(
                    "Find delivered order error:",
                    error
                );
            }
        };

        findDeliveredOrder();
    }, [id]);

    // =========================================================
    // CUSTOMIZATION
    // =========================================================

    const handleCustomizationChange = (
        option,
        value
    ) => {
        setCustomization((previous) => ({
            ...previous,
            [option]: value,
        }));
    };

    // =========================================================
    // ADD TO CART
    // =========================================================

    const handleAddToCart = async () => {
        setCartMessage("");
        setCartError("");

        const token =
            localStorage.getItem("token");

        if (!token) {
            setCartError(
                "Please login to add products to your cart."
            );
            return;
        }

        if (product.stock <= 0) {
            setCartError(
                "This product is currently out of stock."
            );
            return;
        }

        try {
            setAddingToCart(true);

            await addToCart(
                product._id,
                1
            );

            setCartMessage(
                "Product added to cart successfully!"
            );
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            setCartError(
                error.response?.data?.message ||
                "Unable to add product to cart."
            );
        } finally {
            setAddingToCart(false);
        }
    };

    // =========================================================
    // ADD / REMOVE FAVORITE
    // =========================================================

    const handleFavorite = async () => {
        setFavoriteMessage("");
        setFavoriteError("");

        const token =
            localStorage.getItem("token");

        if (!token) {
            setFavoriteError(
                "Please login to save products to your wishlist."
            );
            return;
        }

        if (!product) {
            return;
        }

        try {
            setFavoriteLoading(true);

            if (isFavorite) {
                await removeFavorite(
                    product._id
                );

                setIsFavorite(false);

                setFavoriteMessage(
                    "Removed from your wishlist."
                );
            } else {
                await addFavorite(
                    product._id
                );

                setIsFavorite(true);

                setFavoriteMessage(
                    "Added to your wishlist!"
                );
            }
        } catch (error) {
            console.error(
                "Favorite error:",
                error.response?.data || error
            );

            setFavoriteError(
                error.response?.data?.message ||
                "Unable to update your wishlist."
            );
        } finally {
            setFavoriteLoading(false);
        }
    };

    // =========================================================
    // SUBMIT REVIEW
    // =========================================================

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        setReviewMessage("");
        setReviewError("");

        const token =
            localStorage.getItem("token");

        if (!token) {
            setReviewError(
                "Please login to submit a review."
            );
            return;
        }

        if (!deliveredOrder) {
            setReviewError(
                "You can review this product after it is delivered."
            );
            return;
        }

        if (reviewRating < 1) {
            setReviewError(
                "Please select a rating."
            );
            return;
        }

        if (!reviewComment.trim()) {
            setReviewError(
                "Please write a review."
            );
            return;
        }

        try {
            setReviewLoading(true);

            const orderId =
                deliveredOrder.orderId ||
                deliveredOrder._id;

            const response = await fetch(
                "http://localhost:5000/api/reviews",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        productId:
                            product._id,

                        orderId: orderId,

                        rating:
                            reviewRating,

                        comment:
                            reviewComment.trim(),
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to submit review."
                );
            }

            setReviewMessage(
                "Thank you! Your review was submitted successfully."
            );

            setReviewRating(0);
            setReviewComment("");

            // Remove review form after successful review
            setDeliveredOrder(null);

            // Refresh reviews and rating
            await fetchReviews();

        } catch (error) {
            console.error(
                "Submit review error:",
                error
            );

            setReviewError(
                error.message ||
                "Unable to submit your review."
            );
        } finally {
            setReviewLoading(false);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <main className="product-details-page">
                <div className="page-loading">
                    Loading product...
                </div>
            </main>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error || !product) {
        return (
            <main className="product-details-page">
                <div className="product-error">
                    {error ||
                        "Product not found"}
                </div>
            </main>
        );
    }

    // =========================================================
    // PRODUCT DETAILS
    // =========================================================

    return (
        <main className="product-details-page">

            <div className="product-details-container">

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <Link
                    to="/products"
                    className="back-link"
                >
                    <ArrowLeft size={18} />
                    Back to Discover
                </Link>

                <div className="product-details-grid">

                    {/* =================================================
                        PRODUCT IMAGE
                    ================================================= */}

                    <div className="product-details-image-section">

                        {product.images &&
                        product.images.length > 0 ? (
                            <img
                                src={`http://localhost:5000/${product.images[0]}`}
                                alt={product.name}
                                className="product-details-image"
                            />
                        ) : (
                            <div className="product-details-placeholder">
                                ✦
                            </div>
                        )}

                    </div>

                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <div className="product-details-info">

                        <p className="product-details-category">
                            {product.category}
                        </p>

                        <h1>
                            {product.name}
                        </h1>

                        {/* Rating */}

                        <div className="product-rating">

                            <Star
                                size={18}
                                fill="currentColor"
                            />

                            <span>
                                {averageRating.toFixed(1)}
                            </span>

                            <span className="review-count">
                                (
                                {totalReviews}{" "}
                                reviews)
                            </span>

                        </div>

                        {/* Price */}

                        <div className="product-details-price">
                            ₹{product.price}
                        </div>

                        {/* Description */}

                        <p className="product-details-description">
                            {product.description}
                        </p>

                        {/* =================================================
                            PRODUCT META
                        ================================================= */}

                        <div className="product-meta">

                            <div>
                                <span>
                                    Material
                                </span>

                                <strong>
                                    {product.material ||
                                        "Handmade"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Availability
                                </span>

                                <strong>
                                    {product.stock > 0
                                        ? `${product.stock} available`
                                        : "Out of stock"}
                                </strong>
                            </div>

                        </div>

                        

                        {/* =================================================
                            CART MESSAGES
                        ================================================= */}

                        {cartMessage && (
                            <div className="cart-success-message">
                                {cartMessage}
                            </div>
                        )}

                        {cartError && (
                            <div className="cart-error-message">
                                {cartError}
                            </div>
                        )}

                        {/* =================================================
                            FAVORITE MESSAGES
                        ================================================= */}

                        {favoriteMessage && (
                            <div className="favorite-success-message">
                                {favoriteMessage}
                            </div>
                        )}

                        {favoriteError && (
                            <div className="favorite-error-message">
                                {favoriteError}
                            </div>
                        )}

                        {/* =================================================
                            ACTION BUTTONS
                        ================================================= */}

                        <div className="product-actions">

                            <button
                                type="button"
                                className="add-cart-button"
                                onClick={
                                    handleAddToCart
                                }
                                disabled={
                                    addingToCart
                                }
                            >
                                <ShoppingBag
                                    size={20}
                                />

                                {addingToCart
                                    ? "Adding..."
                                    : "Add to Cart"}
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleFavorite
                                }
                                disabled={
                                    favoriteLoading
                                }
                                className={`wishlist-button ${
                                    isFavorite
                                        ? "wishlist-active"
                                        : ""
                                }`}
                                aria-label={
                                    isFavorite
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                            >
                                <Heart
                                    size={20}
                                    fill={
                                        isFavorite
                                            ? "currentColor"
                                            : "none"
                                    }
                                />
                            </button>

                            

                        </div>

                        {/* =================================================
                            CUSTOM REQUEST
                        ================================================= */}

                        {product.isCustomizable && (
                            <Link
                                to={`/custom-request/${product._id}`}
                                className="custom-request-link"
                            >
                                Want something more personal?

                                <strong>
                                    Request a custom creation →
                                </strong>
                            </Link>
                        )}

                    </div>

                </div>

                {/* =========================================================
                    CUSTOMER REVIEW SECTION
                ========================================================= */}

                <section className="customer-review-section">

                    <div className="customer-review-heading">

                        <div>

                            <p>
                                CUSTOMER EXPERIENCE
                            </p>

                            <h2>
                                Share Your Experience
                            </h2>

                            <span>
                                Your feedback helps other
                                customers discover great
                                handmade creations.
                            </span>

                        </div>

                    </div>

                    {/* =====================================================
                        REVIEW SUCCESS MESSAGE
                    ===================================================== */}

                    {reviewMessage && (
                        <div className="review-success-message">
                            {reviewMessage}
                        </div>
                    )}

                    {/* =====================================================
                        REVIEW FORM
                    ===================================================== */}

                    {deliveredOrder ? (

                        <form
                            className="customer-review-form"
                            onSubmit={
                                handleSubmitReview
                            }
                        >

                            <div className="review-form-title">

                                <h3>
                                    How was your experience?
                                </h3>

                                <span>
                                    You purchased this product.
                                </span>

                            </div>

                            {/* Star Rating */}

                            <div className="review-rating-field">

                                <label>
                                    Your Rating
                                </label>

                                <div className="review-stars">

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={
                                                    star <=
                                                    reviewRating
                                                        ? "review-star active"
                                                        : "review-star"
                                                }
                                                onClick={() =>
                                                    setReviewRating(
                                                        star
                                                    )
                                                }
                                                aria-label={`Rate ${star} stars`}
                                            >
                                                <Star
                                                    size={28}
                                                    fill={
                                                        star <=
                                                        reviewRating
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />
                                            </button>
                                        )
                                    )}

                                </div>

                            </div>

                            {/* Comment */}

                            <div className="review-comment-field">

                                <label htmlFor="reviewComment">
                                    Your Review
                                </label>

                                <textarea
                                    id="reviewComment"
                                    rows="5"
                                    placeholder="Tell other customers about your experience..."
                                    value={
                                        reviewComment
                                    }
                                    onChange={(e) =>
                                        setReviewComment(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            {reviewError && (
                                <div className="review-error-message">
                                    {reviewError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="submit-review-button"
                                disabled={
                                    reviewLoading
                                }
                            >
                                {reviewLoading
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>

                        </form>

                    ) : (

                        <div className="review-login-note">

                            <Star size={22} />

                            <div>

                                <strong>
                                    Reviews are available
                                    after delivery.
                                </strong>

                                <p>
                                    Purchase and receive this
                                    product to share your
                                    experience.
                                </p>

                            </div>

                        </div>

                    )}

                    {/* =====================================================
                        ALL REVIEWS
                    ===================================================== */}

                    <div className="all-reviews-section">

                        <div className="all-reviews-heading">

                            <div>

                                <h3>
                                    Customer Reviews
                                </h3>

                                <span>
                                    {totalReviews}{" "}
                                    {totalReviews === 1
                                        ? "review"
                                        : "reviews"}
                                </span>

                            </div>

                            <div className="reviews-summary">

                                <Star
                                    size={20}
                                    fill="currentColor"
                                />

                                <strong>
                                    {averageRating.toFixed(
                                        1
                                    )}
                                </strong>

                            </div>

                        </div>

                        {reviewsLoading ? (

                            <div className="reviews-loading">
                                Loading reviews...
                            </div>

                        ) : reviews.length === 0 ? (

                            <div className="no-reviews">
                                <Star size={24} />

                                <p>
                                    No reviews yet.
                                </p>

                                <span>
                                    Be the first customer
                                    to share your
                                    experience.
                                </span>
                            </div>

                        ) : (

                            <div className="reviews-list">

                                {reviews.map(
                                    (review) => {

                                        const customerName =
                                            review.customerId?.name ||
                                            "Customer";

                                        return (
                                            <div
                                                className="review-card"
                                                key={
                                                    review._id
                                                }
                                            >

                                                <div className="review-card-top">

                                                    <div>

                                                        <strong>
                                                            {
                                                                customerName
                                                            }
                                                        </strong>

                                                        <div className="review-card-stars">

                                                            {[1, 2, 3, 4, 5].map(
                                                                (
                                                                    star
                                                                ) => (
                                                                    <Star
                                                                        key={
                                                                            star
                                                                        }
                                                                        size={
                                                                            16
                                                                        }
                                                                        fill={
                                                                            star <=
                                                                            review.rating
                                                                                ? "currentColor"
                                                                                : "none"
                                                                        }
                                                                    />
                                                                )
                                                            )}

                                                        </div>

                                                    </div>

                                                    <span className="review-date">
                                                        {review.createdAt
                                                            ? new Date(
                                                                  review.createdAt
                                                              ).toLocaleDateString()
                                                            : ""}
                                                    </span>

                                                </div>

                                                <p className="review-card-comment">
                                                    {
                                                        review.comment
                                                    }
                                                </p>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </div>

                </section>

            </div>

        </main>
    );
}

export default ProductDetails;