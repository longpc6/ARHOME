import React from 'react';
import './HeroSection.css'; // CSS riêng cho Hero section

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Chào mừng đến với ArHome</h1>
          <p>Khám phá bộ sưu tập nội thất hiện đại, tiện nghi và phong cách.</p>
          <a href="/products" className="btn-primary-hero">Khám phá ngay</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
