
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { createCustomRequest } from "../services/customRequestService";

const CustomRequest = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [customizationDetails, setCustomizationDetails] =
        useState({});

    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [customerMessage, setCustomerMessage] =
        useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch selected product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProductById(productId);

                setProduct(data.product || data);
            } catch (error) {
                console.error(
                    "Failed to fetch product:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load product."
                );
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    // Update customization field
    const handleCustomizationChange = (
        option,
        value
    ) => {
        setCustomizationDetails((previous) => ({
            ...previous,
            [option]: value,
        }));
    };

    // Submit custom request
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const token = localStorage.getItem("token");

        if (!token) {
            setError(
                "Please login before creating a custom request."
            );
            return;
        }

        if (!estimatedPrice) {
            setError(
                "Please enter your estimated price."
            );
            return;
        }

        // Check that customization fields have values
        const options =
            product?.customizationOptions || [];

        const missingOption = options.find(
            (option) =>
                !customizationDetails[option] ||
                !customizationDetails[option].trim()
        );

        if (missingOption) {
            setError(
                `Please enter ${missingOption}.`
            );
            return;
        }

        try {
            setSubmitting(true);

            const data = {
                productId,
                customizationDetails,
                estimatedPrice: Number(estimatedPrice),
                customerMessage,
            };

            await createCustomRequest(data);

            setSuccess(
                "Custom request submitted successfully!"
            );

            setTimeout(() => {
                navigate("/custom-requests");
            }, 1200);
        } catch (error) {
            console.error(
                "Create custom request error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create custom request."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <h2>Loading product...</h2>
            </div>
        );
    }

    if (error && !product) {
        return (
            <div className="page-container">
                <h2>Unable to load product</h2>
                <p>{error}</p>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page-container">
                <h2>Product not found</h2>
            </div>
        );
    }

    const customizationOptions =
        product.customizationOptions || [];

    const productImage =
        product.images?.length > 0
            ? `http://localhost:5000/${product.images[0]}`
            : null;

    return (
        <div className="page-container">

            <div className="custom-request-page">

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h1>Create Your Custom Product</h1>

                <p>
                    Customize this handmade product
                    according to your requirements.
                </p>

                {/* Product Information */}
                <div className="custom-product-info">

                    {productImage && (
                        <img
                            src={productImage}
                            alt={product.name}
                            className="custom-product-image"
                        />
                    )}

                    <div>
                        <h2>{product.name}</h2>

                        <p>
                            Category:{" "}
                            {product.category || "Handmade"}
                        </p>

                        <p>
                            Base Price: ₹
                            {product.price}
                        </p>

                        <p>
                            Artisan:
                            {" "}
                            {product.artisanId?.name ||
                                "Craftivo Artisan"}
                        </p>
                    </div>

                </div>

                {/* Customization Form */}
                <form
                    onSubmit={handleSubmit}
                    className="custom-request-form"
                >

                    <h2>Customization Details</h2>

                    {customizationOptions.length > 0 ? (
                        customizationOptions.map(
                            (option) => (
                                <div
                                    key={option}
                                    className="form-group"
                                >
                                    <label>
                                        {option}
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            customizationDetails[
                                                option
                                            ] || ""
                                        }
                                        onChange={(e) =>
                                            handleCustomizationChange(
                                                option,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Enter ${option}`}
                                    />
                                </div>
                            )
                        )
                    ) : (
                        <div className="form-group">
                            <label>
                                Describe Your Customization
                            </label>

                            <textarea
                                value={
                                    customizationDetails
                                        .customization || ""
                                }
                                onChange={(e) =>
                                    handleCustomizationChange(
                                        "customization",
                                        e.target.value
                                    )
                                }
                                placeholder="Describe how you want this product customized"
                                rows="5"
                            />
                        </div>
                    )}

                    {/* Estimated Price */}
                    <div className="form-group">

                        <label>
                            Your Estimated Price
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={estimatedPrice}
                            onChange={(e) =>
                                setEstimatedPrice(
                                    e.target.value
                                )
                            }
                            placeholder="Enter your estimated price"
                        />

                    </div>

                    {/* Customer Message */}
                    <div className="form-group">

                        <label>
                            Message to Artisan
                        </label>

                        <textarea
                            value={customerMessage}
                            onChange={(e) =>
                                setCustomerMessage(
                                    e.target.value
                                )
                            }
                            placeholder="Tell the artisan anything important about your custom request..."
                            rows="5"
                        />

                    </div>

                    {/* Error */}
                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    {/* Success */}
                    {success && (
                        <p className="form-success">
                            {success}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Custom Request"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CustomRequest;

