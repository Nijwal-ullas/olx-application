import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/Api";
import { toast } from "react-toastify";
import "../styles/EditProduct.css";

function EditProduct() {
  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
  });
  const [updating, setUpdating] = useState(false);

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [generating, setGenerating] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        const p = response.data.product;

        setProduct({
          title: p.title,
          price: p.price,
          description: p.description,
          category: p.category,
          condition: p.condition,
        });

        setImages(p.images || []);
      } catch (error) {
        console.log(error.message);
      }
    };

    getProducts();
  }, [id]);

  function handleChange(e) {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  }

  function handleImage(e) {
    const selectedImages = Array.from(e.target.files);

    if (images.length + newImages.length + selectedImages.length > 5) {
      toast.error("Maximum 5 images are allowed");
      return;
    }

    setNewImages((prevImages) => [...prevImages, ...selectedImages]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !product.title ||
      !product.price ||
      !product.category ||
      !product.condition
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (images.length === 0 && newImages.length === 0) {
      toast.error("Please keep at least one image");
      return;
    }

    try {
      setUpdating(true);
      const data = new FormData();

      data.append("title", product.title);
      data.append("price", product.price);
      data.append("description", product.description);
      data.append("category", product.category);
      data.append("condition", product.condition);
      data.append("existingImages", JSON.stringify(images));

      newImages.forEach((image) => {
        data.append("images", image);
      });

      const response = await api.put(`/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      toast.success("Product updated successfully!");

      navigate("/my-products");
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setUpdating(false);
    }
  }

  async function generateDescription() {
    if (
      !product.title ||
      !product.price ||
      !product.category ||
      !product.condition
    ) {
      toast.error("Please fill Title, Price, condition and Category first");
      return;
    }

    try {
      setGenerating(true);

      const response = await api.post("/ai/generate-description", {
        title: product.title,
        price: product.price,
        category: product.category,
        condition: product.condition,
      });

      setProduct({
        ...product,
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

  return (
    <div className="edit-page">
      <div className="edit-card">
        <h2 className="edit-title">Edit Product</h2>

        <div className="current-images-section">
          <h3>Current Images</h3>

          <div className="current-images">
            {images.length === 0 ? (
              <p>No images available</p>
            ) : (
              images.map((image, index) => (
                <div className="current-image-item" key={index}>
                  <img src={image} alt={product.title} />

                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={() => {
                      setImages(images.filter((_, i) => i !== index));
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="edit-form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={product.title}
              onChange={handleChange}
            />
          </div>

          <div className="edit-form-group">
            <label>Price</label>

            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
          </div>

          <div className="edit-form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={generateDescription}
              disabled={generating}
            >
              {generating ? "Generating..." : "Generate Description"}
            </button>
          </div>

          <div className="edit-form-group">
            <label>Category</label>

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
            >
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

          <div className="edit-form-group">
            <label>Condition</label>

            <select
              name="condition"
              value={product.condition}
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

          <div className="edit-form-group">
            <label>Add New Images</label>

            {newImages.length > 0 && (
              <div className="new-images">
                {newImages.map((image, index) => (
                  <div className="new-image-item" key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`new-${index}`}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setNewImages(newImages.filter((_, i) => i !== index));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImage}
            />

            <small>Select new images if you want to add more.</small>
          </div>

          <button type="submit" className="update-button" disabled={updating}>
            {updating ? "updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
