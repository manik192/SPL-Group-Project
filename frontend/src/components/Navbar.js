import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';
import logo from '../images/pizza_ordering_platform.png';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const Navbar = (props) => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleLogout = () => {
    axios.get('http://localhost:8080/logout')
      .then(() => {
        logout();
        props.history.push('/Homes'); // go to Order Here page after logout
      })
      .catch(err => console.error(err));
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light px-3"
      style={{
        background: '#e8f5e9',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #dfece6',
        position: 'relative'
      }}
    >
      {/* Left: logo -> Order Here */}
      <Link
        className="navbar-brand d-flex align-items-center"
        to="/Homes"
        style={{ position: 'absolute', left: '1rem' }}
      >
        <img src={logo} alt="Logo" height="40" className="d-inline-block align-top me-2" />
        <span className="fw-bold fs-5 text-success">Indian Spice Hub</span>
      </Link>

      {/* Center: nav links */}
      <div className="d-flex justify-content-center w-100">
        <ul className="navbar-nav d-flex flex-row gap-4 mb-0">
          {isLoggedIn && (
            <>
              <li className="nav-item">
                {/* Menu should go to restaurant list */}
                <Link className="nav-link text-dark fw-semibold" to="/restaurants">
                  Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark fw-semibold" to="/BuildYourMeal">
                  Build Your Meal
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Right: cart + auth */}
      <div
        className="d-flex align-items-center gap-2"
        style={{ position: 'absolute', right: '1rem' }}
      >
        {isLoggedIn ? (
          <>
            <Link className="btn btn-success d-flex align-items-center" to="/Cart">
              {/* Fixed Bootstrap cart icon path */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="me-2"
                aria-hidden="true"
              >
                <path d="M0 1.5A.5.5 0 0 1 .5 1h1.11a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5ZM3.102 4l1.313 7h8.17l1.313-7H3.102ZM5 12.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"/>
              </svg>
              Cart
            </Link>
            <button className="btn btn-outline-success" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-success" to="/Login">
              Login
            </Link>
            <Link className="btn btn-outline-success" to="/Register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
