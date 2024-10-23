// pages/RoomBuilderPage.js
import React, { useState } from 'react';
import './RoomBuilderPage.css'; // CSS cho RoomBuilder

const items = [
  { id: 1, name: 'Sofa', image: '/images/sofa.jpg' },
  { id: 2, name: 'Bàn', image: '/images/table.jpg' },
  { id: 3, name: 'Giường', image: '/images/bed.jpg' },
];

const RoomBuilderPage = () => {
  const [roomItems, setRoomItems] = useState([]);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };

  const handleDrop = (e) => {
    const item = JSON.parse(e.dataTransfer.getData('item'));
    setRoomItems([...roomItems, item]);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div className="room-builder">
      <h1>Thiết kế phòng của bạn</h1>
      
      {/* Danh sách các đồ nội thất */}
      <div className="item-list">
        <h2>Chọn nội thất</h2>
        {items.map(item => (
          <div
            key={item.id}
            className="item"
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
          >
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      {/* Khu vực phòng (drop zone) */}
      <div className="room-area" onDrop={handleDrop} onDragOver={allowDrop}>
        <h2>Phòng của bạn</h2>
        {roomItems.length === 0 && <p>Kéo nội thất vào đây để bắt đầu thiết kế</p>}
        {roomItems.map((item, index) => (
          <div key={index} className="room-item">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomBuilderPage;
