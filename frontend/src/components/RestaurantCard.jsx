import React from "react";
import "./RestaurantCard.css";

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="card">
      <img src={restaurant.image} alt={restaurant.name} className="card-image" />
      <div className="card-content">
        <h3>{restaurant.name}</h3>
        <p className="details">
          ⭐ {restaurant.rating} ({restaurant.reviews}) • {restaurant.distance} • {restaurant.time}
        </p>
        <p className="price">{restaurant.price}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
