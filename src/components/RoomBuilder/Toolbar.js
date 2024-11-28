import React from 'react';

function Toolbar({ is3D, setIs3D }) {
  return (
    <div style={{ position: 'absolute', top: 100, left: 10 }}>
      <button onClick={() => setIs3D(false)}>Chế độ 2D</button>
      <button onClick={() => setIs3D(true)}>Chế độ 3D</button>
    </div>
  );
}

export default Toolbar;
