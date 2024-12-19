import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, status, error } = useSelector((state) => state.product);
  const [showNotification, setShowNotification] = React.useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading products...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  const handleAddToCart = (product) => {
    if (!token) {
      localStorage.setItem('lastPath', '/');
      navigate('/login');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > 20) {
        setShowNotification({ type: 'error', message: 'Stock limit reached!' });
        setTimeout(() => setShowNotification(null), 3000);
        return;
      }
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: newQuantity } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setShowNotification({ type: 'success', message: 'Item successfully added to cart!' });
    setTimeout(() => setShowNotification(null), 1500);
  };

  const truncateTitle = (title, maxLength = 23) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  return (
    <div className="container mx-auto px-4">
      {/* Banner Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16 px-4 text-center rounded-lg shadow-lg mb-8">
        <h2 className="text-4xl font-bold mb-4">Welcome to Our E-Commerce Store</h2>
        <p className="text-lg mb-4">
          Discover amazing products at unbeatable prices! Shop now and get exclusive deals!
        </p>
      </div>

      {/* Notification Card */}
      {showNotification && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 ${
            showNotification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white p-4 rounded-lg shadow-lg transition-all duration-500`}
        >
          {showNotification.message}
        </div>
      )}

      <h1 className="text-3xl font-bold my-8">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-contain mb-4 rounded-md"
            />
            <h3 className="font-semibold text-lg mb-2 text-center">
              {truncateTitle(product.title)}
            </h3>
            <p className="text-gray-700 mb-2">${product.price.toFixed(2)}</p>
            <Link
              to={`/product/${product.id}`}
              className="text-blue-600 hover:underline mb-4"
            >
              View Details
            </Link>
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-zinc-600 text-white py-2 px-4 rounded hover:bg-zinc-700 w-full"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
