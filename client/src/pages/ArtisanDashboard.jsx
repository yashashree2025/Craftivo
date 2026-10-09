
import { useEffect, useState } from "react";
import {
    Package,
    ShoppingBag,
    Sparkles,
    IndianRupee,
    Plus,
    ClipboardList,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ArtisanDashboard = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customRequests, setCustomRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    setError(
                        "Please login to access the artisan dashboard."
                    );
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                /*
                 * Fetch artisan products
                 */
                
const productsResponse = await axios.get(
    "http://localhost:5000/api/products/my-products",
    config
);



                /*
                 * Fetch artisan orders
                 */
                const ordersResponse = await axios.get(
                    "http://localhost:5000/api/orders/artisan",
                    config
                );

                /*
                 * Fetch artisan custom requests
                 */
                const customRequestsResponse =
                    await axios.get(
                        "http://localhost:5000/api/custom-requests/artisan",
                        config
                    );

                setProducts(
                    productsResponse.data.products ||
                        []
                );

                setOrders(
                    ordersResponse.data.orders ||
                        []
                );

                setCustomRequests(
                    customRequestsResponse.data.requests ||
                        []
                );
            } catch (error) {
                console.error(
                    "Artisan dashboard error:",
                    error.response?.data || error
                );

                setError(
                    error.response?.data?.message ||
                        "Unable to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    /*
     * Calculate total sales from paid orders
     */
    const totalSales = orders.reduce(
        (total, order) => {
            if (order.paymentStatus === "paid") {
                return (
                    total +
                    (Number(order.totalAmount) || 0)
                );
            }

            return total;
        },
        0
    );

    /*
     * Show latest 5 orders
     */
    const recentOrders = orders.slice(0, 5);

    if (loading) {
        return (
            <main className="artisan-dashboard-page">
                <div className="artisan-dashboard-container">
                    <div className="dashboard-loading">
                        Loading artisan dashboard...
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="artisan-dashboard-page">
                <div className="artisan-dashboard-container">
                    <div className="dashboard-error">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="artisan-dashboard-page">

            <div className="artisan-dashboard-container">

                {/* ========================= */}
                {/* DASHBOARD HEADER */}
                {/* ========================= */}

                <div className="artisan-dashboard-header">

                    <div>
                        <p className="dashboard-label">
                            CRAFTIVO ARTISAN
                        </p>

                        <h1>
                            Artisan Dashboard
                        </h1>

                        <p>
                            Manage your handmade
                            products, orders and
                            custom creations.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="dashboard-add-product-button"
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

                {/* ========================= */}
                {/* STAT CARDS */}
                {/* ========================= */}

                <div className="artisan-stat-grid">

                    <div className="artisan-stat-card">

                        <div className="artisan-stat-icon">
                            <Package size={22} />
                        </div>

                        <div>
                            <span>
                                Total Products
                            </span>

                            <strong>
                                {products.length}
                            </strong>
                        </div>

                    </div>

                    <div className="artisan-stat-card">

                        <div className="artisan-stat-icon">
                            <ShoppingBag size={22} />
                        </div>

                        <div>
                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {orders.length}
                            </strong>
                        </div>

                    </div>

                    <div className="artisan-stat-card">

                        <div className="artisan-stat-icon">
                            <Sparkles size={22} />
                        </div>

                        <div>
                            <span>
                                Custom Requests
                            </span>

                            <strong>
                                {customRequests.length}
                            </strong>
                        </div>

                    </div>

                    <div className="artisan-stat-card">

                        <div className="artisan-stat-icon">
                            <IndianRupee size={22} />
                        </div>

                        <div>
                            <span>
                                Total Sales
                            </span>

                            <strong>
                                ₹{totalSales}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* ========================= */}
                {/* QUICK ACTIONS */}
                {/* ========================= */}

                <section className="artisan-dashboard-section">

                    <div className="dashboard-section-heading">

                        <div>
                            <p>
                                QUICK ACTIONS
                            </p>

                            <h2>
                                Manage Your Craftivo Store
                            </h2>
                        </div>

                    </div>

                    <div className="artisan-quick-actions">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/artisan/add-product"
                                )
                            }
                        >
                            <Plus size={20} />

                            <span>
                                Add New Product
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/artisan/products"
                                )
                            }
                        >
                            <Package size={20} />

                            <span>
                                Manage Products
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/artisan/orders"
                                )
                            }
                        >
                            <ShoppingBag size={20} />

                            <span>
                                View Orders
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/artisan/custom-requests"
                                )
                            }
                        >
                            <ClipboardList size={20} />

                            <span>
                                Custom Requests
                            </span>
                        </button>

                    </div>

                </section>

                {/* ========================= */}
                {/* RECENT ORDERS */}
                {/* ========================= */}

                <section className="artisan-dashboard-section">

                    <div className="dashboard-section-heading">

                        <div>
                            <p>
                                RECENT ACTIVITY
                            </p>

                            <h2>
                                Recent Orders
                            </h2>
                        </div>

                        {orders.length > 0 && (
                            <button
                                type="button"
                                className="dashboard-view-all-button"
                                onClick={() =>
                                    navigate(
                                        "/artisan/orders"
                                    )
                                }
                            >
                                View All
                            </button>
                        )}

                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="dashboard-empty-state">

                            <ShoppingBag
                                size={32}
                            />

                            <h3>
                                No orders yet
                            </h3>

                            <p>
                                Your customer orders
                                will appear here.
                            </p>

                        </div>
                    ) : (
                        <div className="recent-orders-list">

                            {recentOrders.map(
                                (order) => (
                                    <div
                                        className="recent-order-card"
                                        key={
                                            order.orderId ||
                                            order._id
                                        }
                                    >

                                        <div className="recent-order-icon">
                                            <Package
                                                size={20}
                                            />
                                        </div>

                                        <div className="recent-order-info">

                                            <strong>
                                                Order #
                                                {String(
                                                    order.orderId ||
                                                        order._id
                                                ).slice(-8)}
                                            </strong>

                                            <span>
                                                {order.product
                                                    ?.name ||
                                                    "Custom Order"}
                                            </span>

                                        </div>

                                        <div className="recent-order-price">

                                            <strong>
                                                ₹
                                                {
                                                    order.totalAmount
                                                }
                                            </strong>

                                            <span
                                                className={`order-status-${order.orderStatus}`}
                                            >
                                                {order.orderStatus
                                                    ?.replace(
                                                        "_",
                                                        " "
                                                    )
                                                    .replace(
                                                        /\b\w/g,
                                                        (
                                                            letter
                                                        ) =>
                                                            letter.toUpperCase()
                                                    )}
                                            </span>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </section>

                {/* ========================= */}
                {/* CUSTOM REQUEST SUMMARY */}
                {/* ========================= */}

                <section className="artisan-dashboard-section">

                    <div className="dashboard-section-heading">

                        <div>
                            <p>
                                CUSTOM CREATIONS
                            </p>

                            <h2>
                                Custom Request Overview
                            </h2>
                        </div>

                        {customRequests.length >
                            0 && (
                            <button
                                type="button"
                                className="dashboard-view-all-button"
                                onClick={() =>
                                    navigate(
                                        "/artisan/custom-requests"
                                    )
                                }
                            >
                                View All
                            </button>
                        )}

                    </div>

                    <div className="custom-request-summary-grid">

                        <div>
                            <span>
                                Pending
                            </span>

                            <strong>
                                {
                                    customRequests.filter(
                                        (request) =>
                                            request.status ===
                                            "pending"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Accepted
                            </span>

                            <strong>
                                {
                                    customRequests.filter(
                                        (request) =>
                                            request.status ===
                                            "accepted"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Approved
                            </span>

                            <strong>
                                {
                                    customRequests.filter(
                                        (request) =>
                                            request.status ===
                                            "approved"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Completed
                            </span>

                            <strong>
                                {
                                    customRequests.filter(
                                        (request) =>
                                            request.status ===
                                            "completed"
                                    ).length
                                }
                            </strong>
                        </div>

                    </div>

                </section>

            </div>

        </main>
    );
};

export default ArtisanDashboard;

