import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/Api";
import "../styles/MyProducts.css";

function MyProducts() {
  const token = useSelector((state) => state.auth.token);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getMyProducts = async () => {
      try {
        const response = await api.get("/products/myProducts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
        setProducts(response.data.products);
      } catch (error) {
        console.log(error.message);
      }
    };

    getMyProducts();
  }, [token]);

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id),
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  }

  return (
    <div className="my-products-page">

      <h2 className="my-products-heading">
        My Products
      </h2>

      {products.length === 0 ? (
        <p className="no-products">
          No product added
        </p>
      ) : (
        <div className="my-products-grid">

          {products.map((product) => (
            <div className="my-product-card" key={product._id}>

              {product.images?.length > 0 && (
                <img
                  className="my-product-image"
                  src={product.images[0]}
                  alt={product.title}
                />
              )}

              <div className="my-product-info">

                <h3>
                  {product.title}
                </h3>

                <p className="product-price">
                  ₹{product.price}
                </p>

                <p>
                  {product.description}
                </p>

                <p className="product-category">
                  Category: {product.category}
                </p>

                <div className="product-actions">

                  <Link
                    to={`/products/edit/${product._id}`}
                    className="edit-button"
                  >
                    Edit
                  </Link>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyProducts;