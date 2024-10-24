// src/components/RoomBuilder.js
import React, { useEffect } from 'react';
// Giả sử bạn dùng Three.js hoặc Babylon.js để hiển thị 3D

const RoomBuilder = () => {
  useEffect(() => {
    // Khởi tạo không gian 3D ở đây, ví dụ Three.js
    // Đặt các vật thể nội thất, ánh sáng, camera, v.v.
  }, []);

  return (
    <div className="room-builder">
      <canvas id="3d-canvas"></canvas>
      <div className="furniture-sidebar">
        <h3>Thêm nội thất</h3>
        {/* Thêm nút hoặc hình ảnh để người dùng kéo-thả vào không gian 3D */}
      </div>
    </div>
  );
};

export default RoomBuilder;
