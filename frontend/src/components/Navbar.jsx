import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/AuthSlice";
import "../styles/Navbar.css";

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        OLX
      </Link>

      <div className="navbar-links">

        <Link to="/" className="navbar-link">
          Home
        </Link>

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="navbar-link">
              Login
            </Link>

            <Link to="/register" className="navbar-register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="welcome-user">
              Welcome, {user?.name}
            </span>

            <Link to="/sell" className="sell-link">
              + Sell
            </Link>

            <Link to="/my-products" className="navbar-link">
              My Products
            </Link>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;