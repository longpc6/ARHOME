// src/components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModelViewer from '..ModelViewer/ModelViewer.js'; // Giả sử đây là component bạn dùng để hiển thị mô hình 3D

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch dữ liệu sản phẩm từ API khi component mount
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products${productId}`); // Thay thế URL với endpoint thật
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p>Category: {product.category}</p>
      <p>Description: {product.description}</p>
      <p>Price: {product.price.toLocaleString()} VND</p>
      <p>Stock: {product.stock}</p>

      <div className="product-images">
        {product.images.map((image, index) => (
          <img key={index} src={image} alt={product.name} style={{ width: '100%', maxWidth: '400px' }} />
        ))}
      </div>

      <div className="product-model">
        <h3>3D Model:</h3>
        <ModelViewer modelUrl={product.model_3d} /> {/* Sử dụng URL model từ API */}
      </div>
    </div>
  );
};

export default ProductDetail;
