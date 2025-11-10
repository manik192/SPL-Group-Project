// frontend/src/components/RestaurantMenu.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import './menu.css';

export default function RestaurantMenu() {
  const { id } = useParams();
  const history = useHistory();
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(true);

  // lightweight client-side tally for the sticky bar
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:8080/restaurants/${id}`)
      .then(res => setR(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async (it) => {
    try {
      // Backend expects capitalized keys: Image, Name, Price, Quantity
      await axios.post('http://localhost:8080/addtocart', {
        Image: it.image || '',
        Name: it.name,
        Price: Number(it.price ?? 0),
        Quantity: 1,
      });
      setCartCount(c => c + 1);
      setCartTotal(t => t + Number(it.price ?? 0));
    } catch (e) {
      console.error(e);
      alert('Failed to add item to cart');
    }
  };

  const proceedToCart = () => history.push('/Cart');

  if (loading) return <div className="container py-5">Loading…</div>;
  if (!r) return <div className="container py-5">Not found.</div>;

  return (
    <div className="container py-5 menu-container">
      <header className="mb-4">
        <h2 className="mb-1 fw-bold">{r.name}</h2>
        <div className="text-muted small">
          {r.address || '—'} {r.phone && <span className="meta-sep">•</span>} {r.phone || null}
        </div>
      </header>

      <h4 className="section-title">Menu</h4>

      {(!r.menu || r.menu.length === 0) ? (
        <div className="alert alert-secondary mt-3">No items yet.</div>
      ) : (
        <div className="row g-4">
          {r.menu.map((it, idx) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={`${it.name}-${idx}`}>
              <div className="menu-card card shadow-sm h-100">
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.name}
                    className="card-img-top menu-img"
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h6 className="mb-2 menu-name">{it.name}</h6>
                  <div className="price-tag mb-3">${Number(it.price ?? 0).toFixed(2)}</div>
                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => addToCart(it)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky proceed bar */}
      <div className="proceed-bar">
        <div className="proceed-summary">
          <span>{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
          <span className="proceed-total">${cartTotal.toFixed(2)}</span>
        </div>
        <button
          className="btn btn-success proceed-btn"
          disabled={cartCount === 0}
          onClick={proceedToCart}
        >
          Proceed to Cart
        </button>
      </div>
    </div>
  );
}
