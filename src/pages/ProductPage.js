// pages/ProductPage.js
import React from 'react';
import './ProductPage.css'; // CSS cho trang sản phẩm

const products = [
  { id: 1, name: 'Ghế Sofa hiện đại', price: '500$', image: '/images/sofa.jpg' },
  { id: 2, name: 'Bàn gỗ tự nhiên', price: '300$', image: '/images/table.jpg' },
  { id: 3, name: 'Đèn trang trí', price: '100$', image: '/images/lamp.jpg' },
  { id: 4, name: 'Giường ngủ', price: '800$', image: '/images/bed.jpg' },
  // Thêm nhiều sản phẩm khác
];

const ProductPage = () => {
  return (
    <div className="product-page">
      <h1>Danh sách sản phẩm</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Giá: {product.price}</p>
            <a href="#" className="btn-primary">Mua ngay</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
