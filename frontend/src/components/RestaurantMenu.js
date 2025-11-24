import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './menu.css';

export default function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");   // 🔍 Menu search bar

  // Stores specific quantities
  const [cartItems, setCartItems] = useState({});
  
  // Global totals
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Logged-in user info
  const loggedInUserName = localStorage.getItem("ish_name") || "Guest";
  const loggedInUserEmail = localStorage.getItem("ish_email") || "";

  useEffect(() => {
    const fetchData = async () => {
        try {
            const resRest = await axios.get(`http://localhost:8080/restaurants/${id}`);
            setR(resRest.data);

            const resCart = await axios.get(`http://localhost:8080/retrivetocart?user_name=${loggedInUserName}`);
            
            const itemsMap = {};
            let totalC = 0;
            let totalP = 0;
            
            if (Array.isArray(resCart.data)) {
                resCart.data.forEach(item => {
                    itemsMap[item.name] = item.quantity;
                    totalC += item.quantity;
                    totalP += (item.price * item.quantity);
                });
            }
            
            setCartItems(itemsMap);
            setCartCount(totalC);
            setCartTotal(totalP);

        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [id]);

  // Handle Increment or Decrement
  const handleUpdateCart = async (item, delta) => {
    const currentQty = cartItems[item.name] || 0;
    const newQty = currentQty + delta;
    const price = Number(item.price ?? 0);

    setCartItems(prev => {
        const copy = { ...prev };
        if (newQty <= 0) delete copy[item.name];
        else copy[item.name] = newQty;
        return copy;
    });

    setCartCount(prev => prev + delta);
    setCartTotal(prev => prev + (delta * price));

    try {
        if (newQty === 0 && delta === -1) {
            await axios.post('http://localhost:8080/deletefromcart', { 
                name: item.name,
                ownerName: r.ownerName,
                restaurantName: r.name,
                user_name: loggedInUserName
            });
        } else {
            await axios.post('http://localhost:8080/addtocart', {
                Image: item.image || '',
                Name: item.name,
                Price: price,
                Quantity: delta,
                ownerName: r.ownerName,
                restaurantName: r.name,
                user_name: loggedInUserName,
                email: loggedInUserEmail
            });
        }
    } catch (e) {
        console.error("Cart update failed:", e);
        alert('Failed to update cart');
    }
  };

  const proceedToCart = () => navigate('/Cart');

  if (loading) return <div className="container py-5">Loading…</div>;
  if (!r) return <div className="container py-5">Not found.</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef5ee 0%, #fde8d7 25%, #fdd7ba 50%, #fcc89b 75%, #fbb87d 100%)', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        
<header style={{ marginBottom: '40px' }}>

  {/* Back button */}
  <button
    onClick={() => navigate(-1)}
    style={{
      background: 'white',
      border: '1px solid #ea580c',
      color: '#ea580c',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      marginBottom: '16px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    }}
  >
    ← Back
  </button>

  {/* Title */}
  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#2d2d2d' }}>
    {r.name}<span style={{ fontWeight: '400', color: '#8e8e8e' }}> Menu</span>
  </h2>

  <div style={{ fontSize: '0.875rem', color: '#8e8e8e' }}>
    {r.address || 'Location'} {r.phone && <span style={{ padding: '0 8px' }}>•</span>} {r.phone}
  </div>

</header>

        {/* 🔍 Menu Search Bar */}
        <input
          type="text"
          placeholder="Search menu items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            marginBottom: '24px',
            outline: 'none',
            fontSize: '1rem',
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        />

        {/* Menu List */}
        {(!r.menu || r.menu.length === 0) ? (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', color: '#8e8e8e', textAlign: 'center' }}>
            No items yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            
            {r.menu
              .filter(it =>
                it.name?.toLowerCase().includes(search.toLowerCase()) ||
                it.description?.toLowerCase().includes(search.toLowerCase())
              )
              .map((it, idx) => {
                const qty = cartItems[it.name] || 0;

                return (
                  <div 
                    key={`${it.name}-${idx}`}
                    style={{
                      background: 'white',
                      borderBottom: idx < r.menu.length - 1 ? '1px solid #f0f0f0' : 'none',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px'
                    }}
                  >

                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.name}
                        style={{
                          width: '90px',
                          height: '90px',
                          objectFit: 'cover',
                          borderRadius: '12px'
                        }}
                      />
                    )}

                    <div style={{ flex: 1 }}>
                      <h6 style={{ fontSize: '1.15rem', fontWeight: '500', marginBottom: '8px', color: '#2d2d2d' }}>
                        {it.name}
                      </h6>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: it.type === 'non-veg' ? '#ef4444' : '#16a34a', fontSize: '0.875rem' }}>●</span>
                        <span style={{ color: '#2d2d2d', fontWeight: '700', fontSize: '1.125rem' }}>
                          ${Number(it.price ?? 0).toFixed(2)}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '4px' }}>
                        {it.description}
                      </p>
                    </div>

                    {/* Add / Remove Buttons */}
                    {qty === 0 ? (
                      <button
                        onClick={() => handleUpdateCart(it, 1)}
                        style={{
                          background: 'white',
                          border: '1px solid #ea580c',
                          color: '#ea580c',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ADD
                      </button>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#fff7ed',
                        border: '1px solid #ea580c',
                        borderRadius: '8px'
                      }}>
                        <button
                          onClick={() => handleUpdateCart(it, -1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ea580c',
                            padding: '6px 12px',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                          }}
                        >
                          −
                        </button>
                        <span style={{
                          color: '#ea580c',
                          fontWeight: '600',
                          fontSize: '1rem',
                          minWidth: '24px',
                          textAlign: 'center'
                        }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => handleUpdateCart(it, 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ea580c',
                            padding: '6px 12px',
                            fontSize: '1.2rem',
                            cursor: 'pointer'
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {/* Sticky Proceed Bar */}
        {cartCount > 0 && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '900px',
            width: 'calc(100% - 48px)',
            background: '#2d2d2d',
            color: 'white',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            zIndex: 1000
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
                {cartCount} ITEM{cartCount !== 1 ? 'S' : ''}
              </span>
              <br />
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={proceedToCart}
              style={{
                marginLeft: 'auto',
                background: '#ea580c',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              View Cart →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
