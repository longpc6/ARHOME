// src/components/ProductGrid/ProductGrid.js
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';

const ProductGrid = ({ products, onViewIn3D }) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product._id} product={product} onViewIn3D={() => onViewIn3D(product)} />
      ))}
    </div>
  );
};

export default ProductGrid;
