// pages/ProductPage.js
import React, { useState } from 'react';
import './ProductPage.css';
import ProductCard from '../../components/ProductCard/ProductCard.js';
import ModelViewer from '../../components/ModelViewer/ModelViewer.js';

const products = [
  { id: 1, name: 'Ghế Sofa hiện đại', price: '500', image: 'assets/images/image_test.png', model: '/assets/models/model_test.glb', description: 'Một chiếc ghế sofa thoải mái, hiện đại.' },
  { id: 2, name: 'Bàn gỗ tự nhiên', price: '300', image: '/images/table.jpg', model: '/assets/models/out (13).glb', description: 'Bàn gỗ bền và phong cách.' },
  { id: 3, name: 'Đèn trang trí', price: '100', image: '/images/lamp.jpg', model: '/assets/models/model_test.glb', description: 'Đèn trang trí giúp căn phòng thêm ấm áp.' },
  { id: 4, name: 'Giường ngủ', price: '800', image: '/images/bed.jpg', model: '/assets/models/model_test.glb', description: 'Giường ngủ rộng rãi và thoải mái.' },
];

const ProductPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewIn3D = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="product-page">
      <h1>Danh sách sản phẩm</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onViewIn3D={() => handleViewIn3D(product)} />
        ))}
      </div>

      {/* Modal hiển thị mô hình 3D và chi tiết sản phẩm */}
      {selectedProduct && (
        <>
          <div className={`modal-overlay ${selectedProduct ? 'active' : ''}`} onClick={closeModal}></div>
          <div className={`modal ${selectedProduct ? 'active' : ''}`}>
            <div className="modal-content">
              <div className="model-viewer-container">
                <ModelViewer modelUrl={selectedProduct.model} />
              </div>
              <div className="product-info">
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.price}</p>
                <p>{selectedProduct.description}</p>
                <button onClick={closeModal} className="close-button">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
