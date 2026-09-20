import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../redux/slices/ProductSlice";
import ProductCard from "../components/ProductCard";
import AIChatbot from "../components/AIChatbot";
import { useNavigate } from "react-router-dom";
import api from "../services/Api";
import "../styles/Home.css";

function Home() {
  const { products, loading, error } = useSelector((state) => state.products);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const categories = [
    { name: "Mobiles", icon: "📱" },
    { name: "Laptops", icon: "💻" },
    { name: "Cars", icon: "🚗" },
    { name: "Bikes", icon: "🏍️" },
    { name: "Electronics", icon: "📺" },
    { name: "Furniture", icon: "🛋️" },
    { name: "Books", icon: "📚" },
    { name: "Fashion", icon: "👕" },
    { name: "Other", icon: "📦" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const latestProducts = products.slice(0, 8);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-small-text">BUY • SELL • DISCOVER</p>

          <h1>
            Find what you need.
            <br />
            Sell what you don't.
          </h1>

          <p className="hero-description">
            Discover great deals from people around you or turn your unused
            items into cash.
          </p>

          <form className="home-search" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>

            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          <div className="hero-actions">
            <button
              className="browse-button"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </button>

            <button className="sell-button" onClick={() => navigate("/sell")}>
              + Sell Something
            </button>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <div>
            <p className="section-label">EXPLORE</p>
            <h2>Browse Categories</h2>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/products")}
          >
            View All →
          </button>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <button
              className="category-card"
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <p className="section-label">JUST ADDED</p>
            <h2>Latest Products</h2>
          </div>

          <button
            className="view-all-button"
            onClick={() => navigate("/products")}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="home-loading">
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="home-error">
            <p>{error}</p>
          </div>
        ) : latestProducts.length === 0 ? (
          <div className="empty-products">
            <span>📦</span>
            <h3>No products yet</h3>
            <p>Be the first person to sell something.</p>

            <button onClick={() => navigate("/sell")}>
              Sell Your First Product
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="sell-cta">
        <div className="sell-cta-content">
          <p className="section-label">HAVE SOMETHING TO SELL?</p>

          <h2>Turn your unused items into cash.</h2>

          <p>
            List your product in just a few steps and connect with interested
            buyers.
          </p>

          <button onClick={() => navigate("/sell")}>+ Sell Something</button>
        </div>

        <div className="sell-cta-icon">💰</div>
      </section>

      <button
        className="ai-chat-button"
        onClick={() => setShowChat(true)}
        aria-label="Open AI assistant"
      >
        🤖
      </button>

      {showChat && <AIChatbot onClose={() => setShowChat(false)} />}
    </div>
  );
}

export default Home;
