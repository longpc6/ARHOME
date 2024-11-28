// components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/icons/logoArHome6.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cập nhật trạng thái đăng nhập khi trang tải lại
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Quay về trang chủ sau khi đăng xuất
    window.location.reload(); // Làm mới trang để cập nhật lại header
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Website Logo" className="logo-img" />
        </Link>
        <nav className="nav">
          <Link to="/">Trang Chủ</Link>
          <Link to="/products">Đồ nội thất</Link>
          <Link to="/interior-builder">Mẫu kiến trúc</Link>
          <Link to="/about">Giới Thiệu</Link>
        </nav>
        <div className="auth-favorites-container">
          {isLoggedIn ? (
            <>
              {/* Danh sách yêu thích */}
              <div className="favorites-container">
                <Link to="/favourites" className="favorites-icon">
                  <FontAwesomeIcon icon={faHeart} />
                </Link>
              </div>
              {/* Menu người dùng */}
              <div
                className="user-menu-container"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <FontAwesomeIcon icon={faUser} className="user-icon" />
                {showUserMenu && (
                  <div className="user-menu">
                    <Link to="/profile">Xem hồ sơ</Link>
                    <Link to="/settings">Cài đặt</Link>
                    <button onClick={handleLogout}>Đăng xuất</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn login-btn">Đăng nhập</Link>
              <Link to="/signup" className="btn signup-btn">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
