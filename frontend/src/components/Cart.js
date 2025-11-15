import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css'; 

export default function Cart() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    // Fetch Cart Data
    useEffect(() => {
    const userName = localStorage.getItem("ish_name"); // or wherever you store it
    if (!userName) return; // optional: redirect if not logged in

    axios.get(`http://localhost:8080/retrivetocart?user_name=${userName}`)
        .then((response) => setCart(response.data || []))
        .catch((err) => console.log(err));
}, []);


    // Handle Delete (API Call)
    const handleRemove = (itemToRemove) => {
        axios.post("http://localhost:8080/deletefromcart", itemToRemove)
            .then(() => {
                setCart(prevCart => prevCart.filter(item => 
                    item.Name !== itemToRemove.Name || 
                    item.user_name !== itemToRemove.user_name || 
                    item.restaurantName !== itemToRemove.restaurantName
                ));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Handle Increment (+) and Decrement (-)
    const handleQuantityChange = (item, delta) => {
        const newQty = item.Quantity + delta;

        if (newQty <= 0) {
            handleRemove(item);
            return;
        }

        // Optimistic UI Update
        setCart(prevCart => prevCart.map(i => 
            i.Name === item.Name && i.user_name === item.user_name && i.restaurantName === item.restaurantName
                ? { ...i, Quantity: newQty } 
                : i
        ));

        // Send Update to Backend
        axios.post('http://localhost:8080/addtocart', {
            Image: item.Image || '',
            Name: item.Name,
            Price: Number(item.Price),
            Quantity: delta,
            ownerName: item.ownerName,
            restaurantName: item.restaurantName,
            user_name: item.user_name,
            email: item.email,
            mob: item.mob || ""
        }).catch(err => {
            console.error("Failed to update quantity", err);
        });
    };

    const taxRate = 0.1; 
    const deliveryFee = 5; 

    // Group cart items by restaurant
    const groupedCart = cart.reduce((acc, item) => {
        const key = item.restaurantName;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
    const groupedCartArray = Object.entries(groupedCart);

    const handleCheckout = async (itemsToCheckout) => {
    if (!itemsToCheckout || itemsToCheckout.length === 0) return;

    try {
        const userName = localStorage.getItem("ish_name"); // fetch from browser storage
        if (!userName) throw new Error("User not logged in");

        const userRes = await axios.get(`http://localhost:8080/getuser?name=${userName}`);
        const user = userRes.data;

        const subtotal = itemsToCheckout.reduce((sum, i) => sum + i.Price * i.Quantity, 0);
        const tax = subtotal * taxRate;
        const total = subtotal + tax + deliveryFee;
        const restaurantName = itemsToCheckout[0].restaurantName;
        const ownerName = itemsToCheckout[0].ownerName;

        const orderPayload = {
            restaurantName,
            ownerName,
            items: itemsToCheckout,
            subtotal,
            tax,
            deliveryFee,
            total,
            user_name: userName,
            email: user?.Email || "",
            mob: user?.Mob || "",
            Status: "Pending"
        };

        await axios.post("http://localhost:8080/createorder", orderPayload);

        setCart(prevCart => prevCart.filter(item => item.restaurantName !== restaurantName));
    } catch (err) {
        console.error("Checkout failed", err);
    }
};


    return (
        <div className="cart-page">
            <header className="cart-header">
                <div className="hero-banner">
                    <h1>My Shopping Cart</h1>
                </div>
            </header>

            <div className="cart-main-content">
                {groupedCartArray.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <h2>Your cart is empty!</h2>
                        <Link to="/restaurants" style={{textDecoration:'none', color: '#ea580c'}}>Go to Restaurants</Link>
                    </div>
                ) : (
                    groupedCartArray.map(([restaurant, items], index) => {
                        const subtotalPerGroup = items.reduce((sum, i) => sum + i.Price * i.Quantity, 0);
                        const taxPerGroup = subtotalPerGroup * taxRate;
                        const totalPerGroup = subtotalPerGroup + taxPerGroup + deliveryFee;

                        return (
                            <div key={index} className="restaurant-card" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '12px', background: '#fff' }}>
                                <h4>Restaurant: {restaurant}</h4>
                                <hr />

                                {items.map((item, idx) => (
                                    <div key={idx} className="cart-item-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            {item.Image && <img src={item.Image} alt={item.Name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                                            <div>
                                                <h5 style={{ margin: 0 }}>{item.Name}</h5>
                                                <p style={{ margin: 0, color: '#666' }}>Price: ${item.Price}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <button onClick={() => handleQuantityChange(item, -1)} style={{ padding: '4px 10px', cursor: 'pointer' }}>−</button>
                                            <span>{item.Quantity}</span>
                                            <button onClick={() => handleQuantityChange(item, 1)} style={{ padding: '4px 10px', cursor: 'pointer' }}>+</button>
                                            <span>${(item.Price * item.Quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}

                                {/* Per-Restaurant Summary Card */}
                                <div className="cart-summary" style={{ marginTop: '15px' }}>
                                    <div className="summary-card">
                                        <h2>Summary</h2>
                                        <hr />
                                        <p><strong>Subtotal: </strong>${subtotalPerGroup.toFixed(2)}</p>
                                        <p><strong>Tax (10%): </strong>${taxPerGroup.toFixed(2)}</p>
                                        <p><strong>Delivery Fee: </strong>${deliveryFee.toFixed(2)}</p>
                                        <hr />
                                        <p style={{fontSize: '1.2rem'}}><strong>Total: </strong>${totalPerGroup.toFixed(2)}</p>
                                        
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleCheckout(items)}
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
                        );
                    })
                )}
            </div>
        </div>
    );
}
