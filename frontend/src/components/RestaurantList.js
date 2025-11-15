import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/restaurants')
      .then(res => {
        setRestaurants(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fff7ed, #fed7aa)', padding: '32px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Discover Amazing <span style={{ color: '#ea580c' }}>Indian Restaurants</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            Explore authentic flavors from the best Indian restaurants in your area
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {restaurants.map((restaurant, idx) => {
            const rid = restaurant._id || restaurant.id || restaurant.ID;
            return (
              <div 
                key={rid || idx} 
                style={{ 
                  background: 'white', 
                  borderRadius: '12px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                  padding: '20px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: 'linear-gradient(135deg, #f97316, #ea580c)', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    🍽️
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', color: '#f59e0b' }}>⭐ 4.5</span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                      {restaurant.name || 'Restaurant'}
                    </h3>
                  </div>
                </div>

                {restaurant.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6b7280', fontSize: '0.875rem' }}>
                    <span>📍</span>
                    <span>{restaurant.address}</span>
                  </div>
                )}

                {restaurant.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#6b7280', fontSize: '0.875rem' }}>
                    <span>📞</span>
                    <span>{restaurant.phone}</span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🕒</span>
                    <span>30-45 min</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🚚</span>
                    <span>Delivery fees apply</span>
                  </span>
                </div>

                <Link 
                  to={`/restaurants/${rid}`}
                  style={{ 
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    background: '#ea580c',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#ea580c'}
                >
                  View Menu
                </Link>
              </div>
            );
          })}
        </div>

        {restaurants.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🍽️</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>No restaurants available yet</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Check back soon for amazing Indian restaurants!</p>
            <Link 
              to="/Register" 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ea580c',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'background 0.2s'
              }}
            >
              <span>🏪</span>
              <span>Register Your Restaurant</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
