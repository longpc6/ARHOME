// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Thêm file css cho Header
import logo from '../logoArHome6.png'; // Import logo SVG

const Header = () => {
    return (
        <header className="header">
            <div className='header-container'>
                <Link to="/" className="logo">
                    <img src={logo} alt="Website Logo" className="logo-img" />
                </Link>
                <nav className="nav">
                    <Link to="/">Trang Chủ</Link>
                    <Link to="/products">Sản Phẩm</Link>
                    <Link to="/interior-builder">Xây Dựng Phòng</Link>
                    <Link to="/about">Giới Thiệu</Link> {/* Bạn có thể thêm các đường dẫn khác nếu muốn */}
                </nav>
                <div className="auth-buttons">
                    <Link to="/login" className="btn login-btn">Đăng nhập</Link>
                    <Link to="/signup" className="btn signup-btn">Đăng ký</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
