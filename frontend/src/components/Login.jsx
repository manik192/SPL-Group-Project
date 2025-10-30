import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        Name: '',
        Password: '',
        isLoading: false,
        error: ''
    });
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value,
            error: ''
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormData(prev => ({ ...prev, isLoading: true, error: '' }));

        axios.post('http://localhost:8080/login', {
            Password: formData.Password,
            Name: formData.Name,
        }, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => {
                if (res.data.data === 1) {
                    login();
                    navigate("/");
                } else {
                    setFormData(prev => ({ 
                        ...prev,
                        error: "Invalid username or password. Please try again.",
                        isLoading: false 
                    }));
                }
            })
            .catch((err) => {
                console.log(err);
                setFormData(prev => ({ 
                    ...prev,
                    error: "Login failed. Please check your credentials and try again.",
                    isLoading: false 
                }));
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                            <span className="text-2xl">🍽️</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                        <p className="text-gray-600">Sign in to continue your culinary journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {formData.error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
                                <span>⚠️</span>
                                <span>{formData.error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">👤</span>
                                </div>
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                                    name="Name" 
                                    id="Name" 
                                    placeholder="Enter your username" 
                                    value={formData.Name} 
                                    onChange={handleInputChange('Name')} 
                                    required 
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">🔒</span>
                                </div>
                                <input 
                                    type="password" 
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors" 
                                    name="Password" 
                                    id="Password" 
                                    placeholder="Enter your password" 
                                    value={formData.Password} 
                                    onChange={handleInputChange('Password')} 
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                                formData.isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-orange-600 hover:bg-orange-700 transform hover:scale-105'
                            } text-white shadow-lg hover:shadow-xl`}
                            disabled={formData.isLoading}
                        >
                            {formData.isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-gray-600">
                            Don't have an account? 
                            <Link to="/Register" className="text-orange-600 hover:text-orange-700 font-semibold ml-1">Create one here</Link>
                        </p>
                        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;