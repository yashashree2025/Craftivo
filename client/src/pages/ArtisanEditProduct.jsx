
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Plus,
    X,
} from "lucide-react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import axios from "axios";

const ArtisanEditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        material: "",
        stock: "",
        isCustomizable: false,
        customizationOptions: [],
    });

    const [customizationOption, setCustomizationOption] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login as an artisan."
                );
                return;
            }

            const response = await axios.get(
                `http://localhost:5000/api/products/${id}`
            );

            const product =
                response.data.product ||
                response.data;

            setFormData({
                name: product.name || "",
                description:
                    product.description || "",
                category:
                    product.category || "",
                price:
                    product.price ?? "",
                material:
                    product.material || "",
                stock:
                    product.stock ?? "",
                isCustomizable:
                    product.isCustomizable || false,
                customizationOptions:
                    product.customizationOptions || [],
            });
        } catch (error) {
            console.error(
                "Fetch product error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load product."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCustomizationToggle = (e) => {
        setFormData((previous) => ({
            ...previous,
            isCustomizable: e.target.checked,
        }));
    };

    const addCustomizationOption = () => {
        const option =
            customizationOption.trim();

        if (!option) {
            return;
        }

        const alreadyExists =
            formData.customizationOptions.some(
                (item) =>
                    item.toLowerCase() ===
                    option.toLowerCase()
            );

        if (alreadyExists) {
            setError(
                "This customization option already exists."
            );
            return;
        }

        setFormData((previous) => ({
            ...previous,
            customizationOptions: [
                ...previous.customizationOptions,
                option,
            ],
        }));

        setCustomizationOption("");
        setError("");
    };

    const removeCustomizationOption = (
        optionToRemove
    ) => {
        setFormData((previous) => ({
            ...previous,
            customizationOptions:
                previous.customizationOptions.filter(
                    (option) =>
                        option !== optionToRemove
                ),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const token =
            localStorage.getItem("token");

        if (!token) {
            setError(
                "Please login as an artisan."
            );
            return;
        }

        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            !formData.category.trim() ||
            !formData.price ||
            !formData.material.trim() ||
            formData.stock === ""
        ) {
            setError(
                "Please fill in all required fields."
            );
            return;
        }

        if (Number(formData.price) < 0) {
            setError(
                "Price cannot be negative."
            );
            return;
        }

        if (Number(formData.stock) < 0) {
            setError(
                "Stock cannot be negative."
            );
            return;
        }

        if (
            formData.isCustomizable &&
            formData.customizationOptions
                .length === 0
        ) {
            setError(
                "Please add at least one customization option."
            );
            return;
        }

        try {
            setSaving(true);

            const data = {
                name: formData.name.trim(),
                description:
                    formData.description.trim(),
                category:
                    formData.category.trim(),
                price: Number(formData.price),
                material:
                    formData.material.trim(),
                stock: Number(formData.stock),
                isCustomizable:
                    formData.isCustomizable,
                customizationOptions:
                    formData.customizationOptions,
            };

            await axios.put(
                `http://localhost:5000/api/products/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess(
                "Product updated successfully!"
            );

            setTimeout(() => {
                navigate("/artisan/products");
            }, 1000);
        } catch (error) {
            console.error(
                "Update product error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to update product."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="artisan-edit-product-page">
                <div className="artisan-edit-product-container">
                    <div className="artisan-edit-loading">
                        Loading product...
                    </div>
                </div>
            </main>
        );
    }

    if (error && !formData.name) {
        return (
            <main className="artisan-edit-product-page">
                <div className="artisan-edit-product-container">
                    <button
                        type="button"
                        className="artisan-edit-back"
                        onClick={() =>
                            navigate(
                                "/artisan/products"
                            )
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Products
                    </button>

                    <div className="artisan-edit-error">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="artisan-edit-product-page">
            <div className="artisan-edit-product-container">

                <button
                    type="button"
                    className="artisan-edit-back"
                    onClick={() =>
                        navigate(
                            "/artisan/products"
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Products
                </button>

                <div className="artisan-edit-header">
                    <p>CRAFTIVO ARTISAN</p>

                    <h1>Edit Product</h1>

                    <span>
                        Update the details of your
                        handmade product.
                    </span>
                </div>

                <form
                    className="artisan-edit-form"
                    onSubmit={handleSubmit}
                >
                    <section className="artisan-edit-section">
                        <div className="artisan-edit-section-heading">
                            <h2>
                                Product Information
                            </h2>

                            <p>
                                Update your product
                                details.
                            </p>
                        </div>

                        <div className="artisan-edit-group">
                            <label>
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                            />
                        </div>

                        <div className="artisan-edit-group">
                            <label>
                                Description *
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows="5"
                            />
                        </div>

                        <div className="artisan-edit-grid">
                            <div className="artisan-edit-group">
                                <label>
                                    Category *
                                </label>

                                <input
                                    type="text"
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="artisan-edit-group">
                                <label>
                                    Material *
                                </label>

                                <input
                                    type="text"
                                    name="material"
                                    value={
                                        formData.material
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>

                        <div className="artisan-edit-grid">
                            <div className="artisan-edit-group">
                                <label>
                                    Price (₹) *
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>

                            <div className="artisan-edit-group">
                                <label>
                                    Stock *
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    min="0"
                                    value={
                                        formData.stock
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <section className="artisan-edit-section">
                        <div className="artisan-edit-section-heading">
                            <h2>
                                Customization
                            </h2>

                            <p>
                                Allow customers to
                                personalize this
                                product.
                            </p>
                        </div>

                        <label className="artisan-edit-toggle">
                            <input
                                type="checkbox"
                                checked={
                                    formData.isCustomizable
                                }
                                onChange={
                                    handleCustomizationToggle
                                }
                            />

                            <span>
                                This product is
                                customizable
                            </span>
                        </label>

                        {formData.isCustomizable && (
                            <div className="artisan-edit-customization">
                                <label>
                                    Customization
                                    Options
                                </label>

                                <div className="artisan-edit-option-input">
                                    <input
                                        type="text"
                                        value={
                                            customizationOption
                                        }
                                        onChange={(e) =>
                                            setCustomizationOption(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key ===
                                                "Enter"
                                            ) {
                                                e.preventDefault();
                                                addCustomizationOption();
                                            }
                                        }}
                                        placeholder="e.g. Name, Color, Size"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            addCustomizationOption
                                        }
                                    >
                                        <Plus size={17} />
                                        Add
                                    </button>
                                </div>

                                {formData
                                    .customizationOptions
                                    .length > 0 && (
                                    <div className="artisan-edit-tags">
                                        {formData.customizationOptions.map(
                                            (
                                                option
                                            ) => (
                                                <div
                                                    className="artisan-edit-tag"
                                                    key={
                                                        option
                                                    }
                                                >
                                                    <span>
                                                        {
                                                            option
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeCustomizationOption(
                                                                option
                                                            )
                                                        }
                                                        aria-label={`Remove ${option}`}
                                                    >
                                                        <X
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {error && (
                        <div className="artisan-edit-form-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="artisan-edit-form-success">
                            {success}
                        </div>
                    )}

                    <div className="artisan-edit-actions">
                        <button
                            type="button"
                            className="artisan-edit-cancel"
                            onClick={() =>
                                navigate(
                                    "/artisan/products"
                                )
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="artisan-edit-save"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving Changes..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ArtisanEditProduct;

