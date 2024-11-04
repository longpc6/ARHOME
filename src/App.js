import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import ProductPage from './pages/ProductPage/ProductPage';
import RoomBuilderPage from './pages/RoomBuilderPage/RoomBuilderPage';
import LoginPage from './pages/AuthPage/LoginPage';
import SignupPage from './pages/AuthPage/SignupPage';
import CartPage from './pages/CartPage/CartPage.js'; // Import trang giỏ hàng
import { CartProvider } from './contexts/CartContext/CartContext.js'; // Import CartProvider
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/interior-builder" element={<RoomBuilderPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart" element={<CartPage />} /> {/* Đường dẫn tới CartPage */}
      </Routes>
    </Router>
  );
};

export default App;
