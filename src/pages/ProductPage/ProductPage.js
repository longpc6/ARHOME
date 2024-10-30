import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductPage.css';
import ProductGrid from '../../components/ProductGrid/ProductGrid.js';
import ModelViewer from '../../components/ModelViewer/ModelViewer.js';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        console.log(response.data);  // Kiểm tra dữ liệu
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleViewIn3D = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="product-page">
      <h1>Danh sách sản phẩm</h1>
      <ProductGrid products={products} onViewIn3D={handleViewIn3D} />

      {/* Modal hiển thị mô hình 3D và chi tiết sản phẩm */}
      {selectedProduct && (
        <>
          <div className={`modal-overlay ${selectedProduct ? 'active' : ''}`} onClick={closeModal}></div>
          <div className={`modal ${selectedProduct ? 'active' : ''}`}>
            <div className="modal-content">
              <div className="model-viewer-container">
                <ModelViewer modelUrl={selectedProduct.model_3d} />
              </div>
              <div className="product-info">
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.price.toLocaleString()} VND</p>
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
