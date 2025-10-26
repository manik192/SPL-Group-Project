import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages (we’ll create them soon)
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import OrderSuccess from "./pages/OrderSuccess";

// Components
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
