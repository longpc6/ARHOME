import React, { useEffect, useState } from 'react';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext/CartContext.js';
import axios from 'axios';

const CartPage = () => {
  const { cartItems, setCartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [detailedCartItems, setDetailedCartItems] = useState([]);
  const navigate = useNavigate();

  // Tính tổng giá
  const totalPrice = detailedCartItems.reduce((acc, item) => acc + item.product_id.price * item.quantity, 0);

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) return;

        // Gọi API để lấy giỏ hàng có chi tiết sản phẩm
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/carts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDetailedCartItems(response.data);
      } catch (error) {
        console.error('Error fetching user cart:', error);
      }
    };

    fetchUserCart();
  }, []);

  return (
    <div className="cart-page">
      <h1>Giỏ hàng của bạn</h1>
      {detailedCartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <div>
          {detailedCartItems.map(item => (
            <div key={item.product_id._id} className="cart-item">
              <img src={item.product_id.images[0]} alt={item.product_id.name} />
              <div className="cart-item-details">
                <h2>{item.product_id.name}</h2>
                <p>{item.product_id.price.toLocaleString()} VND</p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product_id._id, parseInt(e.target.value))}
                />
                <button onClick={() => removeFromCart(item.product_id._id)}>Xóa</button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h2>Tổng giá: {totalPrice.toLocaleString()} VND</h2>
            <button onClick={clearCart} className="clear-cart">Xóa giỏ hàng</button>
            <button onClick={() => navigate('/checkout')} className="checkout-btn">Mua hàng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
