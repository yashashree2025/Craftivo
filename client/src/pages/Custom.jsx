
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";

const Custom = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCustomizableProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProducts({
                    isCustomizable: true,
                });

                setProducts(
                    data.products || data
                );
            } catch (error) {
                console.error(
                    "Failed to fetch customizable products:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load customizable products."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCustomizableProducts();
    }, []);

    const getImageUrl = (product) => {
        if (
            !product.images ||
            product.images.length === 0
        ) {
            return null;
        }

        const image = product.images[0];

        if (image.startsWith("http")) {
            return image;
        }

        return `http://localhost:5000/${image}`;
    };

    const handleCustomize = (productId) => {
        navigate(
            `/custom-request/${productId}`
        );
    };

    if (loading) {
        return (
            <div className="page-container">
                <h2>Loading Custom Creations...</h2>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="custom-page">

                {/* Page Header */}
                <div className="custom-header">
                    <h1>Custom Creations</h1>

                    <p>
                        Turn handmade products into
                        something uniquely yours.
                    </p>

                    <p>
                        Choose a customizable product
                        and tell our artisans exactly
                        what you want.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                {/* No Products */}
                {!error &&
                    products.length === 0 && (
                        <div className="empty-state">
                            <h2>
                                No Customizable Products
                            </h2>

                            <p>
                                There are currently no
                                customizable products
                                available.
                            </p>
                        </div>
                    )}

                {/* Products */}
                {products.length > 0 && (
                    <div className="custom-products-grid">

                        {products.map((product) => {
                            const imageUrl =
                                getImageUrl(product);

                            return (
                                <div
                                    key={product._id}
                                    className="custom-product-card"
                                >

                                    {/* Image */}
                                    <div className="custom-product-image-wrapper">

                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={
                                                    product.name
                                                }
                                                className="custom-product-image"
                                            />
                                        ) : (
                                            <div className="no-image">
                                                No Image
                                            </div>
                                        )}

                                    </div>

                                    {/* Details */}
                                    <div className="custom-product-details">

                                        <p className="custom-product-category">
                                            {product.category ||
                                                "Handmade"}
                                        </p>

                                        <h2>
                                            {product.name}
                                        </h2>

                                        <p>
                                            {product.description ||
                                                "Handcrafted product available for customization."}
                                        </p>

                                        <h3>
                                            Base Price: ₹
                                            {product.price}
                                        </h3>

                                        {/* Customization Options */}
                                        {product.customizationOptions?.length >
                                            0 && (
                                            <div>
                                                <strong>
                                                    Customize:
                                                </strong>

                                                <p>
                                                    {product.customizationOptions.join(
                                                        ", "
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        {/* Customize Button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleCustomize(
                                                    product._id
                                                )
                                            }
                                        >
                                            🎨 Customize This Product
                                        </button>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </div>
    );
};

export default Custom;

