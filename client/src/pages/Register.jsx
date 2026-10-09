import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";
import { registerUser } from "../services/authService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "customer",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name ||
            !formData.email ||
            !formData.phone ||
            !formData.password
        ) {
            setError("Please fill all required fields.");
            return;
        }

        try {
            setLoading(true);

            const data = await registerUser(formData);

            setSuccess(
                data.message || "Account created successfully!"
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            console.error("Registration error:", error);

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
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
                            Create your
                            <br />
                            Craftivo story.
                        </h1>

                        <p>
                            Join a community where handmade
                            creations, creativity and artisans
                            come together.
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

                            <h2>Create account</h2>

                            <p>
                                Start discovering beautiful
                                handmade creations.
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="auth-success">
                                {success}
                            </div>
                        )}

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Name */}
                            <div className="auth-field">
                                <label htmlFor="name">
                                    Full name
                                </label>

                                <div className="auth-input-wrapper">
                                    <User size={19} />

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

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

                            {/* Phone */}
                            <div className="auth-field">
                                <label htmlFor="phone">
                                    Phone number
                                </label>

                                <div className="auth-input-wrapper">
                                    <Phone size={19} />

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
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
                                        placeholder="Create a password"
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
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
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

                            {/* Role */}
                            <div className="auth-field">
                                <label>
                                    I want to join as
                                </label>

                                <div className="role-options">

                                    <label
                                        className={`role-option ${
                                            formData.role ===
                                            "customer"
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="customer"
                                            checked={
                                                formData.role ===
                                                "customer"
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span>
                                            <strong>
                                                Customer
                                            </strong>
                                            <small>
                                                Discover & shop
                                            </small>
                                        </span>
                                    </label>

                                    <label
                                        className={`role-option ${
                                            formData.role ===
                                            "artisan"
                                                ? "selected"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="artisan"
                                            checked={
                                                formData.role ===
                                                "artisan"
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span>
                                            <strong>
                                                Artisan
                                            </strong>
                                            <small>
                                                Sell your creations
                                            </small>
                                        </span>
                                    </label>

                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="auth-submit-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create account"}

                                {!loading && (
                                    <ArrowRight size={19} />
                                )}
                            </button>

                        </form>

                        <div className="auth-divider">
                            <span>
                                Already have an account?
                            </span>
                        </div>

                        <Link
                            to="/login"
                            className="auth-secondary-button"
                        >
                            Sign in
                        </Link>

                    </div>
                </div>

            </div>
        </main>
    );
}

export default Register;