
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import axios from "axios";

const ArtisanAddProduct = () => {
    const navigate = useNavigate();

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

    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(
            e.target.files
        );

        if (selectedFiles.length > 5) {
            setError(
                "You can upload a maximum of 5 images."
            );
            return;
        }

        setError("");
        setImages(selectedFiles);
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
                "Please login as an artisan to add a product."
            );
            return;
        }

        if (
            !formData.name.trim() ||
            !formData.description.trim() ||
            !formData.category.trim() ||
            !formData.price ||
            !formData.material.trim() ||
            !formData.stock
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

        if (formData.isCustomizable &&
            formData.customizationOptions.length === 0
        ) {
            setError(
                "Please add at least one customization option."
            );
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();

            data.append(
                "name",
                formData.name.trim()
            );

            data.append(
                "description",
                formData.description.trim()
            );

            data.append(
                "category",
                formData.category.trim()
            );

            data.append(
                "price",
                formData.price
            );

            data.append(
                "material",
                formData.material.trim()
            );

            data.append(
                "stock",
                formData.stock
            );

            data.append(
                "isCustomizable",
                formData.isCustomizable
            );

            data.append(
                "customizationOptions",
                formData.customizationOptions.join(",")
            );

            images.forEach((image) => {
                data.append("images", image);
            });

            const response = await axios.post(
                "http://localhost:5000/api/products",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "Product added:",
                response.data
            );

            setSuccess(
                "Product added successfully!"
            );

            setTimeout(() => {
                navigate("/artisan/products");
            }, 1200);

        } catch (error) {
            console.error(
                "Add product error:",
                error.response?.data || error
            );

            setError(
                error.response?.data?.message ||
                "Failed to add product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="artisan-add-product-page">

            <div className="artisan-add-product-container">

                {/* ========================= */}
                {/* BACK BUTTON */}
                {/* ========================= */}

                <button
                    type="button"
                    className="artisan-add-product-back"
                    onClick={() =>
                        navigate(
                            "/artisan/dashboard"
                        )
                    }
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="artisan-add-product-header">

                    <p>
                        CRAFTIVO ARTISAN
                    </p>

                    <h1>
                        Add New Product
                    </h1>

                    <span>
                        Share your handmade creation
                        with Craftivo customers.
                    </span>

                </div>

                {/* ========================= */}
                {/* FORM */}
                {/* ========================= */}

                <form
                    className="artisan-product-form"
                    onSubmit={handleSubmit}
                >

                    {/* PRODUCT INFORMATION */}

                    <section className="artisan-form-section">

                        <div className="artisan-form-section-heading">

                            <h2>
                                Product Information
                            </h2>

                            <p>
                                Tell customers about
                                your handmade product.
                            </p>

                        </div>

                        <div className="artisan-form-group">

                            <label>
                                Product Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Handmade Wooden Name Plate"
                            />

                        </div>

                        <div className="artisan-form-group">

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
                                placeholder="Describe your handmade product..."
                                rows="5"
                            />

                        </div>

                        <div className="artisan-form-grid">

                            <div className="artisan-form-group">

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
                                    placeholder="e.g. Home Decor"
                                />

                            </div>

                            <div className="artisan-form-group">

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
                                    placeholder="e.g. Premium Wood"
                                />

                            </div>

                        </div>

                        <div className="artisan-form-grid">

                            <div className="artisan-form-group">

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
                                    placeholder="Enter price"
                                />

                            </div>

                            <div className="artisan-form-group">

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
                                    placeholder="Enter available stock"
                                />

                            </div>

                        </div>

                    </section>

                    {/* IMAGES */}

                    <section className="artisan-form-section">

                        <div className="artisan-form-section-heading">

                            <h2>
                                Product Images
                            </h2>

                            <p>
                                Upload up to 5 images
                                of your product.
                            </p>

                        </div>

                        <label className="artisan-image-upload">

                            <Upload size={30} />

                            <strong>
                                Choose Product Images
                            </strong>

                            <span>
                                JPG, JPEG, PNG or WEBP
                            </span>

                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={
                                    handleImageChange
                                }
                            />

                        </label>

                        {images.length > 0 && (
                            <div className="selected-images">

                                {images.map(
                                    (
                                        image,
                                        index
                                    ) => (
                                        <div
                                            className="selected-image-item"
                                            key={`${image.name}-${index}`}
                                        >

                                            <img
                                                src={URL.createObjectURL(
                                                    image
                                                )}
                                                alt={
                                                    image.name
                                                }
                                            />

                                            <span>
                                                {
                                                    image.name
                                                }
                                            </span>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </section>

                    {/* CUSTOMIZATION */}

                    <section className="artisan-form-section">

                        <div className="artisan-form-section-heading">

                            <h2>
                                Customization
                            </h2>

                            <p>
                                Allow customers to
                                personalize this product.
                            </p>

                        </div>

                        <label className="customization-toggle">

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
                                This product is customizable
                            </span>

                        </label>

                        {formData.isCustomizable && (
                            <div className="customization-options-area">

                                <label>
                                    Customization
                                    Options
                                </label>

                                <div className="customization-option-input">

                                    <input
                                        type="text"
                                        value={
                                            customizationOption
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setCustomizationOption(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={(
                                            e
                                        ) => {
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
                                        <Plus
                                            size={17}
                                        />
                                        Add
                                    </button>

                                </div>

                                {formData
                                    .customizationOptions
                                    .length > 0 && (
                                    <div className="customization-tags">

                                        {formData.customizationOptions.map(
                                            (
                                                option
                                            ) => (
                                                <div
                                                    className="customization-tag"
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

                    {/* MESSAGES */}

                    {error && (
                        <div className="artisan-form-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="artisan-form-success">
                            {success}
                        </div>
                    )}

                    {/* SUBMIT */}

                    <div className="artisan-form-actions">

                        <button
                            type="button"
                            className="artisan-cancel-button"
                            onClick={() =>
                                navigate(
                                    "/artisan/dashboard"
                                )
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="artisan-submit-product-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Adding Product..."
                                : "Add Product"}
                        </button>

                    </div>

                </form>

            </div>

        </main>
    );
};

export default ArtisanAddProduct;

