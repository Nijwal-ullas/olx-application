import api from "../services/Api";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/SellProducts.css";

function SellProducts() {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
  });
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [sellMode, setSellMode] = useState(null);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleImage(e) {
    const selectedImages = Array.from(e.target.files);

    setImages((prevImages) => [...prevImages, ...selectedImages]);
  }

  function removeImage(indexToRemove) {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.price ||
      !formData.category ||
      !formData.condition
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();

      data.append("title", formData.title);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("condition", formData.condition);

      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await api.post("/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Product added successfully!");
      navigate("/");
    } catch (error) {
      console.log("SELL ERROR:", error);
      console.log("SERVER ERROR:", error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  async function generateDescription() {
    try {
      if (!formData.title || !formData.price || !formData.category || !formData.condition) {
        toast.error("Please fill Title, Price and Category first");
        return;
      }

      setGenerating(true);

      const response = await api.post("/ai/generate-description", {
        title: formData.title,
        price: formData.price,
        category: formData.category,
        condition: formData.condition,
      });

      console.log(response.data);

      setFormData({
        ...formData,
        description: response.data.description,
      });
    } catch (error) {
      console.log("AI ERROR:", error.response?.data || error.message);

      toast.error(
        error.response?.data?.message || "Failed to generate description",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleAi() {
    try {
      if (!message) {
        toast.error("fill the message");
        return;
      }
      setLoadingAi(true);
      const response = await api.post("/ai/product", {
        message,
      });
      const result = response.data.finalAnswer;
      setFormData({
        title: result.title,
        price: result.suggestedPrice,
        description: result.description,
        category: result.category,
        condition: result.condition,
      });
      setSellMode("manual");
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingAi(false);
    }
  }

  return (
    <div>
      <div className="sell-mode">
        <h3>How do you want to create your listing?</h3>

        <button type="button" onClick={() => setSellMode("ai")}>
          🤖 Use AI
        </button>

        <button type="button" onClick={() => setSellMode("manual")}>
          ✍️ Sell Manually
        </button>
      </div>
      {sellMode === "ai" && (
        <div>
          <label>Describe Your product</label>
          <textarea
            value={message}
            placeholder="Example: iPhone 15 Pro 256GB, good condition, bought last year..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="button" onClick={handleAi} disabled={loadingAi}>
            {!loadingAi ? "Generate with Ai" : "generating..."}
          </button>
        </div>
      )}
      {sellMode === "manual" && (
        <div className="sell-page">
          <div className="sell-card">
            <h2 className="sell-title">Sell Your Product</h2>

            <p className="sell-subtitle">
              Fill in the details to list your product
            </p>

            <form onSubmit={handleSubmit} className="sell-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter the title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Enter the price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your product"
                  value={formData.description}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={generating}
                >
                  {!generating ? "generate" : "generating..."}
                </button>
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  <option value="Mobiles">Mobiles</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Cars">Cars</option>
                  <option value="Bikes">Bikes</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Books">Books</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Condition</label>

                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Used">Used</option>
                </select>
              </div>

              <div className="form-group">
                <label>Images</label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImage}
                />

                <p className="image-help">You can select up to 5 images</p>
              </div>

              {images.length > 0 && (
                <div className="image-preview">
                  {images.map((image, index) => (
                    <div className="preview-item" key={index}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`preview-${index}`}
                      />

                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" className="sell-button" disabled={loading}>
                {loading ? "Loading..." : "Sell Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellProducts;
