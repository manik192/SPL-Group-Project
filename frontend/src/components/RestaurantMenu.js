// frontend/src/components/RestaurantMenu.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './menu.css';

export default function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const proceedToCart = () => navigate('/Cart');

  if (loading) return <div className="container py-5">Loading…</div>;
  if (!r) return <div className="container py-5">Not found.</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <header style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#2d2d2d' }}>
            {r.name}<span style={{ fontWeight: '400', color: '#8e8e8e' }}>Menu</span>
          </h2>
          <div style={{ fontSize: '0.875rem', color: '#8e8e8e' }}>
            {r.address || 'concord'} {r.phone && <span style={{ padding: '0 8px' }}>•</span>} {r.phone || '12'}
          </div>
        </header>

        {(!r.menu || r.menu.length === 0) ? (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', color: '#8e8e8e', textAlign: 'center' }}>
            No items yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {r.menu.map((it, idx) => (
              <div 
                key={`${it.name}-${idx}`}
                style={{
                  background: 'white',
                  borderBottom: idx < r.menu.length - 1 ? '1px solid #f0f0f0' : 'none',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      flexShrink: 0
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h6 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '8px', color: '#2d2d2d' }}>
                    {it.name}
                  </h6>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#ea580c', fontSize: '0.875rem' }}>●</span>
                    <span style={{ color: '#2d2d2d', fontWeight: '600', fontSize: '1.125rem' }}>
                      ${Number(it.price ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  style={{
                    background: 'white',
                    color: '#ea580c',
                    border: '2px solid #ea580c',
                    padding: '10px 32px',
                    borderRadius: '24px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ea580c';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#ea580c';
                  }}
                  onClick={() => addToCart(it)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Sticky proceed bar */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '900px',
          width: 'calc(100% - 48px)',
          background: 'white',
          boxShadow: '0 -2px 20px rgba(0,0,0,0.1)',
          borderRadius: '16px',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontWeight: '600' }}>
            <span style={{ color: '#2d2d2d', fontSize: '1rem' }}>
              {cartCount} item{cartCount !== 1 ? 's' : ''}
            </span>
            <span style={{ color: '#ea580c', fontWeight: '700', fontSize: '1.25rem' }}>
              ${cartTotal.toFixed(2)}
            </span>
          </div>
          <button
            style={{
              marginLeft: 'auto',
              background: cartCount === 0 ? '#d1d5db' : '#ea580c',
              color: 'white',
              border: 'none',
              padding: '14px 40px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: cartCount === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              minWidth: '200px'
            }}
            disabled={cartCount === 0}
            onMouseEnter={(e) => {
              if (cartCount > 0) {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (cartCount > 0) {
                e.currentTarget.style.background = '#ea580c';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
            onClick={proceedToCart}
          >
            Proceed to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

