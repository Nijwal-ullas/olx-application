import api from "../services/Api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ProductDetails.css";

function ProductDetails() {
  const [product, setProduct] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.log("fetch to load product");
      }
    };

    fetchProduct();
  }, [id]);

  async function askAI() {
    if (!question.trim()) {
      toast.error("question not provided");
      return;
    }
    try {
      setAnswer("");
      setLoading(true);
      const response = await api.post("/ai/product-assistant", {
        productId: id,
        question: question,
      });

      setAnswer(response.data.answer);
    } catch (error) {
      console.log(error.message);
      setAnswer("Ai assistant is currently unavialable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="product-details-page">
      <div className="product-details-card">
        <div className="product-details-images">
          <h3>Product Images</h3>

          <div className="product-image-gallery">
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={product.title}
                className="details-image"
              />
            ))}
          </div>

          <div className="ai-assistant">
            <h2> AI Product Assistant</h2>

            <p>Ask anything about this product.</p>

            <input
              type="text"
              placeholder="Ask about this product..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <button onClick={askAI} disabled={loading}>
              {loading ? "Thinking..." : "Ask AI"}
            </button>

            {answer && (
              <div className="ai-answer">
                <h3>AI Answer</h3>
                <p>{answer}</p>
              </div>
            )}
          </div>
        </div>

        <div className="product-details-info">
          <h1>{product.title}</h1>

          <h2>₹{product.price}</h2>

          <div className="details-section">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="details-section">
            <h3>Category</h3>
            <p>{product.category}</p>
          </div>

          <button className="contact-seller-button">Contact Seller</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
