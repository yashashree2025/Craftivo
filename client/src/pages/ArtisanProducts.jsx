
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Plus,
    Package,
    Pencil,
    Trash2,
    Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ArtisanProducts = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login as an artisan to view your products."
                );
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/products/my-products",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProducts(
                response.data.products || []
            );
        } catch (error) {
            console.error(
                "Fetch artisan products error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load your products."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(productId);

            const token =
                localStorage.getItem("token");

            await axios.delete(
                `http://localhost:5000/api/products/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProducts((previous) =>
                previous.filter(
                    (product) =>
                        product._id !== productId
                )
            );
        } catch (error) {
            console.error(
                "Delete product error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete product."
            );
        } finally {
            setDeleteLoading("");
        }
    };

    const getProductImage = (product) => {
        if (
            product.images &&
            product.images.length > 0
        ) {
            return `http://localhost:5000/${product.images[0]}`;
        }

        return null;
    };

    if (loading) {
        return (
            <main className="artisan-products-page">
                <div className="artisan-products-container">
                    <div className="artisan-products-loading">
                        Loading your products...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="artisan-products-page">
                <div className="artisan-products-container">
                    <div className="artisan-products-error">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="artisan-products-page">
            <div className="artisan-products-container">

                <button
                    type="button"
                    className="artisan-products-back"
                    onClick={() =>
                        navigate(
                            "/artisan/dashboard"
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                <div className="artisan-products-header">
                    <div>
                        <p>CRAFTIVO ARTISAN</p>

                        <h1>Manage Products</h1>

                        <span>
                            View and manage all the
                            handmade products you
                            have listed on Craftivo.
                        </span>
                    </div>

                    <button
                        type="button"
                        className="artisan-products-add-button"
                        onClick={() =>
                            navigate(
                                "/artisan/add-product"
                            )
                        }
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>

                <div className="artisan-products-count">
                    <Package size={18} />

                    <span>
                        {products.length}{" "}
                        {products.length === 1
                            ? "Product"
                            : "Products"}
                    </span>
                </div>

                {products.length === 0 ? (
                    <div className="artisan-products-empty">
                        <div className="artisan-products-empty-icon">
                            <Package size={34} />
                        </div>

                        <h2>
                            No Products Yet
                        </h2>

                        <p>
                            Start selling your handmade
                            creations by adding your
                            first product.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/artisan/add-product"
                                )
                            }
                        >
                            <Plus size={18} />
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <div className="artisan-products-grid">
                        {products.map(
                            (product) => {
                                const image =
                                    getProductImage(
                                        product
                                    );

                                return (
                                    <article
                                        className="artisan-product-card"
                                        key={
                                            product._id
                                        }
                                    >
                                        <div className="artisan-product-image">
                                            {image ? (
                                                <img
                                                    src={
                                                        image
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                />
                                            ) : (
                                                <div className="artisan-product-no-image">
                                                    <Package
                                                        size={
                                                            42
                                                        }
                                                    />
                                                    <span>
                                                        No Image
                                                    </span>
                                                </div>
                                            )}

                                            {product.isCustomizable && (
                                                <div className="artisan-customizable-badge">
                                                    <Sparkles
                                                        size={
                                                            13
                                                        }
                                                    />
                                                    Customizable
                                                </div>
                                            )}
                                        </div>

                                        <div className="artisan-product-content">
                                            <p className="artisan-product-category">
                                                {
                                                    product.category
                                                }
                                            </p>

                                            <h2>
                                                {
                                                    product.name
                                                }
                                            </h2>

                                            <p className="artisan-product-description">
                                                {
                                                    product.description
                                                }
                                            </p>

                                            <div className="artisan-product-details">
                                                <div>
                                                    <span>
                                                        Price
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {
                                                            product.price
                                                        }
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        Stock
                                                    </span>

                                                    <strong
                                                        className={
                                                            Number(
                                                                product.stock
                                                            ) ===
                                                            0
                                                                ? "stock-out"
                                                                : ""
                                                        }
                                                    >
                                                        {
                                                            product.stock
                                                        }
                                                    </strong>
                                                </div>
                                            </div>

                                            {product.isCustomizable &&
                                                product.customizationOptions
                                                    ?.length >
                                                    0 && (
                                                    <div className="artisan-customization-info">
                                                        <span>
                                                            Customization
                                                            options
                                                        </span>

                                                        <div>
                                                            {product.customizationOptions.map(
                                                                (
                                                                    option
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            option
                                                                        }
                                                                    >
                                                                        {
                                                                            option
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            <div className="artisan-product-actions">
                                                <button
                                                    type="button"
                                                    className="artisan-edit-product-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/artisan/products/edit/${product._id}`
                                                        )
                                                    }
                                                >
                                                    <Pencil
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="artisan-delete-product-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product._id
                                                        )
                                                    }
                                                    disabled={
                                                        deleteLoading ===
                                                        product._id
                                                    }
                                                >
                                                    <Trash2
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    {deleteLoading ===
                                                    product._id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ArtisanProducts;
