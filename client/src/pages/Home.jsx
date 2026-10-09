import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Sparkles,
  Palette,
  HandHeart,
} from "lucide-react";

function Home() {
  const categories = [
    {
      name: "Home Decor",
      icon: "🏺",
      description: "Beautiful pieces for your space",
    },
    {
      name: "Jewelry",
      icon: "💍",
      description: "Unique handmade accessories",
    },
    {
      name: "Art & Paintings",
      icon: "🎨",
      description: "Art made with passion",
    },
    {
      name: "Handmade Gifts",
      icon: "🎁",
      description: "Meaningful gifts for loved ones",
    },
  ];

  const products = [
    {
      name: "Handmade Wooden Name Plate",
      artisan: "Crafted by Artisan",
      price: "₹999",
      image:
        "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Handcrafted Ceramic Vase",
      artisan: "Clay & Soul",
      price: "₹799",
      image:
        "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Artisan Handmade Jewelry",
      artisan: "The Craft Studio",
      price: "₹1,299",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=700&q=80",
    },
    {
      name: "Handwoven Decorative Basket",
      artisan: "Earth & Thread",
      price: "₹899",
      image:
        "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=700&q=80",
    },
  ];

  return (
    <div className="home">

      {/* ================= HERO ================= */}

      <section className="hero-section">
        <div className="hero-content">

          <span className="hero-label">
            <Sparkles size={16} />
            HANDMADE WITH HEART
          </span>

          <h1>
            Discover things
            <br />
            <span>made with meaning.</span>
          </h1>

          <p>
            Explore unique handmade creations crafted by passionate
            artisans. Find something special or make it truly yours.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="primary-button">
              Explore Products
              <ArrowRight size={18} />
            </Link>

            <Link to="/custom" className="secondary-button">
              Create Custom
            </Link>
          </div>

          <div className="hero-note">
            <Heart size={15} fill="currentColor" />
            Every purchase supports an artisan
          </div>

        </div>

        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=85"
            alt="Handmade crafts"
            className="hero-image"
          />

          <div className="hero-floating-card">
            <div className="floating-icon">
              ✦
            </div>
            <div>
              <strong>Made by hand</strong>
              <span>Made with love</span>
            </div>
          </div>
        </div>
      </section>


      {/* ================= CATEGORIES ================= */}

      <section className="categories-section">

        <div className="section-heading">
          <div>
            <span className="section-label">EXPLORE</span>
            <h2>Find something you love</h2>
          </div>

          <Link to="/products" className="view-link">
            View all
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="category-grid">

          {categories.map((category) => (
            <Link
              to="/products"
              className="category-card"
              key={category.name}
            >
              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.name}</h3>

              <p>{category.description}</p>

              <ArrowRight
                size={18}
                className="category-arrow"
              />
            </Link>
          ))}

        </div>

      </section>


      {/* ================= FEATURED PRODUCTS ================= */}

      <section className="products-section">

        <div className="section-heading">
          <div>
            <span className="section-label">CURATED FOR YOU</span>
            <h2>Featured creations</h2>
          </div>

          <Link to="/products" className="view-link">
            Shop all
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="product-grid">

          {products.map((product) => (
            <div className="product-card" key={product.name}>

              <div className="product-image-container">

                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />

                <button
                  className="wishlist-button"
                  aria-label="Add to wishlist"
                >
                  <Heart size={19} />
                </button>

              </div>

              <div className="product-info">

                <span className="product-artisan">
                  {product.artisan}
                </span>

                <h3>{product.name}</h3>

                <div className="product-bottom">
                  <strong>{product.price}</strong>

                  <Link to="/products" className="product-link">
                    View
                    <ArrowRight size={15} />
                  </Link>
                </div>

              </div>

            </div>
          ))}

        </div>

      </section>


      {/* ================= ARTISAN STORY ================= */}

      <section className="artisan-section">

        <div className="artisan-image">
          <img
            src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=85"
            alt="Artisan handmade pottery"
          />
        </div>

        <div className="artisan-content">

          <span className="section-label">
            THE PEOPLE BEHIND THE CRAFT
          </span>

          <h2>
            More than a product.
            <br />
            <span>It's someone's craft.</span>
          </h2>

          <p>
            Craftivo connects you directly with talented artisans who
            put their time, creativity and passion into every creation.
          </p>

          <p>
            Discover their work, learn their stories and bring home
            something that feels genuinely yours.
          </p>

          <Link to="/artisans" className="primary-button">
            Meet Our Artisans
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>


      {/* ================= WHY CRAFTIVO ================= */}

      <section className="why-section">

        <div className="why-heading">
          <span className="section-label">WHY CRAFTIVO</span>

          <h2>
            Handmade feels
            <br />
            <span>different.</span>
          </h2>
        </div>

        <div className="why-grid">

          <div className="why-card">
            <div className="why-icon">
              <HandHeart size={25} />
            </div>

            <h3>Made by real artisans</h3>

            <p>
              Discover products created by independent makers,
              not mass-produced factories.
            </p>
          </div>


          <div className="why-card">
            <div className="why-icon">
              <Palette size={25} />
            </div>

            <h3>Make it your own</h3>

            <p>
              Request personalized designs, colors, names and
              other custom details.
            </p>
          </div>


          <div className="why-card">
            <div className="why-icon">
              <Sparkles size={25} />
            </div>

            <h3>One-of-a-kind finds</h3>

            <p>
              Find meaningful creations that have their own
              character and story.
            </p>
          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="custom-cta">

        <div>
          <span className="section-label">HAVE SOMETHING SPECIAL IN MIND?</span>

          <h2>
            Create something
            <br />
            <span>uniquely yours.</span>
          </h2>

          <p>
            Work with an artisan to turn your idea into a
            personalized handmade creation.
          </p>
        </div>

        <Link to="/custom" className="light-button">
          Start a Custom Request
          <ArrowRight size={18} />
        </Link>

      </section>

    </div>
  );
}

export default Home;