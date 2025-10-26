import restaurants from "../data/restaurants";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h2 className="home-title">Explore Authentic Indian Restaurants</h2>
      <div className="restaurant-grid">
        {restaurants.map((r) => (
          <div key={r.id} className="restaurant-card">
            <img src={r.image} alt={r.name} />
            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <div className="restaurant-details">
                <span className="restaurant-rating">⭐ {r.rating}</span>
                <span>{r.reviews} reviews</span>
              </div>
              <div className="restaurant-details">
                <span>{r.distance}</span>
                <span>{r.time}</span>
              </div>
              <p className="restaurant-price">{r.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
