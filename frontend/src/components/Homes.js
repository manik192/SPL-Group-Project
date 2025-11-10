import React from 'react';
import { withRouter } from 'react-router-dom';
import IngredientsLogo from '../images/ingredients.png';
import ChefLogo from '../images/chef.png';
import TimeLogo from '../images/timer.png';
import BgImage from '../images/bg_image.jpg';

class Homes extends React.Component {
  handleOrderNow = () => {
    this.props.history.push('/restaurants'); // Navigate to restaurant list
  };

  render() {
    return (
      <div
        className="hero-section d-flex flex-column align-items-center justify-content-center text-white text-center"
        style={{
          height: '100vh',
          backgroundImage: `url(${BgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '40px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            padding: '50px 40px',
            borderRadius: '20px',
            maxWidth: '850px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}
        >
          <h1 className="display-4 fw-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Fresh. Fast. Cooked to Perfection.
          </h1>
          <p className="lead mb-4" style={{ fontSize: '1.2rem', color: '#f1f1f1' }}>
            Handcrafted Indian favorites, delivered hot and fresh. Get yours in just 30 minutes!
          </p>

          <button
            onClick={this.handleOrderNow}
            className="btn btn-success btn-lg fw-semibold px-5 py-2 rounded-pill mb-4"
          >
            Order Now
          </button>

          {/* Highlights */}
          <div className="d-flex flex-column flex-md-row justify-content-center gap-4 mt-2">
            <div className="d-flex flex-column align-items-center px-3">
              <img src={IngredientsLogo} alt="Fresh Ingredients" style={{ height: '60px' }} className="mb-2" />
              <h6 className="fw-bold text-white mb-1">Fresh Ingredients</h6>
              <p className="small text-white-50 text-center" style={{ maxWidth: '180px' }}>
                Peak-season produce and top-tier cheese—nothing but the best.
              </p>
            </div>
            <div className="d-flex flex-column align-items-center px-3">
              <img src={ChefLogo} alt="Master Chefs" style={{ height: '60px' }} className="mb-2" />
              <h6 className="fw-bold text-white mb-1">Master Chefs</h6>
              <p className="small text-white-50 text-center" style={{ maxWidth: '180px' }}>
                Trained chefs tossing dough and crafting every dish like art.
              </p>
            </div>
            <div className="d-flex flex-column align-items-center px-3">
              <img src={TimeLogo} alt="Fast Delivery" style={{ height: '60px' }} className="mb-2" />
              <h6 className="fw-bold text-white mb-1">30 Min Delivery</h6>
              <p className="small text-white-50 text-center" style={{ maxWidth: '180px' }}>
                Lightning-fast delivery — from kitchen to your doorstep in no time.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Homes);
