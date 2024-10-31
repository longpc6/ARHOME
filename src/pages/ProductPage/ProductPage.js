import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProductPage.css';
import ProductGrid from '../../components/ProductGrid/ProductGrid.js';
import ModelViewer from '../../components/ModelViewer/ModelViewer.js';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1); // State cho số lượng sản phẩm
  const userId = "yourUserIdHere";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleViewIn3D = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset số lượng khi mở modal
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await axios.post('/api/cart/add', {
        user_id: userId,
        product_id: product._id,
        quantity: quantity // Truyền số lượng vào giỏ hàng
      });
      setCart(response.data);
      console.log('Thêm sản phẩm vào giỏ hàng:', response.data);
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error.message);
    }
  };

  const handleBuyNow = async (product) => {
    try {
      await handleAddToCart(product);
      navigate('/checkout');
    } catch (error) {
      console.error('Lỗi khi mua ngay:', error.message);
    }
  };

  return (
    <div className="product-page">
      <h1>Danh sách sản phẩm</h1>
      <ProductGrid products={products} onViewIn3D={handleViewIn3D} />

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

                {/* Bộ điều khiển số lượng */}
                <div className="quantity-control">
                  <button onClick={() => handleQuantityChange(-1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)}>+</button>
                </div>

                <div className="button-container">
                  <button onClick={() => handleAddToCart(selectedProduct)} className="cart-button">
                    Add to Cart
                  </button>
                  <button onClick={() => handleBuyNow(selectedProduct)} className="buy-button">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
