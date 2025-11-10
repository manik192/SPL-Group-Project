import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/restaurants')
      .then(res => setRestaurants(res.data || []))
      .catch(console.error);
  }, []);

return (
  <div className="container py-4">
    <h2 className="mb-4">Restaurants</h2>

    <div className="row g-3">
      {restaurants.map((r, idx) => {
        const rid = r._id || r.id || r.ID;           // <= handle any variant
        return (
          <div className="col-md-6 col-lg-4" key={rid || idx}>
            <div className="card shadow-sm h-100" style={{ minWidth: 320 }}>
              <div className="card-body">
                <h5 className="card-title mb-1" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  {r.name || '(no name)'}
                </h5>
                <div className="text-muted mb-3">{r.address}</div>
                <Link className="btn btn-success w-100" to={`/restaurants/${rid}`}>
                  View Menu
                </Link>
              </div>
            </div>
          </div>
        );
      })}
      {restaurants.length === 0 && (
        <div className="col-12">
          <div className="alert alert-secondary">No restaurants yet.</div>
        </div>
      )}
    </div>
  </div>
);
}
