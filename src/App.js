import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import RoomBuilderPage from './pages/RoomBuilderPage';
import LoginPage from './pages/LoginPage'; // Import trang login
import SignupPage from './pages/SignupPage'; // Import trang signup
import './App.css'; // Thêm file css chính

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} /> {/* Đúng tên ProductPage */}
        <Route path="/interior-builder" element={<RoomBuilderPage />} /> {/* Đúng tên RoomBuilderPage */}
        <Route path="/login" element={<LoginPage />} /> {/* Trang đăng nhập */}
        <Route path="/signup" element={<SignupPage />} /> {/* Trang đăng ký */}
      </Routes>
    </Router>
  );
};

export default App;
