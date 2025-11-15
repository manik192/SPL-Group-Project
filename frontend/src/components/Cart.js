import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css'; 

export default function Cart() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    // Fetch Cart Data
    useEffect(() => {
        axios.get("http://localhost:8080/retrivetocart")
            .then((response) => {
                setCart(response.data || []);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    // Calculate Subtotal
    const totalPrice = () => {
        return cart != null
            ? cart.reduce((total, item) => total + item.price * item.quantity, 0)
            : 0;
    };

    // Handle Delete (API Call)
    const handleRemove = (itemToRemove) => {
        axios.post("http://localhost:8080/deletefromcart", itemToRemove)
            .then(() => {
                setCart(prevCart => prevCart.filter(item => item.name !== itemToRemove.name));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // NEW: Handle Increment (+) and Decrement (-)
    const handleQuantityChange = (item, delta) => {
        const newQty = item.quantity + delta;

        // 1. If quantity goes to 0, remove the item
        if (newQty <= 0) {
            handleRemove(item);
            return;
        }

        // 2. Optimistic UI Update (Update screen immediately)
        setCart(prevCart => prevCart.map(i => 
            i.name === item.name ? { ...i, quantity: newQty } : i
        ));

        // 3. Send Update to Backend
        axios.post('http://localhost:8080/addtocart', {
            Image: item.Image || '',
            Name: item.name,
            Price: Number(item.price),
            Quantity: delta // Sends +1 or -1
        }).catch(err => {
            console.error("Failed to update quantity", err);
            // Optional: Revert state here if API fails
        });
    };

    const handleCheckout = () => {
        if(cart != null && cart.length > 0) {
            axios.post("http://localhost:8080/clearcart")
                .then(() => {
                    setCart([]);
                    navigate('/Cartt', { state: { isCartCheckedOut: true } });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const taxRate = 0.1; 
    const deliveryFee = 5; 
    const subtotal = totalPrice();
    const tax = subtotal * taxRate;
    const total = subtotal + tax + deliveryFee;

    return (
        <div className="cart-page">
            <header className="cart-header">
                <div className="hero-banner">
                    <h1>My Shopping Cart</h1>
                </div>
            </header>

            <div className="cart-main-content">
                <div className="cart-items">
                    {cart == null || cart.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '40px'}}>
                            <h2>Your cart is empty!</h2>
                            <Link to="/restaurants" style={{textDecoration:'none', color: '#ea580c'}}>Go to Restaurants</Link>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className="cart-item-card">
                                <img src={item.Image} alt={item.name} className="item-img" />
                                
                                <div className="item-details">
                                    <h5 style={{margin: '0 0 5px 0', fontSize: '1.1rem'}}>{item.name}</h5>
                                    <p style={{margin: 0, color: '#666'}}>Price: ${item.price}</p>
                                </div>

                                {/* QUANTITY CONTROLS */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        border: '1px solid #ddd', 
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}>
                                        <button 
                                            onClick={() => handleQuantityChange(item, -1)}
                                            style={{
                                                border: 'none',
                                                background: '#f8f9fa',
                                                padding: '5px 12px',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                color: '#ea580c'
                                            }}
                                        >−</button>
                                        
                                        <span style={{ 
                                            padding: '0 10px', 
                                            fontWeight: 'bold', 
                                            minWidth: '20px', 
                                            textAlign: 'center' 
                                        }}>
                                            {item.quantity}
                                        </span>
                                        
                                        <button 
                                            onClick={() => handleQuantityChange(item, 1)}
                                            style={{
                                                border: 'none',
                                                background: '#f8f9fa',
                                                padding: '5px 12px',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                color: '#ea580c'
                                            }}
                                        >+</button>
                                    </div>
                                    
                                    <div style={{fontWeight: 'bold', minWidth: '70px', textAlign: 'right'}}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-summary">
                    <div className="summary-card">
                        <h2>Summary</h2>
                        <hr />
                        <p><strong>Subtotal: </strong>${subtotal.toFixed(2)}</p>
                        <p><strong>Tax (10%): </strong>${tax.toFixed(2)}</p>
                        <p><strong>Delivery Fee: </strong>${deliveryFee.toFixed(2)}</p>
                        <hr />
                        <p style={{fontSize: '1.2rem'}}><strong>Total: </strong>${total.toFixed(2)}</p>
                        
                        <button
                            className="btn btn-success"
                            onClick={handleCheckout}
                            disabled={cart == null || cart.length === 0}
                            style={{width: '100%', marginTop: '10px'}}
                        >
                            Checkout
                        </button>
                        
                        <Link to="/restaurants">
                            <button className="btn btn-outline-secondary" style={{width: '100%', marginTop: '10px'}}>
                                Back to Menu
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}