import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Cartt.css'; // Style file for Cartt page

export default class Cartt extends React.Component {
    handleLogout = () => {
        axios.get("http://localhost:8080/logout")
            .then(() => {
                this.props.history.push("/Homes");
            })
            .catch(err => console.error(err));
    };

    render() {
        // Access isCartCheckedOut from location.state
        const isCartCheckedOut = this.props.location?.state?.isCartCheckedOut || false;

        return (
            <div className="cartt-container">
                {isCartCheckedOut ? (
                    <div className="cartt-content">
                        <h1 className="cartt-heading">🍕 Your food is getting COOKED, sit back and relax with a glass of wine!!</h1>
                        <p className="cartt-message">Sit back and relax while your hot & tasty food makes its way to you.</p>
                        <Link to="/Menu" className="btn btn-success text cartt-back-btn">Back to Menu</Link>
                        <button onClick={this.handleLogout} className="btn btn-outline-secondary text-dark cartt-back-btn mx-2">Logout</button>
                    </div>
                ) : (
                    <div className="cartt-empty">
                        <h2>No items in cart to checkout 😕</h2>
                        <Link to="/Menu" className="btn btn-outline-secondary text-dark cartt-back-btn">Go to Menu</Link>
                    </div>
                )}
            </div>
        );
    }
}
