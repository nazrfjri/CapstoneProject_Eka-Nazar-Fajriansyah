import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateStock } from '../redux/slices/productSlice';
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkoutNotification, setCheckoutNotification] = useState(false);
  const [stockError, setStockError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(state => state.product.items);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [selectedItems, cart]);

  const calculateTotal = () => {
    const totalAmount = cart
      .filter((item) => selectedItems.includes(item.id))
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
    setTotal(parseFloat(totalAmount));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 20) {
      // Show quantity limit notif
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    let stockIssue = false;

    // Check quantity untuk ketersediaan stock dalam checkout
    for (let id of selectedItems) {
      const item = cart.find((item) => item.id === id);
      const product = products.find((p) => p.id === id);
      if (product && product.stock < item.quantity) {
        stockIssue = true;
        break;
      }
    }

    if (stockIssue) {
      setStockError(true);
      setTimeout(() => setStockError(false), 3000);
      return;
    }

    // Melanjutkan checkout dan memperbarui stock produk
    for (let id of selectedItems) {
      const item = cart.find((item) => item.id === id);
      await dispatch(updateStock({ id, quantity: item.quantity }));
    }

    const updatedCart = cart.filter((item) => !selectedItems.includes(item.id));
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setSelectedItems([]);
    setCheckoutNotification(true);
    setTimeout(() => {
      setCheckoutNotification(false);
      navigate('/');
    }, 1500);
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleAddToCart = (id) => {
    const product = products.find((product) => product.id === id);

    // Mengecek stock limit
    if (product && product.stock <= 0) {
      setStockLimitReached(true);
      setTimeout(() => setStockLimitReached(false), 3000);
      return;
    }

    // Menambah produk
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem) {
      handleQuantityChange(id, existingItem.quantity + 1);
    } else {
      const newItem = { ...product, quantity: 1 };
      setCart([...cart, newItem]);
      localStorage.setItem('cart', JSON.stringify([...cart, newItem]));
    }
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Cart</h1>

      {/* Stock limit notif */}
      {stockError && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg transition-all duration-500">
          Stock tidak mencukupi untuk checkout!
        </div>
      )}

      {/* Quantity limit notif */}
      {showNotification && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg transition-all duration-500">
          Batas stok melebihi (jumlah maksimum stock adalah 20)!
        </div>
      )}

      {checkoutNotification && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-4 rounded-lg shadow-lg transition-all duration-500">
          Barang berhasil di checkout!
        </div>
      )}

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">
          Your cart is empty.{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Go to Products
          </Link>
        </p>
      ) : (
        <div>
          <table className="min-w-full table-auto mb-6 border-collapse border border-gray-200 shadow-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border">Select</th>
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Product</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 border">{item.title}</td>
                  <td className="px-4 py-2 border">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      className="border px-2 py-1 w-16 text-center"
                      onChange={(e) => {
                        handleQuantityChange(item.id, parseInt(e.target.value));
                        if (selectedItems.includes(item.id)) {
                          calculateTotal();
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    ${(item.price * item.quantity).toFixed(2)}
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right flex justify-between items-center">
            <h2 className="text-2xl font-semibold mb-4">Total: ${total.toFixed(2)}</h2>
            <button
              onClick={handleCheckout}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring"
              disabled={selectedItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
