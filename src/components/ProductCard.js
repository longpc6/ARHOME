import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        <a href={`/products/${product.id}`} className="product-button">View in 3D</a>
      </div>
    </div>
  );
};

export default ProductCard;
