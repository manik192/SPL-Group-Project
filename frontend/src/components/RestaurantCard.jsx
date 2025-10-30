import React from "react";

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
      <div className="relative">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-semibold text-gray-800">{restaurant.rating}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 mb-3 flex items-center space-x-2">
          <span>({restaurant.reviews})</span>
          <span>•</span>
          <span>{restaurant.distance}</span>
          <span>•</span>
          <span>{restaurant.time}</span>
        </p>
        <p className="text-orange-600 font-semibold bg-orange-50 px-3 py-2 rounded-lg inline-block">
          {restaurant.price}
        </p>
      </div>
    </div>
  );
};

export default RestaurantCard;
