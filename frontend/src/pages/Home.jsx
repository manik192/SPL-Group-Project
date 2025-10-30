import restaurants from "../data/restaurants.jsx";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-16 font-sans">
      <h2 className="text-3xl font-bold text-rose-600 mb-8 text-center">
        Explore Authentic Indian Restaurants
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {restaurants.map((r) => (
          <div 
            key={r.id} 
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            <img 
              src={r.image} 
              alt={r.name} 
              className="w-full h-44 object-cover border-b border-gray-100"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{r.name}</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="inline-flex items-center bg-rose-600 text-white text-sm font-medium px-2 py-1 rounded">
                  ⭐ {r.rating}
                </span>
                <span className="text-gray-600 text-sm">{r.reviews} reviews</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 text-sm mb-2">
                <span>{r.distance}</span>
                <span>{r.time}</span>
              </div>
              <p className="text-green-500 font-medium text-sm">{r.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
