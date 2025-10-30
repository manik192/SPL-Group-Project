import React from 'react';
import restaurants from '../data/restaurants.jsx';
import RestaurantCard from './RestaurantCard';

const Homes = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Discover Amazing <span className="text-orange-600">Indian Restaurants</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore authentic flavors from the best Indian restaurants in your area
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map(restaurant => (
                        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Homes;