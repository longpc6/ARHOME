// components/Hero.js
import React from 'react';
import './HeroSection.css'; // CSS riêng cho Hero section

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Chào mừng đến với cửa hàng nội thất</h1>
        <p>Khám phá bộ sưu tập sản phẩm nội thất hiện đại và tiện nghi.</p>
        <a href="/products" className="btn-primary">Xem sản phẩm</a>
      </div>
    </section>
  );
};

export default Hero;
