import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Password: '',
    isLoading: false,
    error: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
      error: ''
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormData(prev => ({ ...prev, isLoading: true, error: '' }));

    axios.post('http://localhost:8080/login', {
      password: formData.Password,
      name: formData.Name,
    }, {
      headers: { 'Content-Type': 'application/json' }
    }).then((res) => {
      const { role, name } = res.data;
      
      // Save session
      localStorage.setItem('ish_name', name);
      localStorage.setItem('ish_role', role);
      if (login) login();

      // Redirect based on role
      if (role === 'restaurant') {
        navigate('/restaurant/dashboard');
      } else {
        navigate('/restaurants');
      }
    }).catch((err) => {
      console.error(err);
      setFormData(prev => ({ ...prev,
        error: "Invalid username or password. Please try again.",
        isLoading: false 
      }));
    });
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
      <div style={{ width: '100%', maxWidth: '440px' }}>
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
              <span style={{ fontSize: '28px' }}>🍽️</span>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '8px'
            }}>Welcome Back!</h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Sign in to continue your culinary journey</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {formData.error && (
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
                <span>{formData.error}</span>
              </div>
            )}

            <div>
              <label htmlFor="Name" style={{
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
                  name="Name" 
                  id="Name"
                  placeholder="Enter your username" 
                  value={formData.Name} 
                  onChange={handleInputChange('Name')}
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
              <label htmlFor="Password" style={{
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
                  name="Password" 
                  id="Password"
                  placeholder="Enter your password" 
                  value={formData.Password} 
                  onChange={handleInputChange('Password')}
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
                cursor: formData.isLoading ? 'not-allowed' : 'pointer',
                background: formData.isLoading ? '#9ca3af' : '#ea580c',
                color: 'white',
                boxShadow: '0 2px 4px rgba(234, 88, 12, 0.2)'
              }}
              disabled={formData.isLoading}
              onMouseOver={(e) => {
                if (!formData.isLoading) {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(234, 88, 12, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (!formData.isLoading) {
                  e.currentTarget.style.background = '#ea580c';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(234, 88, 12, 0.2)';
                }
              }}
            >
              {formData.isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
              Don't have an account?{' '}
              <Link to="/Register" style={{
                color: '#ea580c',
                fontWeight: '600',
                textDecoration: 'none'
              }}>
                Create one here
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

export default Login;
