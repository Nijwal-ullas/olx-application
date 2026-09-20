import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import SellProducts from "./pages/SellProducts";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./components/EditProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/sell" element={<SellProducts />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
