import React from 'react';

function Sidebar({ addObject }) {
  const items = [
    { name: 'Ghế', modelUrl: '/models/chair.glb' },
    { name: 'Bàn', modelUrl: '/models/table.glb' },
    // Thêm các loại nội thất khác
  ];

  return (
    <div className="sidebar">
      <h3>Thêm Nội Thất</h3>
      {items.map((item, index) => (
        <button key={index} onClick={() => addObject(item)}>
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
