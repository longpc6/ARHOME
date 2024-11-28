import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FavouritesPage.css';

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API để lấy danh sách yêu thích
    const fetchFavourites = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/favourites`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Gửi token để xác thực
        });
        setFavourites(response.data); // Lưu danh sách yêu thích vào state
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Hiển thị loading khi đang fetch dữ liệu
  }

  if (favourites.length === 0) {
    return <p>Bạn chưa có mục yêu thích nào.</p>; // Thông báo nếu không có mục yêu thích
  }

  return (
    <div className="favourites-page">
        <div className="favourites-page-header">
            <h1 className="page-title">Danh mục yêu thích</h1>
        </div>
      <div className="favourites-list">
        {favourites.map((favourite) => (
          <div key={favourite._id} className="favourite-item">
            <h3>{favourite.item.name}</h3>
            <p>{favourite.item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouritesPage;
