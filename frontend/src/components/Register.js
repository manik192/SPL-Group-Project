import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mob: '',
    password: '',
    role: 'user', // "user" | "restaurant"
    restaurant: {
      name: '',
      phone: '',
      address: '',
      logo: '',
      menu: [], // [{name, price, description, image, type}]
    },
  });

  // Temp state for the menu item being edited
  const [menuItem, setMenuItem] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    type: 'veg', // "veg" | "non-veg"
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onRestaurantChange = (e) =>
    setForm({
      ...form,
      restaurant: { ...form.restaurant, [e.target.name]: e.target.value },
    });

  const addMenuItem = () => {
    if (!menuItem.name) return alert('Menu item name is required');
    const priceNum = parseFloat(menuItem.price);
    if (Number.isNaN(priceNum)) return alert('Enter a valid price');

    setForm((prev) => ({
      ...prev,
      restaurant: {
        ...prev.restaurant,
        menu: [
          ...prev.restaurant.menu,
          { ...menuItem, price: priceNum },
        ],
      },
    }));

    // reset the editor
    setMenuItem({ name: '', price: '', description: '', image: '', type: 'veg' });
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

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Build payload: if role is user, omit restaurant; if restaurant, validate details
      let payload = { ...form };
      if (form.role !== 'restaurant') {
        // cleanly omit restaurant for users
        const { restaurant, ...rest } = payload;
        payload = rest;
      } else {
        if (!form.restaurant.name) return alert('Restaurant name is required');
        // (phone/address/logo optional)
      }

      const res = await axios.post('http://localhost:8080/registeruser', payload);
      alert(`Registered as ${res.data.role}. You can now login.`);
      window.location.href = '/Login';
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || 'Registration failed';
      alert(msg);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <h3 className="mb-3">Create Account</h3>
      <form onSubmit={onSubmit}>
        {/* Common user fields */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input className="form-control" name="name" value={form.name} onChange={onChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Mobile</label>
            <input className="form-control" name="mob" value={form.mob} onChange={onChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email (optional)</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={onChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={onChange} required />
          </div>

        </div>

        {/* Role select */}
        <div className="mt-3">
          <label className="form-label">Register as</label>
          <select className="form-select" name="role" value={form.role} onChange={onChange}>
            <option value="user">User (Customer)</option>
            <option value="restaurant">Restaurant (Owner)</option>
          </select>
        </div>

        {/* Restaurant details + menu builder (only when role=restaurant) */}
        {form.role === 'restaurant' && (
          <>
            <div className="border rounded p-3 mt-3">
              <h5 className="mb-3">Restaurant Details</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Restaurant Name *</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.restaurant.name}
                    onChange={onRestaurantChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    name="phone"
                    value={form.restaurant.phone}
                    onChange={onRestaurantChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    name="address"
                    value={form.restaurant.address}
                    onChange={onRestaurantChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Logo URL</label>
                  <input
                    className="form-control"
                    name="logo"
                    value={form.restaurant.logo}
                    onChange={onRestaurantChange}
                  />
                </div>
              </div>
            </div>

            <div className="border rounded p-3 mt-3">
              <h5 className="mb-3">Menu Builder</h5>

              {/* Menu item editor */}
              <div className="row g-2 align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Item Name</label>
                  <input
                    className="form-control"
                    value={menuItem.name}
                    onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                    placeholder="Paneer Butter Masala"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Price</label>
                  <input
                    className="form-control"
                    value={menuItem.price}
                    onChange={(e) => setMenuItem({ ...menuItem, price: e.target.value })}
                    placeholder="10.99"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={menuItem.type}
                    onChange={(e) => setMenuItem({ ...menuItem, type: e.target.value })}
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Image URL (optional)</label>
                  <input
                    className="form-control"
                    value={menuItem.image}
                    onChange={(e) => setMenuItem({ ...menuItem, image: e.target.value })}
                    placeholder="https://…"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Description (optional)</label>
                  <input
                    className="form-control"
                    value={menuItem.description}
                    onChange={(e) => setMenuItem({ ...menuItem, description: e.target.value })}
                    placeholder="Aromatic basmati rice with tender chicken…"
                  />
                </div>
                <div className="col-12">
                  <button type="button" className="btn btn-outline-success" onClick={addMenuItem}>
                    + Add Menu Item
                  </button>
                </div>
              </div>

              {/* Current menu list */}
              {(form.restaurant.menu || []).length > 0 && (
                <ul className="list-group mt-3">
                  {form.restaurant.menu.map((m, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <b>{m.name}</b> &nbsp; <span className="text-success">${m.price.toFixed(2)}</span>
                        {m.type ? <span className="ms-2 badge bg-light text-dark">{m.type}</span> : null}
                      </div>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeMenuItem(i)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        <button className="btn btn-success w-100 mt-3" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
