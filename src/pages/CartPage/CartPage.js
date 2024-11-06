import React, { useEffect, useState } from 'react';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext/CartContext.js';
import axios from 'axios';

const CartPage = () => {
  const { cartItems = [], setCartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]); // Danh sách các sản phẩm được tick

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product_id?.price || 0) * item.quantity, 0);

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) return;

        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/carts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching user cart:', error);
      }
    };

    fetchUserCart();
  }, [setCartItems]);

  const handleSelectItem = (productId) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId); // Nếu số lượng là 0 hoặc ít hơn thì tự động xóa
      return;
    }
    
    updateQuantity(productId, newQuantity);
    
    try {
      const userId = localStorage.getItem('userId');
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/carts/update`, {
        user_id: userId,
        product_id: productId,
        quantity: newQuantity
      });
      // Cập nhật số lượng trực tiếp trên UI
      setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (!confirmDelete) return;
    
    removeFromCart(productId);
    
    try {
      const userId = localStorage.getItem('userId');
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/carts/remove`, {
        data: { user_id: userId, product_id: productId }
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleRemoveSelectedItems = () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?");
    if (!confirmDelete) return;
    
    selectedItems.forEach((productId) => handleRemoveItem(productId));
    setSelectedItems([]);
  };

  return (
    <div className="cart-page">
      <h1>Giỏ hàng của bạn</h1>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.product_id?._id} className="cart-item">
              <input
                type="checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={() => handleSelectItem(item._id)}
              />
              {item.product_id?.images?.[0] ? (
                <img src={item.product_id.images[0]} alt={item.product_id.name} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
              <div className="cart-item-details">
                <h2>{item.product_id?.name || "Sản phẩm không xác định"}</h2>
                <p>{(item.product_id?.price || 0).toLocaleString()} VND</p>
                <div className="quantity-control">
                  <button onClick={() => handleQuantityChange(item.product_id._id, item.quantity - 1)}>-</button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.product_id._id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => handleRemoveItem(item.product_id._id)}>Xóa</button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h2>Tổng giá: {totalPrice.toLocaleString()} VND</h2>
            <button onClick={handleRemoveSelectedItems} className="remove-selected">Xóa sản phẩm đã chọn</button>
            <button onClick={() => navigate('/checkout')} className="checkout-btn">Mua hàng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
