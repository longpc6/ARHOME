import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductPage.css';
import ProductGrid from '../../components/ProductGrid/ProductGrid.js';
import ModelViewer from '../../components/ModelViewer/ModelViewer.js';

const ProductPage = () => {
  const [furnitures, setFurnitures] = useState([]);
  const [favourites, setFavourites] = useState([]); // Lưu danh sách yêu thích
  const [userId, setUserId] = useState(null); // Kiểm tra người dùng đã đăng nhập hay chưa
  const [color, setColor] = useState('#ffffff'); // State cho màu sắc
  const [material, setMaterial] = useState(''); // State cho vật liệu
  const [selectedFurniture, setSelectedFurniture] = useState(null);

  useEffect(() => {
    const fetchFurnituresAndFavourites = async () => {
      try {
        // Fetch danh sách đồ nội thất
        const furnituresResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/furnitures`);
        setFurnitures(furnituresResponse.data);
  
        // Kiểm tra token và fetch danh sách yêu thích nếu người dùng đã đăng nhập
        const token = localStorage.getItem('token');
        if (token) {
          const favouritesResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/favourites`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavourites(favouritesResponse.data); // Lưu danh sách đầy đủ
          setUserId(localStorage.getItem('userId'));
        }
      } catch (error) {
        console.error('Error fetching furnitures or favourites:', error);
      }
    };
  
    fetchFurnituresAndFavourites();
  }, []);
  

  const handleViewIn3D = (furniture) => {
    setSelectedFurniture(furniture);
    setColor('#ffffff'); // Reset màu sắc
    setMaterial(''); // Reset vật liệu
  };

  const closeModal = () => {
    setSelectedFurniture(null);
  };

  const handleAddToFavourite = async (furnitureId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để yêu thích sản phẩm này!');
      return;
    }
  
    try {
      const favourite = favourites.find(fav => fav.item_id === furnitureId);
  
      if (favourite) {
        // Nếu đã thích thì unlike
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/favourites/${favourite._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavourites(prev => prev.filter(fav => fav.item_id !== furnitureId));
      } else {
        // Nếu chưa thích thì like
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/favourites`,
          {
            user_id: userId,
            item_id: furnitureId,
            item_type: 'furniture',
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavourites(prev => [...prev, response.data]); // Thêm toàn bộ object mới trả về
      }
    } catch (error) {
      console.error('Error adding/removing from favourites:', error);
    }
  };
  
  

  return (
    <div className="product-page">
    <div className="product-page-header">
      <h1 className="page-title">Danh sách đồ nội thất</h1>
    </div>
      <ProductGrid
        products={furnitures}
        favourites={favourites}
        onAddToFavourite={handleAddToFavourite}
        onViewIn3D={handleViewIn3D}
      />
  
      {selectedFurniture && (
        <>
          <div
            className={`modal-overlay ${selectedFurniture ? 'active' : ''}`}
            onClick={closeModal}
          ></div>
          <div className={`modal ${selectedFurniture ? 'active' : ''}`}>
            <div className="modal-content">
              <div className="model-viewer-container">
                <ModelViewer
                  modelUrl={selectedFurniture.model_3d}
                  color={color}
                  material={material}
                />
              </div>
              <div className="product-info">
                <h2>{selectedFurniture.name}</h2>
                <div className="color-picker">
                  <label>Chọn màu sắc:</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                <div className="material-picker">
                  <label>Chọn vật liệu:</label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    <option value="">Mặc định</option>
                    <option value="wood">Gỗ</option>
                    <option value="metal">Kim loại</option>
                    <option value="glass">Kính</option>
                  </select>
                </div>
                <div className="button-container">
                  <button
                    onClick={() => handleAddToFavourite(selectedFurniture)}
                    className="favourite-button"
                  >
                    Yêu thích
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
