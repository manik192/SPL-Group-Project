import React from 'react';
export default function RestaurantDashboard() {
  const role = localStorage.getItem('ish_role');
  if (role !== 'restaurant') return <div className="container py-4">Access denied</div>;
  return (
    <div className="container py-4">
      <h3>Restaurant Dashboard</h3>
      <p>(Next step) Create/edit menu items under your restaurant.</p>
    </div>
  );
}
