// pages/HomePage.js
import React from 'react';
import HeroSection from '../components/HeroSection.js';
import './HomePage.css'; // CSS cho trang chủ

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Phần hero giới thiệu */}
      <HeroSection/>

      {/* Phần sản phẩm nổi bật */}
      <section className="featured-products">
        <h2>Sản phẩm nổi bật</h2>
        <div className="product-list">
          <div className="product-item">
            <img src="/images/sofa.jpg" alt="Sofa hiện đại" />
            <h3>Ghế Sofa hiện đại</h3>
            <p>Giá: 500$</p>
          </div>
          <div className="product-item">
            <img src="/images/table.jpg" alt="Bàn gỗ tự nhiên" />
            <h3>Bàn gỗ tự nhiên</h3>
            <p>Giá: 300$</p>
          </div>
          {/* Thêm nhiều sản phẩm nếu cần */}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
