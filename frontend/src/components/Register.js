import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    mob: "",
    email: "",
    password: "",
    role: "user", // "user" | "restaurant"
    restaurant: {
      name: "",
      phone: "",
      address: "",
      logo: "",
      menu: [],
    },
  });

  const [menuItem, setMenuItem] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    type: "veg",
  });

  const [formState, setFormState] = useState({
    isLoading: false,
    error: "",
    success: false,
  });

  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormState((prev) => ({ ...prev, error: "" }));
  };

  const onRestaurantChange = (e) => {
    setForm((prev) => ({
      ...prev,
      restaurant: { ...prev.restaurant, [e.target.name]: e.target.value },
    }));
    setFormState((prev) => ({ ...prev, error: "" }));
  };

  const addMenuItem = () => {
    if (!menuItem.name) {
      setFormState((prev) => ({ ...prev, error: "Menu item name is required" }));
      return;
    }
    const priceNum = parseFloat(menuItem.price);
    if (Number.isNaN(priceNum)) {
      setFormState((prev) => ({
        ...prev,
        error: "Enter a valid price for menu item",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      restaurant: {
        ...prev.restaurant,
        menu: [...prev.restaurant.menu, { ...menuItem, price: priceNum }],
      },
    }));

    setMenuItem({
      name: "",
      price: "",
      description: "",
      image: "",
      type: "veg",
    });
    setFormState((prev) => ({ ...prev, error: "" }));
  };

  const removeMenuItem = (idx) => {
    setForm((prev) => ({
      ...prev,
      restaurant: {
        ...prev.restaurant,
        menu: prev.restaurant.menu.filter((_, i) => i !== idx),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ isLoading: true, error: "", success: false });

    try {
      let payload = { ...form };
      if (form.role !== "restaurant") {
        const { restaurant, ...rest } = payload;
        payload = rest;
      } else {
        if (!form.restaurant.name) {
          setFormState({
            isLoading: false,
            error: "Restaurant name is required",
            success: false,
          });
          return;
        }
      }
      await axios.post("http://localhost:8080/registeruser", payload);
      setFormState({ isLoading: false, error: "", success: true });

      setTimeout(() => {
        navigate("/Login");
      }, 2000);
    } catch (err) {
      const msg = err?.response?.data?.error || "Registration failed";
      setFormState({ isLoading: false, error: msg, success: false });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef5ee 0%, #fde8d7 25%, #fdd7ba 50%, #fcc89b 75%, #fbb87d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          padding: '40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              background: 'rgba(254, 237, 220, 0.8)',
              borderRadius: '50%',
              marginBottom: '16px'
            }}>
              <span style={{ fontSize: '28px' }}>🌟</span>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '8px'
            }}>Join Indian Spice Hub</h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Create your account and start your culinary adventure</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {formState.error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                <span>⚠️</span>
                <span>{formState.error}</span>
              </div>
            )}
            {formState.success && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#16a34a',
                fontSize: '14px'
              }}>
                <span>✅</span>
                <span>Registration successful! Redirecting to login...</span>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>Username</label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <span style={{ fontSize: '16px' }}>👤</span>
                  </div>
                  <input
                    type="text"
                    name="name"
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      outline: 'none',
                      background: '#f9fafb'
                    }}
                    placeholder="Choose a username"
                    value={form.name}
                    onChange={onChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.background = '#f9fafb';
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <span style={{ fontSize: '16px' }}>📧</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      outline: 'none',
                      background: '#f9fafb'
                    }}
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={onChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.background = '#f9fafb';
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <span style={{ fontSize: '16px' }}>📱</span>
                  </div>
                  <input
                    type="tel"
                    name="mob"
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      outline: 'none',
                      background: '#f9fafb'
                    }}
                    placeholder="Enter mobile number"
                    value={form.mob}
                    onChange={onChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.background = '#f9fafb';
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '12px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}>
                    <span style={{ fontSize: '16px' }}>🔒</span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      outline: 'none',
                      background: '#f9fafb'
                    }}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={onChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#ea580c';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.background = '#f9fafb';
                    }}
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>Register as</label>
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  outline: 'none',
                  background: '#f9fafb',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ea580c';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#f9fafb';
                }}
              >
                <option value="user">User (Customer)</option>
                <option value="restaurant">Restaurant (Owner)</option>
              </select>
            </div>
            {/* Restaurant details + menu builder for 'restaurant' role */}
            {form.role === "restaurant" && (
              <>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  marginTop: '24px',
                  background: '#fafafa'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    color: '#1f2937'
                  }}>Restaurant Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>Restaurant Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.restaurant.name}
                        onChange={onRestaurantChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s',
                          outline: 'none',
                          background: 'white'
                        }}
                        placeholder="Restaurant Name"
                        onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={form.restaurant.phone}
                        onChange={onRestaurantChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s',
                          outline: 'none',
                          background: 'white'
                        }}
                        placeholder="Phone Number"
                        onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={form.restaurant.address}
                        onChange={onRestaurantChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s',
                          outline: 'none',
                          background: 'white'
                        }}
                        placeholder="Address"
                        onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>Logo URL</label>
                      <input
                        type="text"
                        name="logo"
                        value={form.restaurant.logo}
                        onChange={onRestaurantChange}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          transition: 'all 0.2s',
                          outline: 'none',
                          background: 'white'
                        }}
                        placeholder="Logo URL"
                        onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>
                </div>
                {/* Menu builder */}
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  marginTop: '24px',
                  background: '#fafafa'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    color: '#1f2937'
                  }}>Menu Builder</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', alignItems: 'end' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>Item Name</label>
                      <input
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white'
                        }}
                        value={menuItem.name}
                        onChange={e => setMenuItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Paneer Butter Masala"
                        onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>Price</label>
                      <input
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white'
                        }}
                        value={menuItem.price}
                        onChange={e => setMenuItem(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="10.99"
                        onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>Type</label>
                      <select
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white',
                          cursor: 'pointer'
                        }}
                        value={menuItem.type}
                        onChange={e => setMenuItem(prev => ({ ...prev, type: e.target.value }))}
                        onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      >
                        <option value="veg">Veg</option>
                        <option value="non-veg">Non-Veg</option>
                      </select>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>Image URL</label>
                      <input
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white'
                        }}
                        value={menuItem.image}
                        onChange={e => setMenuItem(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="https://..."
                        onFocus={(e) => e.target.style.borderColor = '#ea580c'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        style={{
                          width: '100%',
                          background: '#16a34a',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '14px',
                          transition: 'background 0.2s'
                        }}
                        onClick={addMenuItem}
                        onMouseOver={(e) => e.currentTarget.style.background = '#15803d'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#16a34a'}
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                  {/* Menu list */}
                  {form.restaurant.menu.length > 0 && (
                    <ul style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {form.restaurant.menu.map((item, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '12px',
                          background: 'white'
                        }}>
                          <div>
                            <b>{item.name}</b>{" "}
                            <span style={{ color: '#16a34a' }}>${item.price.toFixed(2)}</span>{" "}
                            <span style={{
                              background: '#e5e7eb',
                              color: '#374151',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>{item.type}</span>
                          </div>
                          <button
                            type="button"
                            style={{
                              color: '#dc2626',
                              fontWeight: '600',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                            onClick={() => removeMenuItem(idx)}
                            onMouseOver={(e) => e.currentTarget.style.color = '#991b1b'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#dc2626'}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.2s',
                border: 'none',
                cursor: formState.isLoading || formState.success ? 'not-allowed' : 'pointer',
                background: formState.isLoading || formState.success ? '#9ca3af' : '#ea580c',
                color: 'white',
                boxShadow: '0 2px 4px rgba(234, 88, 12, 0.2)'
              }}
              disabled={formState.isLoading || formState.success}
              onMouseOver={(e) => {
                if (!formState.isLoading && !formState.success) {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(234, 88, 12, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (!formState.isLoading && !formState.success) {
                  e.currentTarget.style.background = '#ea580c';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(234, 88, 12, 0.2)';
                }
              }}
            >
              {formState.isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Creating Account...</span>
                </>
              ) : formState.success ? (
                <>
                  <span>✅</span>
                  <span>Account Created!</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
              Already have an account?{' '}
              <Link to="/Login" style={{
                color: '#ea580c',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Sign in here
              </Link>
            </p>
            <Link to="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#9ca3af',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#6b7280'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;