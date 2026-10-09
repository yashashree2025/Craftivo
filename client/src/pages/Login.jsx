
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";
import { loginUser } from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser(formData);

            console.log("LOGIN RESPONSE:", data);

            // --------------------------------
            // Save latest user's authentication
            // --------------------------------

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // --------------------------------
            // Tell Navbar that auth changed
            // --------------------------------

            window.dispatchEvent(
                new Event("authChange")
            );

            // --------------------------------
            // Redirect based on role
            // --------------------------------

            if (data.user.role === "artisan") {
                navigate("/artisan/dashboard");
            } else if (data.user.role === "customer") {
                navigate("/customer/dashboard");
            } else {
                navigate("/");
            }

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-container">

                {/* Left Side */}
                <div className="auth-brand-section">
                    <div className="auth-brand-content">

                        <span className="auth-brand-icon">
                            ✦
                        </span>

                        <h1>
                            Welcome back
                            <br />
                            to Craftivo.
                        </h1>

                        <p>
                            Discover beautiful handmade
                            creations and connect with talented
                            artisans.
                        </p>

                        <div className="auth-decoration">
                            <span>✦</span>
                            <span>♡</span>
                            <span>✦</span>
                        </div>

                    </div>
                </div>

                {/* Right Side */}
                <div className="auth-form-section">
                    <div className="auth-form-wrapper">

                        <div className="auth-heading">

                            <span className="section-label">
                                CRAFTIVO
                            </span>

                            <h2>Sign in</h2>

                            <p>
                                Enter your details to continue
                                your Craftivo journey.
                            </p>

                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Email */}
                            <div className="auth-field">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="auth-input-wrapper">

                                    <Mail size={19} />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />

                                </div>
                            </div>

                            {/* Password */}
                            <div className="auth-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="auth-input-wrapper">

                                    <Lock size={19} />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="auth-submit-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign in"}

                                {!loading && (
                                    <ArrowRight size={19} />
                                )}
                            </button>

                        </form>

                        {/* Register Link */}
                        <div className="auth-divider">
                            <span>
                                New to Craftivo?
                            </span>
                        </div>

                        <Link
                            to="/register"
                            className="auth-secondary-button"
                        >
                            Create an account
                        </Link>

                    </div>
                </div>

            </div>
        </main>
    );
}

export default Login;

