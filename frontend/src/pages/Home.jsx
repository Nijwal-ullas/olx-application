import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../redux/slices/ProductSlice";
import { aiSearch } from "../redux/slices/AISlice";
import ProductCard from "../components/ProductCard";
import AIChatbot from "../components/AIChatbot";
import { toast } from "react-toastify";
import "../styles/Home.css";

function Home() {
  const { products, loading, error } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  // const [searchQuery, setSearchQuery] = useState("");
  // const [aiLoading, setAiLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // async function handleAISearch() {
  //   if (!searchQuery.trim()) {
  //     toast.error("Please enter something to search");
  //     return;
  //   }

  //   try {
  //     setAiLoading(true);

  //     await dispatch(aiSearch(searchQuery)).unwrap();
  //   } catch (error) {
  //     toast.error(error || "Search failed");
  //   } finally {
  //     setAiLoading(false);
  //   }
  // }

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="home-page">
      <h2 className="home-title">OLX Products</h2>

      {/* <div className="ai-search">
        <input
          type="text"
          placeholder="Try: mobiles under ₹30000"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button onClick={handleAISearch} disabled={aiLoading}>
          {aiLoading ? "Searching..." : "🔍 Search"}
        </button>
      </div> */}

      {products.length === 0 ? (
        <p className="no-products">No products available</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <button className="ai-chat-button" onClick={() => setShowChat(true)}>
        🤖
      </button>

      {showChat && <AIChatbot onClose={() => setShowChat(false)} />}
    </div>
  );
}

export default Home;
