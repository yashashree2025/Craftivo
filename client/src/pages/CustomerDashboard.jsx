
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    ShoppingBag,
    Heart,
    ShoppingCart,
    Palette,
    Package,
    ArrowRight,
    Sparkles
} from "lucide-react";

const CustomerDashboard = () => {
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [cartItems, setCartItems] = useState([]);
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
                    navigate("/login");
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const userData = JSON.parse(
                    localStorage.getItem("user")
                );

                setCustomer(userData);

                const [
                    ordersResponse,
                    favoritesResponse,
                    cartResponse,
                    customRequestsResponse
                ] = await Promise.all([
                    axios.get(
                        "http://localhost:5000/api/orders/customer",
                        config
                    ),
                    axios.get(
                        "http://localhost:5000/api/favorites",
                        config
                    ),
                    axios.get(
                        "http://localhost:5000/api/cart",
                        config
                    ),
                    axios.get(
                        "http://localhost:5000/api/custom-requests/customer",
                        config
                    )
                ]);

                setOrders(
                    ordersResponse.data.orders || []
                );

                setFavorites(
                    favoritesResponse.data.favorites || []
                );

                setCartItems(
                    cartResponse.data.cart?.items ||
                    cartResponse.data.items ||
                    []
                );

                setCustomRequests(
                    customRequestsResponse.data.requests ||
                    []
                );

            } catch (error) {
                console.error(
                    "Customer dashboard error:",
                    error.response?.data || error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard data."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const getStatusClass = (status) => {
        return `customer-status customer-status-${status}`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="customer-dashboard-loading">
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="customer-dashboard-error">
                    {error}
                </div>
            </div>
        );
    }

    const totalOrders = orders.length;
    const wishlistCount = favorites.length;
    const cartCount = cartItems.reduce(
        (total, item) =>
            total + (Number(item.quantity) || 0),
        0
    );
    const customRequestCount = customRequests.length;

    const recentOrders = orders.slice(0, 3);

    return (
        <div className="page-container">
            <div className="customer-dashboard">

                {/* Welcome Section */}

                <section className="customer-welcome">
                    <div>
                        <p className="customer-welcome-label">
                            Welcome back 👋
                        </p>

                        <h1>
                            Hello,{" "}
                            {customer?.name || "Customer"}!
                        </h1>

                        <p>
                            Discover beautiful handmade products
                            and manage your Craftivo orders.
                        </p>
                    </div>

                    <div className="customer-welcome-icon">
                        <Sparkles size={34} />
                    </div>
                </section>

                {/* Statistics */}

                <section className="customer-dashboard-stats">

                    <div className="customer-stat-card">
                        <div className="customer-stat-icon">
                            <ShoppingBag size={22} />
                        </div>

                        <div>
                            <span>Total Orders</span>
                            <strong>{totalOrders}</strong>
                        </div>
                    </div>

                    <div className="customer-stat-card">
                        <div className="customer-stat-icon">
                            <Heart size={22} />
                        </div>

                        <div>
                            <span>Wishlist</span>
                            <strong>{wishlistCount}</strong>
                        </div>
                    </div>

                    <div className="customer-stat-card">
                        <div className="customer-stat-icon">
                            <ShoppingCart size={22} />
                        </div>

                        <div>
                            <span>Cart Items</span>
                            <strong>{cartCount}</strong>
                        </div>
                    </div>

                    <div className="customer-stat-card">
                        <div className="customer-stat-icon">
                            <Palette size={22} />
                        </div>

                        <div>
                            <span>Custom Requests</span>
                            <strong>{customRequestCount}</strong>
                        </div>
                    </div>

                </section>

                {/* Quick Actions */}

                <section className="customer-dashboard-section">

                    <div className="customer-section-heading">
                        <div>
                            <h2>Quick Actions</h2>
                            <p>
                                Access your Craftivo features quickly.
                            </p>
                        </div>
                    </div>

                    <div className="customer-quick-actions">

                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                        >
                            <ShoppingBag size={22} />
                            <span>Browse Products</span>
                            <ArrowRight size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/orders")}
                        >
                            <Package size={22} />
                            <span>My Orders</span>
                            <ArrowRight size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/wishlist")}
                        >
                            <Heart size={22} />
                            <span>My Wishlist</span>
                            <ArrowRight size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/cart")}
                        >
                            <ShoppingCart size={22} />
                            <span>My Cart</span>
                            <ArrowRight size={17} />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/custom-requests")
                            }
                        >
                            <Palette size={22} />
                            <span>Custom Requests</span>
                            <ArrowRight size={17} />
                        </button>

                    </div>

                </section>

                {/* Recent Orders */}

                <section className="customer-dashboard-section">

                    <div className="customer-section-heading">
                        <div>
                            <h2>Recent Orders</h2>
                            <p>
                                Check the latest orders from your account.
                            </p>
                        </div>

                        {orders.length > 0 && (
                            <button
                                type="button"
                                className="customer-view-all-button"
                                onClick={() =>
                                    navigate("/orders")
                                }
                            >
                                View All
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="customer-empty-state">
                            <ShoppingBag size={35} />

                            <h3>No orders yet</h3>

                            <p>
                                Start exploring handmade products
                                and place your first order.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/products")
                                }
                            >
                                Explore Products
                            </button>
                        </div>
                    ) : (
                        <div className="customer-recent-orders">

                            {recentOrders.map((order) => (
                                <div
                                    className="customer-order-card"
                                    key={order.orderId}
                                >
                                    <div className="customer-order-image">
                                        {order.product?.images?.[0] ? (
                                            <img
                                                src={`http://localhost:5000/${order.product.images[0]}`}
                                                alt={
                                                    order.product.name
                                                }
                                            />
                                        ) : (
                                            <ShoppingBag size={28} />
                                        )}
                                    </div>

                                    <div className="customer-order-info">

                                        <h3>
                                            {order.product?.name ||
                                                "Product"}
                                        </h3>

                                        <p>
                                            Order #
                                            {String(
                                                order.orderId
                                            ).slice(-8)}
                                        </p>

                                        <span>
                                            {formatDate(
                                                order.createdAt
                                            )}
                                        </span>

                                    </div>

                                    <div className="customer-order-right">

                                        <strong>
                                            ₹{order.totalAmount}
                                        </strong>

                                        <span
                                            className={getStatusClass(
                                                order.orderStatus
                                            )}
                                        >
                                            {order.orderStatus}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/orders/${order.orderId}`
                                                )
                                            }
                                        >
                                            View Order
                                            <ArrowRight
                                                size={15}
                                            />
                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </div>
        </div>
    );
};

export default CustomerDashboard;

