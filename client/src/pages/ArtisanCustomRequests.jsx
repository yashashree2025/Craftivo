
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getArtisanRequests,
    respondToCustomRequest,
} from "../services/customRequestService";

const ArtisanCustomRequests = () => {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const [artisanPrice, setArtisanPrice] = useState({});
    const [artisanMessage, setArtisanMessage] = useState({});

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
                setError(
                    "Please login to view artisan custom requests."
                );
                return;
            }

            const data = await getArtisanRequests();

            setRequests(data.requests || []);
        } catch (error) {
            console.error(
                "Failed to fetch artisan custom requests:",
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

    const handleResponse = async (
        requestId,
        status
    ) => {
        setError("");
        setSuccess("");

        if (status === "accepted") {
            const price = artisanPrice[requestId];

            if (
                price === undefined ||
                price === "" ||
                Number(price) < 0
            ) {
                setError(
                    "Please enter a valid artisan price before accepting."
                );
                return;
            }
        }

        try {
            setActionLoading(requestId);

            const data = {
                status,
            };

            if (status === "accepted") {
                data.artisanPrice = Number(
                    artisanPrice[requestId]
                );

                data.artisanMessage =
                    artisanMessage[requestId] || "";
            }

            if (status === "rejected") {
                data.artisanMessage =
                    artisanMessage[requestId] || "";
            }

            await respondToCustomRequest(
                requestId,
                data
            );

            setSuccess(
                status === "accepted"
                    ? "Custom request accepted successfully!"
                    : "Custom request rejected successfully."
            );

            await fetchRequests();
        } catch (error) {
            console.error(
                "Artisan response error:",
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
        return `artisan-request-status status-${status}`;
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
        if (
            !product?.images ||
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

    if (loading) {
        return (
            <div className="page-container">
                <div className="artisan-custom-requests-page">
                    <h1>Custom Requests</h1>
                    <p>
                        Loading customer requests...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="artisan-custom-requests-page">

                {/* Header */}
                <div className="artisan-custom-header">

                    <div>
                        <h1>
                            Custom Requests
                        </h1>

                        <p>
                            Review customer
                            customization requests
                            and create something
                            unique.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/artisan/dashboard")
                        }
                        className="artisan-dashboard-button"
                    >
                        Back to Dashboard
                    </button>

                </div>


                {/* Error */}
                {error && (
                    <div className="artisan-request-alert alert-error">
                        {error}
                    </div>
                )}


                {/* Success */}
                {success && (
                    <div className="artisan-request-alert alert-success">
                        {success}
                    </div>
                )}


                {/* Empty State */}
                {!error &&
                    requests.length === 0 && (
                        <div className="artisan-request-empty">

                            <div className="artisan-empty-icon">
                                🎨
                            </div>

                            <h2>
                                No Custom Requests
                            </h2>

                            <p>
                                You currently don't
                                have any customer
                                customization requests.
                            </p>

                        </div>
                    )}


                {/* Request List */}
                {requests.length > 0 && (
                    <div className="artisan-custom-request-list">

                        {requests.map((request) => {

                            const product =
                                request.productId;

                            const customer =
                                request.customerId;

                            const imageUrl =
                                getImageUrl(product);

                            const isLoading =
                                actionLoading ===
                                request._id;

                            return (
                                <div
                                    key={request._id}
                                    className="artisan-custom-request-card"
                                >

                                    {/* Product + Customer */}
                                    <div className="artisan-request-top">

                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={
                                                    product?.name ||
                                                    "Product"
                                                }
                                                className="artisan-request-product-image"
                                            />
                                        ) : (
                                            <div className="artisan-request-no-image">
                                                No Image
                                            </div>
                                        )}

                                        <div className="artisan-request-product-info">

                                            <span>
                                                {product?.category ||
                                                    "Handmade"}
                                            </span>

                                            <h2>
                                                {product?.name ||
                                                    "Custom Product"}
                                            </h2>

                                            <p>
                                                Customer:{" "}
                                                {customer?.name ||
                                                    "Customer"}
                                            </p>

                                            {customer?.email && (
                                                <p>
                                                    Email:{" "}
                                                    {customer.email}
                                                </p>
                                            )}

                                            <p>
                                                Submitted:{" "}
                                                {new Date(
                                                    request.createdAt
                                                ).toLocaleDateString()}
                                            </p>

                                        </div>

                                        <div className="artisan-request-status-wrapper">

                                            <span
                                                className={getStatusClass(
                                                    request.status
                                                )}
                                            >
                                                {getStatusText(
                                                    request.status
                                                )}
                                            </span>

                                        </div>

                                    </div>


                                    {/* Customer Customization */}
                                    <div className="artisan-request-section">

                                        <h3>
                                            Customer Customization
                                        </h3>

                                        <div className="artisan-customization-list">

                                            {request.customizationDetails &&
                                                Object.entries(
                                                    request.customizationDetails
                                                ).map(
                                                    ([
                                                        key,
                                                        value,
                                                    ]) => (
                                                        <div
                                                            key={key}
                                                            className="artisan-customization-item"
                                                        >
                                                            <strong>
                                                                {
                                                                    key
                                                                }
                                                                :
                                                            </strong>

                                                            <span>
                                                                {
                                                                    value
                                                                }
                                                            </span>
                                                        </div>
                                                    )
                                                )}

                                        </div>

                                    </div>


                                    {/* Customer Message */}
                                    {request.customerMessage && (
                                        <div className="artisan-request-section">

                                            <h3>
                                                Customer Message
                                            </h3>

                                            <p className="artisan-customer-message">
                                                "
                                                {
                                                    request.customerMessage
                                                }
                                                "
                                            </p>

                                        </div>
                                    )}


                                    {/* Pending Action Area */}
                                    {request.status ===
                                        "pending" && (
                                        <div className="artisan-response-area">

                                            <h3>
                                                Respond to Request
                                            </h3>

                                            <div className="artisan-response-field">

                                                <label>
                                                    Artisan Price
                                                </label>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        artisanPrice[
                                                            request._id
                                                        ] ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setArtisanPrice(
                                                            (
                                                                previous
                                                            ) => ({
                                                                ...previous,
                                                                [request._id]:
                                                                    e
                                                                        .target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    placeholder="Enter your price"
                                                />

                                            </div>


                                            <div className="artisan-response-field">

                                                <label>
                                                    Message to Customer
                                                </label>

                                                <textarea
                                                    rows="4"
                                                    value={
                                                        artisanMessage[
                                                            request._id
                                                        ] ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setArtisanMessage(
                                                            (
                                                                previous
                                                            ) => ({
                                                                ...previous,
                                                                [request._id]:
                                                                    e
                                                                        .target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    placeholder="Tell the customer about the price, materials, delivery, or any other details..."
                                                />

                                            </div>


                                            <div className="artisan-response-actions">

                                                <button
                                                    type="button"
                                                    className="artisan-accept-button"
                                                    disabled={
                                                        isLoading
                                                    }
                                                    onClick={() =>
                                                        handleResponse(
                                                            request._id,
                                                            "accepted"
                                                        )
                                                    }
                                                >
                                                    {isLoading
                                                        ? "Processing..."
                                                        : "Accept Request"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="artisan-reject-button"
                                                    disabled={
                                                        isLoading
                                                    }
                                                    onClick={() =>
                                                        handleResponse(
                                                            request._id,
                                                            "rejected"
                                                        )
                                                    }
                                                >
                                                    Reject Request
                                                </button>

                                            </div>

                                        </div>
                                    )}


                                    {/* Accepted */}
                                    {request.status ===
                                        "accepted" && (
                                        <div className="artisan-accepted-box">

                                            <div>
                                                <strong>
                                                    Request Accepted
                                                </strong>

                                                <p>
                                                    Artisan Price:
                                                    {" "}
                                                    <b>
                                                        ₹
                                                        {
                                                            request.artisanPrice
                                                        }
                                                    </b>
                                                </p>

                                                {request.artisanMessage && (
                                                    <p>
                                                        {
                                                            request.artisanMessage
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                        </div>
                                    )}


                                    {/* Approved */}
                                    {request.status ===
                                        "approved" && (
                                        <div className="artisan-approved-box">

                                            <strong>
                                                ✓ Customer Approved
                                            </strong>

                                            <p>
                                                The customer has
                                                approved your
                                                custom request.
                                                You can now proceed
                                                with the creation.
                                            </p>

                                            <p>
                                                Agreed Price:
                                                {" "}
                                                <b>
                                                    ₹
                                                    {
                                                        request.artisanPrice
                                                    }
                                                </b>
                                            </p>

                                        </div>
                                    )}


                                    {/* Rejected */}
                                    {request.status ===
                                        "rejected" && (
                                        <div className="artisan-rejected-box">

                                            <strong>
                                                Request Rejected
                                            </strong>

                                            <p>
                                                This custom request
                                                has been rejected.
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

export default ArtisanCustomRequests;
