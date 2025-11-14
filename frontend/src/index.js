import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import Tailwind/global CSS once at the top-level entry
import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
