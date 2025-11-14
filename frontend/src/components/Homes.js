import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Homes = () => {
  useEffect(() => {
    // Counter animation function
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter-animation');
      counters.forEach((counter, index) => {
        const target = parseInt(counter.dataset.target);
        const numberElement = counter.querySelector('.stat-number');
        let current = 0;
        const increment = target / 50;

        setTimeout(() => {
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            if (target === 30) {
              numberElement.textContent = Math.floor(current) + 'min';
            } else {
              numberElement.textContent = Math.floor(current) + '+';
            }
          }, 50);
        }, index * 200);
      });
    };

    // Trigger initial counter animation after a delay
    setTimeout(animateCounters, 1500);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef5ee 0%, #fde8d7 25%, #fdd7ba 50%, #fcc89b 75%, #fbb87d 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Elements - Exact positions from your reference image */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div style={{ 
          position: 'absolute', 
          top: '100px', 
          left: '60px', 
          fontSize: '48px',
          transform: 'rotate(-15deg)',
          animation: 'bounce 2s infinite'
        }}>🌶️</div>
        <div style={{ 
          position: 'absolute', 
          top: '140px', 
          right: '120px', 
          fontSize: '36px',
          transform: 'rotate(25deg)',
          animation: 'pulse 3s infinite'
        }}>🥕</div>
        <div style={{ 
          position: 'absolute', 
          top: '200px', 
          right: '80px', 
          fontSize: '32px',
          transform: 'rotate(-20deg)',
          animation: 'bounce 2.5s infinite'
        }}>🍃</div>
        <div style={{ 
          position: 'absolute', 
          bottom: '120px', 
          left: '80px', 
          fontSize: '40px',
          transform: 'rotate(30deg)',
          animation: 'pulse 2.8s infinite'
        }}>⭐</div>
        <div style={{ 
          position: 'absolute', 
          bottom: '80px', 
          right: '100px', 
          fontSize: '48px',
          transform: 'rotate(-10deg)',
          animation: 'bounce 3.2s infinite'
        }}>🥘</div>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '120px', 
          fontSize: '28px',
          transform: 'rotate(45deg)',
          animation: 'pulse 2.2s infinite'
        }}>🌿</div>
        <div style={{ 
          position: 'absolute', 
          top: '300px', 
          right: '200px', 
          fontSize: '36px',
          transform: 'rotate(-25deg)',
          animation: 'bounce 2.7s infinite'
        }}>✨</div>
      </div>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        background: 'radial-gradient(circle at 36.25% 96.767%, rgba(234, 88, 12, 0.1) 0%, transparent 50%)'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center'
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#92400e',
            padding: '10px 20px',
            borderRadius: '50px',
            marginBottom: '32px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            fontSize: '14px',
            fontWeight: '600',
            border: '1px solid rgba(251, 146, 60, 0.2)'
          }}>
            <span style={{ fontSize: '18px' }}>🍽️</span>
            Authentic Indian Cuisine
          </div>

          {/* Main Heading - Exact styling from your reference */}
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 'bold',
            lineHeight: '1.1',
            marginBottom: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            <span style={{ color: '#374151' }}>Welcome to </span>
            <span style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Indian Spice Hub
            </span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto 48px auto',
            lineHeight: '1.6'
          }}>
            Experience the rich heritage of Indian cuisine delivered fresh to your doorstep. From 
            aromatic curries to tandoori delights, every dish tells a story of tradition and passion.
          </p>

          {/* Stats - Exact layout from your reference */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '80px',
            marginBottom: '48px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }} className="counter-animation" data-target="50">
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ea580c',
                marginBottom: '4px'
              }} className="stat-number">50+</div>
              <div style={{
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '500'
              }} className="stat-label">Menu Items</div>
            </div>
          </div>

          {/* Buttons - Exact styling from your reference */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <Link
              to="/Register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: '#ea580c',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '16px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#dc2626';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#ea580c';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <span style={{ fontSize: '18px' }}>🚀</span>
              Get Started
            </Link>
            <Link
              to="/restaurants"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'white',
                color: '#ea580c',
                border: '2px solid #ea580c',
                padding: '14px 30px',
                borderRadius: '12px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: '16px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <span style={{ fontSize: '18px' }}>👀</span>
              Explore Restaurants
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homes;