import React from 'react';

function ObjectPanel({ selectedObject, updateObject }) {
  if (!selectedObject) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateObject(selectedObject.id, { [name]: parseFloat(value) });
  };

  return (
    <div className="object-panel">
      <h3>Điều Chỉnh Đồ Vật</h3>
      <label>X: <input name="x" type="number" value={selectedObject.position.x} onChange={handleChange} /></label>
      <label>Y: <input name="y" type="number" value={selectedObject.position.y} onChange={handleChange} /></label>
      <label>Z: <input name="z" type="number" value={selectedObject.position.z} onChange={handleChange} /></label>
    </div>
  );
}

export default ObjectPanel;
