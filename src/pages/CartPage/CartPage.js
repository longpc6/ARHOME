// src/pages/CartPage/CartPage.js
import React from 'react';
import './CartPage.css';
import { useCart } from '../../components/CartContext/CartContext.js';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  // Tính tổng giá
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1>Giỏ hàng của bạn</h1>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.images[0]} alt={item.name} />
              <div className="cart-item-details">
                <h2>{item.name}</h2>
                <p>{item.price.toLocaleString()} VND</p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                />
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h2>Tổng giá: {totalPrice.toLocaleString()} VND</h2>
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
