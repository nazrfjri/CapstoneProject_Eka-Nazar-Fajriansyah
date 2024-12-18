import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log('Error fetching product details', error);
      });
  }, [id]);

  const handleAddToCart = () => {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      navigate('/login', { state: { lastPath: `/product/${id}` } });
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > 20) {
        setShowNotification({ type: 'error', message: 'Stock limit reached!' });
        setTimeout(() => setShowNotification(null), 3000);
        return;
      }
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: newQuantity } : item
      );
    } else {
      if (quantity > 20) {
        setShowNotification({ type: 'error', message: 'Stock limit reached!' });
        setTimeout(() => setShowNotification(null), 3000);
        return;
      }
      updatedCart = [...cart, { ...product, quantity }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setShowNotification({ type: 'success', message: 'Item successfully added to cart!' });
    setTimeout(() => setShowNotification(null), 3000);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      {showNotification && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 ${
            showNotification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white p-4 rounded-lg shadow-lg transition-all duration-500`}
        >
          {showNotification.message}
        </div>
      )}

      <div className="max-w-3xl w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-shrink-0 w-full md:w-1/2">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain p-4"
            />
          </div>
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
              <p className="text-xl text-gray-700 font-semibold mb-4">${product.price}</p>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div className="mt-6">
              <div className="flex items-center mb-4">
                <label htmlFor="quantity" className="mr-2 font-medium">
                  Quantity:
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.min(20, Math.max(1, Number(e.target.value))))
                  }
                  className="border rounded-lg p-2 w-16 text-center"
                  min="1"
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-zinc-600 text-white py-2 px-4 rounded-lg w-full hover:bg-zinc-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
