import React from 'react';
import ProductCard from '../ProductCard/ProductCard';

const ProductGrid = ({ products, favourites, onAddToFavourite, onViewIn3D }) => {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          isFavourite={favourites.some((fav) => fav.item_id === product._id)} // Đồng bộ trạng thái yêu thích
          onAddToFavourite={() => onAddToFavourite(product._id)}
          onViewIn3D={() => onViewIn3D(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
