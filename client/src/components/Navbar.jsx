
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  User,
  LogOut,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      setIsLoggedIn(!!token);

      try {
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        setUser(null);
      }
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);

    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  const handleDashboard = () => {
    if (user?.role === "artisan") {
      navigate("/artisan/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-icon">✦</span>
          Craftivo
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/products">
            Discover
          </Link>

          <Link to="/custom">
            Custom Creations
          </Link>

          <Link to="/artisans">
            Artisans
          </Link>
        </nav>

        {/* Actions */}
        <div className="nav-actions">

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="nav-icon"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="nav-icon"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
          </Link>

          {isLoggedIn ? (
            <>
              {/* Dashboard / Account */}
              <button
                onClick={handleDashboard}
                className="profile-button"
              >
                <User size={19} />

                <span>
                  {user?.role === "artisan"
                    ? "Artisan"
                    : "Account"}
                </span>
              </button>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="profile-button"
              >
                <LogOut size={19} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            /* Logged Out */
            <Link
              to="/register"
              className="profile-button"
            >
              <User size={19} />
              <span>Account</span>
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;

