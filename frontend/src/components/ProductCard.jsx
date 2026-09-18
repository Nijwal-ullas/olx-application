import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.images?.length > 0 && (
        <img src={product.images[0]} alt={product.title} />
      )}  

      <h3>Title : {product.title}</h3>

      <p>Price : ₹{product.price}</p>

      <Link to={`/products/${product._id}`}>View Details</Link>
    </div>
  );
}

export default ProductCard;
