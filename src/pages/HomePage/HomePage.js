import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection.js';
import './HomePage.css'; // CSS cho trang chủ

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Phần hero giới thiệu */}
      <HeroSection />

      {/* Phần giới thiệu ngắn gọn */}
      <section className="homepage-intro">
        <h2>Chào mừng bạn đến với chúng tôi</h2>
        <p>
          Tận hưởng không gian sống lý tưởng với các sản phẩm nội thất tinh tế và dịch vụ chuyên nghiệp của chúng tôi. 
          Đưa phong cách của bạn lên một tầm cao mới!
        </p>
      </section>

      {/* Nút điều hướng */}
      <div className="homepage-button">
        <a href="/contact" className="btn-primary-homepage">Liên hệ ngay</a>
      </div>
    </div>
  );
};

export default HomePage;
