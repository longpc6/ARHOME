// src/components/ProductGrid.js
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';

const products = [
  { id: 1, name: 'Bàn gỗ', price: 100, image: 'https://example.com/ban-go.png' },
  { id: 2, name: 'Ghế sofa', price: 300, image: 'https://example.com/ghe-sofa.png' },
  // Thêm nhiều sản phẩm khác
];

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
