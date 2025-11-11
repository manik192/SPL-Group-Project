import React, { Component } from 'react';
import axios from 'axios';

export default class Orderitem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/getmenu")
            .then((response) => {
                this.setState({ items: response.data });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    handleAddToCart = (item) => {
        axios.post("http://localhost:8080/addtocart", { ...item, Quantity: 1 })
            .then(() => alert("Item Added Successfully"))
            .catch((err) => console.error(err));
    };

    render() {
        return (
            <div className="py-4">
                {/* Heading section */}
                <div className="row mb-4 mt-2">
                    <div className="col text-center">
                        <h3 className="fw-bold text">Explore the Indian Spice Hub Menu</h3>
                        <hr className="w-25 mx-auto" />
                    </div>
                </div>
    
                {/* item Cards Grid */}
                <div className="container">
                    <div className="row g-4 justify-content-center">
                        {this.state.items.map((item, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={item.Image}
                                        className="card-img-top"
                                        alt={item.name}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className="card-title mb-0">{item.name}</h5>
                                            <div
                                                style={{
                                                    height: "14px",
                                                    width: "14px",
                                                    borderRadius: "50%",
                                                    backgroundColor: item.type === "veg" ? "green" : "red",
                                                }}
                                                title={item.Type}
                                            ></div>
                                        </div>
                                        <h6 className="text-success">${item.price}</h6>
                                        <p className="card-text">{item.description}</p>
                                        <p className="mb-1"><strong>Ingredients:</strong> {item.ingredients.join(', ')}</p>
                                        <p><strong>Toppings:</strong> {item.topping.join(', ')}</p>
                                    </div>
                                    <div className="card-footer bg-white border-0">
                                        <button
                                            className="btn btn-success w-100"
                                            onClick={() => this.handleAddToCart(item)}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
}
