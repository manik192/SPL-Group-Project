import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        mob: '',
        password: '',
        email: '',
        isLoading: false,
        error: '',
        success: false
    });

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
        setFormData(prev => ({ ...prev, isLoading: true, error: '', success: false }));

        axios.post('http://localhost:8080/register', {
            mob: formData.mob,
            name: formData.name,
            email: formData.email,
            password: formData.password
        })
            .then((res) => {
                console.log(res);
                setFormData(prev => ({
                    ...prev,
                    success: true,
                    isLoading: false,
                    error: ''
                }));
                setTimeout(() => {
                    navigate("/Login");
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                setFormData(prev => ({
                    ...prev,
                    error: "Registration failed. Please check your information and try again.",
                    isLoading: false
                }));
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                            <span className="text-2xl">🌟</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Indian Spice Hub</h1>
                        <p className="text-gray-600">Create your account and start your culinary adventure</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {formData.error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
                                <span>⚠️</span>
                                <span>{formData.error}</span>
                            </div>
                        )}

                        {formData.success && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2 text-green-700">
                                <span>✅</span>
                                <span>Registration successful! Redirecting to login...</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400">👤</span>
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        id="name"
                                        placeholder="Choose a username"
                                        value={formData.name}
                                        onChange={handleInputChange('name')}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400">📧</span>
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange('email')}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400">📱</span>
                                    </div>
                                    <input
                                        type="tel"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        id="mobile"
                                        placeholder="Enter mobile number"
                                        value={formData.mob}
                                        onChange={handleInputChange('mob')}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400">🔒</span>
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                        id="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleInputChange('password')}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${formData.isLoading || formData.success
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-orange-600 hover:bg-orange-700 transform hover:scale-105'
                                } text-white shadow-lg hover:shadow-xl`}
                            disabled={formData.isLoading || formData.success}
                        >
                            {formData.isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : formData.success ? (
                                <>
                                    <span>✅</span>
                                    <span>Account Created!</span>
                                </>
                            ) : (
                                <>
                                    <span>🚀</span>
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <p className="text-gray-600">
                            Already have an account?
                            <Link to="/Login" className="text-orange-600 hover:text-orange-700 font-semibold ml-1">Sign in here</Link>
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

export default Register;