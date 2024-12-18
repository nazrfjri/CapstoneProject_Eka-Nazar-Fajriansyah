import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHome } from 'react-icons/fa';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleNavigation = (path) => {
    if (!token) {
      localStorage.setItem('lastPath', path);
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-slate-700 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2">
          <span className="text-stone-400">E-Shop</span>
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-6 items-center">
          <Link to="/" className="hover:text-stone-400 font-medium flex items-center space-x-2">
            <FaHome /> <span>Home</span>
          </Link>
          <span
            onClick={() => handleNavigation('/cart')}
            className="cursor-pointer hover:text-stone-400 font-medium flex items-center space-x-2"
          >
            <FaShoppingCart /> <span>Cart</span>
          </span>
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2"
            >
              <FiLogOut /> <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavigation('/login')}
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2"
            >
              <FiLogIn /> <span>Login</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
