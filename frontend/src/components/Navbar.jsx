import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

const Navbar = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get("http://localhost:8080/logout")
            .then(() => {
                logout();
                navigate("/");
            })
            .catch(err => console.error(err));
    };

    const handleNavigate = (path) => navigate(path);

    return (
        <nav className="bg-orange-50 shadow-lg border-b border-orange-200 px-4 py-3">
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => handleNavigate("/")} 
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
                >
                    <img 
                        src="/Logo.png" 
                        alt="Indian Spice Hub Logo" 
                        className="h-8 md:h-10 w-auto object-contain" 
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <span className="text-lg md:text-xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
                        Indian Spice Hub
                    </span>
                </button>
                
                <div className="hidden md:flex items-center space-x-6">
                    {isLoggedIn && (
                        <>
                            <button 
                                className="text-gray-700 hover:text-orange-600 font-medium transition-colors" 
                                onClick={() => handleNavigate("/OrderPizza")}
                            >
                                Menu
                            </button>
                            <button 
                                className="text-gray-700 hover:text-orange-600 font-medium transition-colors" 
                                onClick={() => handleNavigate("/BuildUrPizza")}
                            >
                                Build Your Meal
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-3">
                    {isLoggedIn ? (
                        <>
                            <button 
                                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105" 
                                onClick={() => handleNavigate("/Cart")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                </svg>
                                <span>Cart</span>
                            </button>
                            <button 
                                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300" 
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-all duration-300" 
                                onClick={() => handleNavigate("/Login")}
                            >
                                Login
                            </button>
                            <button 
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105" 
                                onClick={() => handleNavigate("/Register")}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;