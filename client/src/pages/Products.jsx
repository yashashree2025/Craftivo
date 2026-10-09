
import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Heart,
  Star,
} from "lucide-react";
import { getProducts } from "../services/productService";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../services/favoriteService";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isCustomizable, setIsCustomizable] = useState(false);

  // Wishlist states
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState(null);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [favoriteError, setFavoriteError] = useState("");

  const categories = [
    "Home Decor",
    "Jewelry",
    "Art & Paintings",
    "Handmade Gifts",
  ];

  // =========================================================
  // FETCH PRODUCTS
  // =========================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const filters = {};

      if (search.trim()) {
        filters.search = search.trim();
      }

      if (category) {
        filters.category = category;
      }

      if (minPrice) {
        filters.minPrice = minPrice;
      }

      if (maxPrice) {
        filters.maxPrice = maxPrice;
      }

      if (isCustomizable) {
        filters.isCustomizable = true;
      }

      const data = await getProducts(filters);

      setProducts(data.products || []);
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH FAVORITES
  // =========================================================

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setFavoriteIds([]);
      return;
    }

    try {
      const data = await getFavorites();

      const favorites = data.favorites || [];

      const ids = favorites
        .map((favorite) => {
          return (
            favorite.productId?._id ||
            favorite.productId
          );
        })
        .filter(Boolean)
        .map((id) => String(id));

      setFavoriteIds(ids);
    } catch (error) {
      console.error(
        "Failed to fetch favorites:",
        error
      );

      setFavoriteIds([]);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, []);

  // =========================================================
  // FILTER CHANGES
  // =========================================================

  useEffect(() => {
    fetchProducts();
  }, [category, isCustomizable]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setIsCustomizable(false);
  };

  // =========================================================
  // ADD / REMOVE FAVORITE
  // =========================================================

  const handleFavorite = async (productId) => {
    setFavoriteMessage("");
    setFavoriteError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setFavoriteError(
        "Please login to save products to your wishlist."
      );
      return;
    }

    const productIdString = String(productId);

    const alreadyFavorite =
      favoriteIds.includes(productIdString);

    try {
      setFavoriteLoadingId(productIdString);

      if (alreadyFavorite) {
        // Remove from wishlist

        await removeFavorite(productId);

        setFavoriteIds((previous) =>
          previous.filter(
            (id) => id !== productIdString
          )
        );

        setFavoriteMessage(
          "Removed from your wishlist."
        );
      } else {
        // Add to wishlist

        await addFavorite(productId);

        setFavoriteIds((previous) => [
          ...previous,
          productIdString,
        ]);

        setFavoriteMessage(
          "Added to your wishlist!"
        );
      }
    } catch (error) {
      console.error(
        "Favorite error:",
        error.response?.data || error
      );

      setFavoriteError(
        error.response?.data?.message ||
        "Unable to update your wishlist."
      );
    } finally {
      setFavoriteLoadingId(null);
    }
  };

  return (
    <div className="products-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="products-header">

        <div>
          <span className="section-label">
            CRAFTIVO COLLECTION
          </span>

          <h1>
            Discover handmade.
          </h1>

          <p>
            Explore unique creations made by
            independent artisans.
          </p>
        </div>

        <div className="products-count">
          <strong>
            {products.length}
          </strong>

          <span>
            creations
          </span>
        </div>

      </section>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section className="product-search-section">

        <form
          className="product-search"
          onSubmit={handleSearch}
        >
          <Search size={20} />

          <input
            type="text"
            placeholder="Search handmade products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>

      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="products-layout">

        {/* ===================================================
            FILTERS
        =================================================== */}

        <aside className="filters">

          <div className="filters-title">

            <div>
              <SlidersHorizontal size={18} />

              <h3>
                Filters
              </h3>
            </div>

            <button onClick={clearFilters}>
              Clear
            </button>

          </div>

          {/* Category */}

          <div className="filter-group">

            <h4>
              Category
            </h4>

            <label>

              <input
                type="radio"
                name="category"
                checked={category === ""}
                onChange={() =>
                  setCategory("")
                }
              />

              <span>
                All Categories
              </span>

            </label>

            {categories.map((item) => (
              <label key={item}>

                <input
                  type="radio"
                  name="category"
                  checked={
                    category === item
                  }
                  onChange={() =>
                    setCategory(item)
                  }
                />

                <span>
                  {item}
                </span>

              </label>
            ))}

          </div>

          {/* Price */}

          <div className="filter-group">

            <h4>
              Price Range
            </h4>

            <div className="price-inputs">

              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value)
                }
              />

            </div>

            <button
              className="apply-price"
              onClick={fetchProducts}
            >
              Apply Price
            </button>

          </div>

          {/* Customizable */}

          <div className="filter-group">

            <h4>
              Creation Type
            </h4>

            <label className="checkbox-label">

              <input
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) =>
                  setIsCustomizable(
                    e.target.checked
                  )
                }
              />

              <span>
                Customizable products
              </span>

            </label>

          </div>

        </aside>

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        <div className="products-results">

          {/* Wishlist Message */}

          {favoriteMessage && (
            <div className="favorite-success-message">
              {favoriteMessage}
            </div>
          )}

          {favoriteError && (
            <div className="favorite-error-message">
              {favoriteError}
            </div>
          )}

          {loading ? (

            <div className="products-message">

              <div className="loader"></div>

              <p>
                Finding beautiful creations...
              </p>

            </div>

          ) : products.length === 0 ? (

            <div className="products-message">

              <h3>
                No creations found
              </h3>

              <p>
                Try changing your search
                or filters.
              </p>

              <button
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="discover-grid">

              {products.map((product) => {

                const isFavorite =
                  favoriteIds.includes(
                    String(product._id)
                  );

                const isFavoriteLoading =
                  favoriteLoadingId ===
                  String(product._id);

                return (
                  <div
                    className="discover-product-card"
                    key={product._id}
                  >

                    {/* Product Image */}

                    <div className="discover-image">

                      <Link
                        to={`/products/${product._id}`}
                        className="product-image-link"
                      >

                        {product.images &&
                        product.images.length > 0 ? (

                          <img
                            src={`http://localhost:5000/${product.images[0]}`}
                            alt={product.name}
                            className="product-image"
                          />

                        ) : (

                          <div className="product-image-placeholder">
                            ✦
                          </div>

                        )}

                      </Link>

                      {/* =================================================
                          WISHLIST HEART
                      ================================================= */}

                      <button
                        type="button"
                        className={`discover-wishlist ${
                          isFavorite
                            ? "discover-wishlist-active"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          handleFavorite(
                            product._id
                          );
                        }}
                        disabled={
                          isFavoriteLoading
                        }
                        aria-label={
                          isFavorite
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <Heart
                          size={18}
                          fill={
                            isFavorite
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      {/* Customizable Badge */}

                      {product.isCustomizable && (
                        <span className="custom-badge">
                          Customizable
                        </span>
                      )}

                    </div>

                    {/* =================================================
                        PRODUCT INFO
                    ================================================= */}

                    <div className="discover-info">

                      <span className="discover-category">
                        {product.category}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <p className="discover-material">
                        {product.material ||
                          "Handcrafted"}
                      </p>

                      {/* Rating */}

                      <div className="rating">

                        <Star
                          size={14}
                          fill="currentColor"
                        />

                        <span>
                          {product.averageRating > 0
                            ? product.averageRating
                            : "New"}
                        </span>

                        {product.totalReviews > 0 && (
                          <span className="review-count">
                            (
                            {
                              product.totalReviews
                            }
                            )
                          </span>
                        )}

                      </div>

                      {/* Bottom */}

                      <div className="discover-bottom">

                        <strong>
                          ₹{product.price}
                        </strong>

                        <Link
                          to={`/products/${product._id}`}
                          className="view-product-button"
                        >
                          View Product
                        </Link>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Products;

