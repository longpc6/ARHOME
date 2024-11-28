import React, { useState } from 'react';
import './ProductCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ product, isFavourite, onAddToFavourite, onViewIn3D }) => {
  const [favouritesCount, setFavouritesCount] = useState(product.favouritesCount);

  const handleLikeToggle = () => {
    setFavouritesCount((prevCount) => (isFavourite ? prevCount - 1 : prevCount + 1)); // Tăng/giảm số lượng like
    onAddToFavourite(); // Gọi hàm từ parent để đồng bộ hóa backend và state
  };

  return (
    <div className="product-card">
      <img
        src={product.images[0]}
        alt={product.name}
        className="product-image"
        onClick={onViewIn3D}
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="favourite-section">
          <FontAwesomeIcon
            icon={isFavourite ? faHeartSolid : faHeart}
            className={`favourite-icon ${isFavourite ? 'liked' : ''}`}
            onClick={handleLikeToggle}
          />
          <span className="like-count">{favouritesCount} likes</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
