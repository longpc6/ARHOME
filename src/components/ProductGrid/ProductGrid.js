// src/components/ProductGrid.js
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';

const ProductGrid = () => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
