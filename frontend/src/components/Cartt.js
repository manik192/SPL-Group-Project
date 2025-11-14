import React from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Cartt() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const isCartCheckedOut = location?.state?.isCartCheckedOut || false;

    const handleLogout = () => {
        axios.get("http://localhost:8080/logout")
            .then(() => {
                localStorage.removeItem('ish_name');
                localStorage.removeItem('ish_role');
                if (logout) logout();
                navigate("/");
            })
            .catch(err => console.error(err));
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
        }}>
            {isCartCheckedOut ? (
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    padding: '60px 80px',
                    maxWidth: '800px',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '600',
                        color: '#ea580c',
                        marginBottom: '24px'
                    }}>
                        🍛 Your order is being freshly prepared. Sit back and relax!!
                  </h1>

                    <p style={{
                        fontSize: '1.125rem',
                        color: '#8e8e8e',
                        marginBottom: '48px'
                    }}>
                        Please relax while our chefs cook your flavorful Indian dishes with love and spices 🌶️✨
                    </p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Link 
                            to="/restaurants"
                            style={{
                                background: '#ea580c',
                                color: 'white',
                                border: 'none',
                                padding: '14px 40px',
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                textDecoration: 'none',
                                display: 'inline-block',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#dc2626';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#ea580c';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Back to Menu
                        </Link>

                        <button 
                            onClick={handleLogout}
                            style={{
                                background: 'white',
                                color: '#ea580c',
                                border: '2px solid #ea580c',
                                padding: '14px 40px',
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#ea580c';
                                e.currentTarget.style.color = 'white';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#ea580c';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    padding: '60px 80px',
                    maxWidth: '600px',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        color: '#2d2d2d',
                        marginBottom: '24px'
                    }}>
                        No items in your cart yet 🛒  
                        Explore our Indian dishes!
                    </h2>

                    <Link 
                        to="/restaurants"
                        style={{
                            background: '#ea580c',
                            color: 'white',
                            padding: '14px 40px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '1rem',
                            textDecoration: 'none',
                            display: 'inline-block',
                            transition: '0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#ea580c'}
                    >
                        Go to Menu
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Cartt;
