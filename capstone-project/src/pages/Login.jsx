import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/authSlice';
import { FaStore } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);

  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    if (!email || !password) {
      setNotification({ type: 'error', message: 'Please enter both email and password!' });
      return;
    }
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (user) {
      const lastPath = localStorage.getItem('lastPath') || '/';
      window.location.href = lastPath === '/login' ? '/' : lastPath; // Redirect after login
    }
  }, [user]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Icon Section (Left side) */}
      <div className="flex-1 flex justify-center items-center bg-gray-800 text-white">
        <div className="text-center">
          <FaStore size={150} className="mb-6" />
          <h2 className="text-3xl font-bold">E-Shop</h2>
        </div>
      </div>

      {/* Login Form Section (Right side) */}
      <div className="flex-1 flex justify-center items-center p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
          {notification && (
            <div
              className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-${
                notification.type === 'success' ? 'green-500' : 'red-500'
              } text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-500`}
            >
              {notification.message}
            </div>
          )}
          
          <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
