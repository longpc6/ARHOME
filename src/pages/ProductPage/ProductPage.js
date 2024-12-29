import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductPage.css';
import ProductGrid from '../../components/ProductGrid/ProductGrid.js';
import ModelViewer from '../../components/ModelViewer/ModelViewer.js';
import UploadFurnitureForm from '../../components/UploadFurnitureForm/UploadFurnitureForm.js';

const ProductPage = () => {
  const [furnitures, setFurnitures] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [userId, setUserId] = useState(null);
  const [color, setColor] = useState('original');
  const [material, setMaterial] = useState('original');
  const [texture, setTexture] = useState(null); // Texture cho mô hình
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false); // Thêm state để điều khiển hiển thị form


  const fetchFurnituresAndFavourites = async () => {
      try {
        const furnituresResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/furnitures`);
        setFurnitures(furnituresResponse.data);

        const token = localStorage.getItem('token');
        if (token) {
          const favouritesResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/favourites`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavourites(favouritesResponse.data);
          setUserId(localStorage.getItem('userId'));
        }
      } catch (error) {
        console.error('Error fetching furnitures or favourites:', error);
      }
    }

  useEffect(() => {
    fetchFurnituresAndFavourites();
  }, []);

  const handleViewIn3D = (furniture) => {
    setSelectedFurniture(furniture);
    setColor('original');
    setMaterial('original');
    setTexture(null);
  };

  const toggleUploadForm = () => {
    setShowUploadForm((prev) => !prev); // Chuyển trạng thái hiển thị form
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
      const favourite = favourites.find((fav) => fav.item_id === furnitureId);

      if (favourite) {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/favourites/${favourite._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavourites((prev) => prev.filter((fav) => fav.item_id !== furnitureId));
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/favourites`,
          {
            user_id: userId,
            item_id: furnitureId,
            item_type: 'furniture',
            customization: { color, material, texture },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavourites((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error adding/removing from favourites:', error);
    }
  };

  const handleTextureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTexture(reader.result); // Base64 URL của hình ảnh
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSuccess = () => {
    fetchFurnituresAndFavourites();
  };

  return (
    <div className="product-page">
      <div className="product-page-header">
        <h1 className="page-title">Danh sách đồ nội thất</h1>
        <div className="upload-button-container">
          {/* Nút để hiển thị form */}
          <button onClick={toggleUploadForm} className="upload-button">
            {showUploadForm ? "Đóng Form Tải Lên" : "Tải Lên Đồ Nội Thất"}
          </button>
        </div>

        {/* Hiển thị form khi state showUploadForm là true */}
        {showUploadForm && <UploadFurnitureForm onUploadSuccess={handleUploadSuccess} />}

      </div>
      <ProductGrid
        products={furnitures}
        favourites={favourites}
        onAddToFavourite={handleAddToFavourite}
        onViewIn3D={handleViewIn3D}
      />

      {selectedFurniture && (
        <>
          <div className={`modal-overlay ${selectedFurniture ? 'active' : ''}`} onClick={closeModal}></div>
          <div className={`modal ${selectedFurniture ? 'active' : ''}`}>
            <div className="modal-content">
              <div className="model-viewer-container">
                <ModelViewer
                  modelUrl={selectedFurniture.model_3d}
                  color={color}
                  material={material}
                  texture={texture}
                />
              </div>
              <div className="product-info">
                <h2>{selectedFurniture.name}</h2>
                <div className="color-picker">
                  <label>Chọn màu sắc:</label>
                  <select value={color} onChange={(e) => setColor(e.target.value)}>
                    <option value="original">Mặc định</option>
                    <option value="black-grey">Đen xám</option>
                    <option value="white-vanilla">Trắng vani</option>
                    <option value="brown">Màu nâu</option>
                  </select>
                </div>
                <div className="material-picker">
                  <label>Chọn vật liệu:</label>
                  <select value={material} onChange={(e) => setMaterial(e.target.value)}>
                    <option value="original">Mặc định</option>
                    <option value="wood">Gỗ</option>
                    <option value="metal">Kim loại</option>
                    <option value="diamond">Giả kim cương</option>
                  </select>
                </div>
                <div className="button-container">
                  <button
                    onClick={() => handleAddToFavourite(selectedFurniture._id)}
                    className="favourite-button"
                  >
                    {favourites.some((fav) => fav.item_id === selectedFurniture._id)
                      ? 'Bỏ yêu thích'
                      : 'Yêu thích'}
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
