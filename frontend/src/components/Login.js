import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

export default function Login(props) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/login', form);
      const { role, name } = res.data;

      // Save session
      localStorage.setItem('ish_name', name);
      localStorage.setItem('ish_role', role);
      if (login) login();

      // Redirect based on role
      if (role === 'restaurant') {
        window.location.href = '/restaurant/dashboard';
      } else {
        window.location.href = '/restaurants';
      }
    } catch (err) {
      console.error(err);
      alert('Invalid name or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container py-5 d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '90vh' }}
    >
      <div
        className="card shadow p-4"
        style={{ width: '100%', maxWidth: 420, borderRadius: '16px' }}
      >
        <h3 className="mb-3 text-center text-success fw-bold">Login</h3>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={onChange}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            className="btn btn-success w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
