// components/ProductCard/ProductCard.js
import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onViewIn3D }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.price.toLocaleString()} VND</p>
        <button onClick={onViewIn3D} className="product-button">View in 3D</button>
      </div>
    </div>
  );
};

export default ProductCard;
