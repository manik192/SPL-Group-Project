import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get("http://localhost:8080/logout")
            .then(() => {
                logout();
                navigate("/");
            })
            .catch(err => console.error(err));
    };

    const handleNavigate = (path) => navigate(path);

    return (
        <nav style={{ 
            background: 'rgba(254, 247, 238, 0.95)', 
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(251, 146, 60, 0.15)',
            padding: '12px 32px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            width: '100%'
        }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%'
            }}>
                {/* Left - Logo */}
                <button 
                    onClick={() => handleNavigate("/")} 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s',
                        padding: '4px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <div style={{
                        width: '28px',
                        height: '28px',
                        background: '#ea580c',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                    }}>
                        🍽️
                    </div>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#ea580c',
                        letterSpacing: '-0.02em'
                    }}>
                        Indian Spice Hub
                    </span>
                </button>

                {/* Right - Auth Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isLoggedIn ? (
                        <>
                            <button 
                                onClick={() => handleNavigate("/Cart")}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#ea580c',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#dc2626';
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = '#ea580c';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                                Cart
                            </button>
                            <button 
                                onClick={handleLogout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#6b7280',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    transition: 'color 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#ea580c'}
                                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => handleNavigate("/Login")}
                                style={{
                                    background: 'transparent',
                                    border: '1.5px solid #ea580c',
                                    color: '#ea580c',
                                    padding: '8px 18px',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(234, 88, 12, 0.05)';
                                    e.currentTarget.style.borderColor = '#dc2626';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = '#ea580c';
                                }}
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => handleNavigate("/Register")}
                                style={{
                                    background: '#ea580c',
                                    border: 'none',
                                    color: 'white',
                                    padding: '8px 18px',
                                    borderRadius: '6px',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 2px 4px rgba(234, 88, 12, 0.2)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#dc2626';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(234, 88, 12, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = '#ea580c';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(234, 88, 12, 0.2)';
                                }}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;