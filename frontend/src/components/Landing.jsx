import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

        // Mouse move effect for hero
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100
            });
        };

        // Parallax scroll effect
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[class*="parallax-"]');

            parallaxElements.forEach(element => {
                const speed = element.classList.contains('parallax-slow') ? 0.2 :
                    element.classList.contains('parallax-medium') ? 0.5 : 0.8;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Trigger initial counter animation after a delay
        setTimeout(animateCounters, 1500);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
            {/* Hero Section */}
            <section
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{
                    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(234, 88, 12, 0.1) 0%, transparent 50%)`
                }}
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-20 text-4xl animate-bounce">🌶️</div>
                    <div className="absolute top-40 right-32 text-3xl animate-pulse">🍃</div>
                    <div className="absolute bottom-40 left-32 text-2xl animate-spin">⭐</div>
                    <div className="absolute top-60 left-1/2 text-3xl animate-bounce">🔥</div>
                    <div className="absolute bottom-20 right-20 text-4xl animate-pulse">🥘</div>
                    <div className="absolute top-32 right-1/4 text-2xl animate-spin">🍛</div>
                    <div className="absolute bottom-60 left-1/4 text-3xl animate-bounce">🌿</div>
                    <div className="absolute top-1/2 right-40 text-2xl animate-pulse">✨</div>
                </div>

                <div className="container mx-auto px-6 text-center z-10">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full mb-6 animate-fade-in-up">
                        <span className="text-xl animate-pulse">🍽️</span>
                        <span className="font-medium">Authentic Indian Cuisine</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up">
                        Welcome to <span className="text-orange-600 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">Indian Spice Hub</span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-up">
                        Experience the rich heritage of Indian cuisine delivered fresh to your doorstep.
                        From aromatic curries to tandoori delights, every dish tells a story of tradition and passion.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 mb-10 animate-fade-in-up">
                        <div className="text-center counter-animation" data-target="50">
                            <div className="text-3xl font-bold text-orange-600 stat-number">0+</div>
                            <div className="text-gray-600 stat-label">Menu Items</div>
                        </div>
                        <div className="text-center counter-animation" data-target="30">
                            <div className="text-3xl font-bold text-orange-600 stat-number">0</div>
                            <div className="text-gray-600 stat-label">Minutes Delivery</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up">
                        <Link
                            to="/Register"
                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <span>🚀</span>
                            <span>Get Started</span>
                        </Link>
                        <Link
                            to="/Homes"
                            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-orange-600 border-2 border-orange-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <span>👀</span>
                            <span>Explore Restaurents</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;