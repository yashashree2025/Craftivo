import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCustomerRequests,
    customerRespondToRequest,
} from "../services/customRequestService";

const CustomRequests = () => {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login to view your custom requests.");
                return;
            }

            const data = await getCustomerRequests();

            setRequests(data.requests || []);
        } catch (error) {
            console.error(
                "Failed to fetch custom requests:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load custom requests."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerResponse = async (requestId, status) => {
        try {
            setActionLoading(requestId);
            setError("");
            setSuccess("");

            await customerRespondToRequest(requestId, status);

            setSuccess(
                status === "approved"
                    ? "Custom request approved successfully!"
                    : "Custom request rejected successfully."
            );

            await fetchRequests();
        } catch (error) {
            console.error(
                "Customer response error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update custom request."
            );
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusClass = (status) => {
        return `custom-request-status status-${status}`;
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "Pending";
            case "accepted":
                return "Accepted";
            case "price_updated":
                return "Price Updated";
            case "approved":
                return "Approved";
            case "rejected":
                return "Rejected";
            case "completed":
                return "Completed";
            default:
                return status;
        }
    };

    const getImageUrl = (product) => {
        if (!product?.images || product.images.length === 0) {
            return null;
        }

        const image = product.images[0];

        if (image.startsWith("http")) {
            return image;
        }

        return `http://localhost:5000/${image}`;
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="custom-requests-page">
                    <h1>My Custom Requests</h1>
                    <p>Loading your custom requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="custom-requests-page">

                {/* Header */}
                <div className="custom-requests-header">
                    <div>
                        <h1>My Custom Requests</h1>

                        <p>
                            Track and manage your handmade customization
                            requests.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/custom")}
                        className="browse-custom-button"
                    >
                        Browse Custom Products
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="custom-request-alert alert-error">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="custom-request-alert alert-success">
                        {success}
                    </div>
                )}

                {/* Empty State */}
                {!error && requests.length === 0 && (
                    <div className="custom-request-empty">
                        <div className="empty-icon">🎨</div>

                        <h2>No Custom Requests Yet</h2>

                        <p>
                            You haven't submitted any custom product
                            requests yet.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/custom")}
                        >
                            Explore Custom Products
                        </button>
                    </div>
                )}

                {/* Requests */}
                {requests.length > 0 && (
                    <div className="custom-requests-list">

                        {requests.map((request) => {
                            const product = request.productId;
                            const artisan = request.artisanId;

                            const imageUrl = getImageUrl(product);

                            const isActionLoading =
                                actionLoading === request._id;

                            return (
                                <div
                                    key={request._id}
                                    className="custom-request-card"
                                >

                                    {/* Product */}
                                    <div className="custom-request-product">

                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={
                                                    product?.name ||
                                                    "Product"
                                                }
                                                className="custom-request-product-image"
                                            />
                                        ) : (
                                            <div className="custom-request-no-image">
                                                No Image
                                            </div>
                                        )}

                                        <div className="custom-request-product-info">

                                            <span>
                                                {product?.category ||
                                                    "Handmade"}
                                            </span>

                                            <h2>
                                                {product?.name ||
                                                    "Custom Product"}
                                            </h2>

                                            <p>
                                                Base Price: ₹
                                                {product?.price ?? "N/A"}
                                            </p>

                                            {artisan && (
                                                <p>
                                                    Artisan:{" "}
                                                    {artisan.name ||
                                                        "Craftivo Artisan"}
                                                </p>
                                            )}

                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="custom-request-status-section">

                                        <span
                                            className={getStatusClass(
                                                request.status
                                            )}
                                        >
                                            {getStatusText(
                                                request.status
                                            )}
                                        </span>

                                        <p className="request-date">
                                            Submitted:{" "}
                                            {new Date(
                                                request.createdAt
                                            ).toLocaleDateString()}
                                        </p>

                                    </div>

                                    {/* Pending Message */}
                                    {request.status === "pending" && (
                                        <div className="custom-request-pending">
                                            <strong>
                                                ⏳ Waiting for Artisan Response
                                            </strong>

                                            <p>
                                                Your request has been sent to
                                                the artisan. Please wait while
                                                they review it and provide a
                                                price.
                                            </p>
                                        </div>
                                    )}

                                    {/* Customization */}
                                    <div className="custom-request-customization">

                                        <h3>Your Customization</h3>

                                        <div className="customization-list">

                                            {request.customizationDetails &&
                                                Object.entries(
                                                    request.customizationDetails
                                                ).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="customization-item"
                                                    >
                                                        <strong>
                                                            {key}:
                                                        </strong>

                                                        <span>
                                                            {value}
                                                        </span>
                                                    </div>
                                                ))}

                                        </div>
                                    </div>

                                    {/* Customer Message */}
                                    {request.customerMessage && (
                                        <div className="request-message">

                                            <h3>Your Message</h3>

                                            <p>
                                                "{request.customerMessage}"
                                            </p>

                                        </div>
                                    )}

                                    {/* Artisan Response */}
                                    {request.status === "accepted" && (
                                        <div className="artisan-response">

                                            <h3>Artisan Response</h3>

                                            <div className="artisan-price">

                                                <span>
                                                    Artisan Price
                                                </span>

                                                <strong>
                                                    ₹{request.artisanPrice}
                                                </strong>

                                            </div>

                                            {request.artisanMessage && (
                                                <p>
                                                    {request.artisanMessage}
                                                </p>
                                            )}

                                            <div className="custom-request-actions">

                                                <button
                                                    type="button"
                                                    className="approve-request-button"
                                                    disabled={
                                                        isActionLoading
                                                    }
                                                    onClick={() =>
                                                        handleCustomerResponse(
                                                            request._id,
                                                            "approved"
                                                        )
                                                    }
                                                >
                                                    {isActionLoading
                                                        ? "Processing..."
                                                        : "Approve Request"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="reject-request-button"
                                                    disabled={
                                                        isActionLoading
                                                    }
                                                    onClick={() =>
                                                        handleCustomerResponse(
                                                            request._id,
                                                            "rejected"
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </div>

                                        </div>
                                    )}

                                    {/* Approved */}
                                    {request.status === "approved" && (
                                        <div className="custom-request-approved">

                                            <strong>
                                                ✓ Request Approved
                                            </strong>

                                            <p>
                                                Your custom request has been
                                                approved. You can now place
                                                your custom order.
                                            </p>

                                            <p>
                                                Agreed Price:{" "}
                                                <b>
                                                    ₹{request.artisanPrice}
                                                </b>
                                            </p>

                                            <button
                                                type="button"
                                                className="proceed-custom-checkout-button"
                                                onClick={() =>
                                                    navigate(
                                                        "/custom-checkout",
                                                        {
                                                            state: {
                                                                request,
                                                            },
                                                        }
                                                    )
                                                }
                                            >
                                                Proceed to Checkout
                                            </button>

                                        </div>
                                    )}

                                    {/* Rejected */}
                                    {request.status === "rejected" && (
                                        <div className="custom-request-rejected">

                                            <strong>
                                                Request Rejected
                                            </strong>

                                            <p>
                                                This custom request was
                                                rejected.
                                            </p>

                                        </div>
                                    )}

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
};

export default CustomRequests;