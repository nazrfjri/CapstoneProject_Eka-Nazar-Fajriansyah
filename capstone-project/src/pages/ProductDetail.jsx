import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Ikon bintang untuk rating

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

  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating) ? (
          <FaStar key={i} className="text-yellow-500" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500" />
        )
      );
    }
    return stars;
  };

  if (!product) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      {showNotification && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 ${
            showNotification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white p-4 rounded-lg shadow-lg transition-all duration-500`}
        >
          {showNotification.message}
        </div>
      )}

      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Gambar Produk */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain p-6"
            />
          </div>

          {/* Detail Produk */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center mb-4">
                <div className="flex">{renderRating(product.rating.rate)}</div>
                <span className="ml-2 text-gray-600">
                  ({product.rating.count} reviews)
                </span>
              </div>
              <p className="text-xl text-gray-800 font-semibold mb-4">${product.price}</p>
              <p className="text-gray-600 mb-4">{product.description}</p>
            </div>

            {/* Tambahkan ke Keranjang */}
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
