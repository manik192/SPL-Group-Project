import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav>
      <Link to="/" className="nav-brand">
        <h2>Indian Spice Hub</h2>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/checkout">Checkout</Link>
        <Link to="/login" className="nav-login-btn">
          Login
        </Link>
      </div>
    </nav>
  );
}
