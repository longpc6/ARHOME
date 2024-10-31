// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/icons/logoArHome6.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <img src={logo} alt="Website Logo" className="logo-img" />
                </Link>
                <nav className="nav">
                    <Link to="/">Trang Chủ</Link>
                    <Link to="/products">Sản Phẩm</Link>
                    <Link to="/interior-builder">Xây Dựng Phòng</Link>
                    <Link to="/about">Giới Thiệu</Link>
                </nav>
                <div className="auth-cart-container">
                    <Link to="/cart" className="cart-icon">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </Link>
                    <div className="auth-buttons">
                        <Link to="/login" className="btn login-btn">Đăng nhập</Link>
                        <Link to="/signup" className="btn signup-btn">Đăng ký</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
