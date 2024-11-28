import React, { useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const Canvas2D = ({ onSaveShapes }) => {
  const [shapes, setShapes] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [role, setRole] = useState('wall'); // Vai trò mặc định là tường

  useEffect(() => {
    onSaveShapes(shapes);
  }, [shapes, onSaveShapes]);

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    setDrawing(true);
    setNewShape({ x, y, width: 0, height: 0, role });
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    setNewShape((prev) => ({
      ...prev,
      width: x - prev.x,
      height: y - prev.y,
    }));
  };

  const handleMouseUp = () => {
    if (newShape) {
      setShapes([...shapes, newShape]);
    }
    setDrawing(false);
    setNewShape(null);
  };

  return (
    <div>
      {/* Menu chọn vai trò */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setRole('wall')}>Tường</button>
        <button onClick={() => setRole('floor')}>Sàn</button>
        <button onClick={() => setRole('window')}>Cửa sổ</button>
      </div>
      {/* Canvas 2D */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ background: '#f4f4f4', cursor: 'crosshair' }}
      >
        <Layer>
          {shapes.map((shape, index) => (
            <Rect
              key={index}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              fill={
                shape.role === 'wall'
                  ? 'rgba(200, 100, 100, 0.5)'
                  : shape.role === 'floor'
                  ? 'rgba(100, 200, 100, 0.5)'
                  : 'rgba(100, 100, 200, 0.5)'
              }
              stroke="black"
              strokeWidth={2}
            />
          ))}
          {newShape && (
            <Rect
              x={newShape.x}
              y={newShape.y}
              width={newShape.width}
              height={newShape.height}
              fill="rgba(0, 0, 0, 0.3)"
              stroke="black"
              strokeWidth={2}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas2D;
