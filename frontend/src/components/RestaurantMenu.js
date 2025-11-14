import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './menu.css';

export default function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stores specific quantities: { "Chicken Biryani": 2, "Naan": 1 }
  const [cartItems, setCartItems] = useState({});
  
  // Global totals for the bottom sticky bar
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Fetch Restaurant Details
            const resRest = await axios.get(`http://localhost:8080/restaurants/${id}`);
            setR(resRest.data);

            // 2. Fetch Current Cart (to sync quantities on load)
            const resCart = await axios.get('http://localhost:8080/retrivetocart');
            
            // Calculate initial state from fetched cart
            const itemsMap = {};
            let totalC = 0;
            let totalP = 0;
            
            // The backend returns array: [{name: "...", quantity: 2, price: ...}, ...]
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

  // Handle Increment (+1) or Decrement (-1)
  const handleUpdateCart = async (item, delta) => {
    const currentQty = cartItems[item.name] || 0;
    const newQty = currentQty + delta;
    const price = Number(item.price ?? 0);

    // 1. Optimistic UI Update (Make it feel instant)
    setCartItems(prev => {
        const copy = { ...prev };
        if (newQty <= 0) delete copy[item.name]; // Remove key if 0
        else copy[item.name] = newQty; // Update key
        return copy;
    });
    setCartCount(prev => prev + delta);
    setCartTotal(prev => prev + (delta * price));

    try {
        // 2. Send Request to Backend
        if (newQty === 0 && delta === -1) {
            // Special Case: Quantity hit 0, so DELETE the item
            await axios.post('http://localhost:8080/deletefromcart', { 
                name: item.name 
            });
        } else {
            // Normal Case: Increment or Decrement using the upsert logic
            // Note: We send Quantity: 1 or -1. The backend $inc handles the math.
            await axios.post('http://localhost:8080/addtocart', {
                Image: item.image || '',
                Name: item.name,
                Price: price,
                Quantity: delta // +1 or -1
            });
        }
    } catch (e) {
        console.error("Cart update failed:", e);
        // Optionally revert state here if needed
        alert('Failed to update cart');
    }
  };

  const proceedToCart = () => navigate('/Cart');

  if (loading) return <div className="container py-5">Loading…</div>;
  if (!r) return <div className="container py-5">Not found.</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef5ee 0%, #fde8d7 25%, #fdd7ba 50%, #fcc89b 75%, #fbb87d 100%)', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Header */}
        <header style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#2d2d2d' }}>
            {r.name}<span style={{ fontWeight: '400', color: '#8e8e8e' }}> Menu</span>
          </h2>
          <div style={{ fontSize: '0.875rem', color: '#8e8e8e' }}>
            {r.address || 'Location'} {r.phone && <span style={{ padding: '0 8px' }}>•</span>} {r.phone}
          </div>
        </header>

        {(!r.menu || r.menu.length === 0) ? (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', color: '#8e8e8e', textAlign: 'center' }}>
            No items yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {r.menu.map((it, idx) => {
              const qty = cartItems[it.name] || 0; // Get quantity for this specific item

              return (
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
                  {/* Item Image */}
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

                  {/* Item Details */}
                  <div style={{ flex: 1 }}>
                    <h6 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '8px', color: '#2d2d2d' }}>
                      {it.name}
                    </h6>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: it.type === 'non-veg' ? '#ef4444' : '#16a34a', fontSize: '0.875rem' }}>●</span>
                      <span style={{ color: '#2d2d2d', fontWeight: '600', fontSize: '1.125rem' }}>
                        ${Number(it.price ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '4px 0 0' }}>
                        {it.description}
                    </p>
                  </div>

                  {/* Add / Increment Logic */}
                  {qty === 0 ? (
                    // Case 1: Item NOT in cart -> Show "ADD" button
                    <button
                      style={{
                        background: 'white',
                        color: '#ea580c',
                        border: '1px solid #ea580c',
                        padding: '8px 24px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        minWidth: '100px'
                      }}
                      onMouseEnter={(e) => {
                         e.currentTarget.style.background = '#fff7ed'; 
                         e.currentTarget.style.boxShadow = '0 2px 4px rgba(234, 88, 12, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                         e.currentTarget.style.background = 'white';
                         e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => handleUpdateCart(it, 1)}
                    >
                      ADD
                    </button>
                  ) : (
                    // Case 2: Item IS in cart -> Show Counter Control
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#fff7ed', // light orange bg
                        border: '1px solid #ea580c',
                        borderRadius: '8px',
                        overflow: 'hidden'
                    }}>
                        {/* Decrement Button */}
                        <button
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ea580c',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                lineHeight: '1'
                            }}
                            onClick={() => handleUpdateCart(it, -1)}
                        >
                            −
                        </button>

                        {/* Count Display */}
                        <span style={{
                            color: '#ea580c',
                            fontWeight: '600',
                            fontSize: '1rem',
                            minWidth: '24px',
                            textAlign: 'center'
                        }}>
                            {qty}
                        </span>

                        {/* Increment Button */}
                        <button
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#ea580c',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                lineHeight: '1'
                            }}
                            onClick={() => handleUpdateCart(it, 1)}
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

        {/* Sticky proceed bar (Only shows if cart has items) */}
        {cartCount > 0 && (
            <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '900px',
            width: 'calc(100% - 48px)',
            background: '#2d2d2d', // Dark bar like Swiggy/Zomato
            color: 'white',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            zIndex: 1000
            }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#d1d5db', fontWeight: '500' }}>
                    {cartCount} ITEM{cartCount !== 1 ? 'S' : ''}
                </span>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    ${cartTotal.toFixed(2)}
                </span>
            </div>
            <button
                style={{
                marginLeft: 'auto',
                background: '#ea580c',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                }}
                onClick={proceedToCart}
            >
                View Cart →
            </button>
            </div>
        )}
      </div>
    </div>
  );
}