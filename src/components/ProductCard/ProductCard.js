// components/ProductCard/ProductCard.js
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onViewIn3D }) => {
  return (
    <div className="product-card" onClick={() => onViewIn3D(product)}> {/* Mở modal khi nhấn vào thẻ */}
      <img src={product.images[0]} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.price.toLocaleString()} VND</p>
      </div>
    </div>
  );
};

export default ProductCard;
