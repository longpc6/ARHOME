import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Component render mô hình GLTF
const Model = ({ url, position, scale = 1, onPointerDown }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} scale={scale} onPointerDown={onPointerDown} />;
};

// Component hiển thị item nội thất trong sidebar
const FurnitureItem = ({ model, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, model)}
    style={{
      border: '1px solid gray',
      padding: '10px',
      margin: '5px',
      cursor: 'grab',
      textAlign: 'center',
    }}
  >
    {model.name}
  </div>
);

const RoomBuilderPage = () => {
  const [architecturalModels, setArchitecturalModels] = useState([]);
  const [furnitureModels, setFurnitureModels] = useState([]);
  const [selectedArchitecture, setSelectedArchitecture] = useState(null);
  const [furnitureOnCanvas, setFurnitureOnCanvas] = useState([]);
  const [draggingModel, setDraggingModel] = useState(null);
  const [draggingPosition, setDraggingPosition] = useState([0, 0, 0]);

  const userId = localStorage.getItem('userId');

  // Fetch architectural models
  useEffect(() => {
    const fetchArchitecturalModels = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/architectures`);
        setArchitecturalModels(response.data);
      } catch (error) {
        console.error('Error fetching architectural models:', error);
      }
    };
    fetchArchitecturalModels();
  }, []);

  // Fetch furniture models
  useEffect(() => {
    const fetchFurnitureModels = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/furnitures`);
        setFurnitureModels(response.data);
      } catch (error) {
        console.error('Error fetching furniture models:', error);
      }
    };
    fetchFurnitureModels();
  }, []);

  // Drag furniture item
  const handleDragStart = (e, model) => {
    e.dataTransfer.setData('model', JSON.stringify(model));
  };

  // Drop furniture item vào canvas
  const handleDrop = (e) => {
    e.preventDefault();
    const model = JSON.parse(e.dataTransfer.getData('model'));
    const x = (e.clientX / window.innerWidth) * 10 - 5; // Map vị trí drop sang canvas
    const z = (e.clientY / window.innerHeight) * -10 + 5;
    setFurnitureOnCanvas((prev) => [...prev, { ...model, position: [x, 0, z] }]);
  };

  // Handle model dragging
  const handlePointerDown = (event, index) => {
    setDraggingModel(index); // Lưu lại chỉ mục của vật thể đang được kéo
    const { x, y, z } = furnitureOnCanvas[index].position;
    setDraggingPosition([x, y, z]); // Lưu lại vị trí ban đầu
  };

  const handlePointerMove = (event) => {
    if (draggingModel === null) return;

    const { x, z } = event.unprojectedPoint; // Dùng unprojectedPoint để tính vị trí trong không gian 3D
    setDraggingPosition([x, 0, z]); // Cập nhật vị trí mới của vật thể
  };

  const handlePointerUp = () => {
    if (draggingModel !== null) {
      setFurnitureOnCanvas((prev) => {
        const updatedFurniture = [...prev];
        updatedFurniture[draggingModel] = {
          ...updatedFurniture[draggingModel],
          position: draggingPosition,
        };
        return updatedFurniture;
      });
      setDraggingModel(null);
    }
  };

  // Upload architectural model
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const objectUrl = e.target.result; // URL của mô hình
      setArchitecturalModels((prev) => [
        ...prev,
        { name: file.name, url: objectUrl },
      ]);
      setSelectedArchitecture(objectUrl); // Tự động hiển thị mô hình vừa tải lên
    };
  
    reader.readAsDataURL(file); // Đọc file để tạo URL tạm
  };
  

  // Lưu mô hình kiến trúc (placeholder, bạn sẽ làm sau)
  const handleSaveArchitecture = () => {
    if (!selectedArchitecture) {
      alert('Không có mô hình kiến trúc nào được chọn để lưu.');
      return;
    }
    alert('Chức năng lưu đang được phát triển.');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '20%', borderRight: '1px solid gray', padding: '10px' }}>
        <h3>Mô hình kiến trúc</h3>
        {architecturalModels.map((model, index) => (
          <div
            key={index}
            style={{
              border: selectedArchitecture === model.url ? '2px solid blue' : '1px solid gray',
              padding: '10px',
              margin: '5px',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedArchitecture(model.url)}
          >
            {model.name}
          </div>
        ))}

        <h3>Mô hình nội thất</h3>
        {furnitureModels.map((model, index) => (
          <FurnitureItem key={index} model={model} onDragStart={handleDragStart} />
        ))}

        {/* Upload kiến trúc */}
        <div style={{ marginTop: '20px' }}>
          <h4>Tải lên mô hình kiến trúc</h4>
          <input type="file" onChange={handleFileUpload} />
        </div>

        {/* Nút lưu mô hình */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleSaveArchitecture} style={{ padding: '10px', width: '100%' }}>
            Lưu mô hình kiến trúc
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        style={{ width: '80%', position: 'relative' }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Canvas
          shadows
          camera={{ position: [0, 2, 5], fov: 50 }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />

          {/* Hiển thị mô hình kiến trúc được chọn */}
          {selectedArchitecture && <Model url={selectedArchitecture} position={[0, 0, 0]} />}

          {/* Hiển thị các đồ nội thất được thả vào */}
          {furnitureOnCanvas.map((item, index) => (
            <Model
              key={index}
              url={item.model_3d}
              position={draggingModel === index ? draggingPosition : item.position}
              onPointerDown={(e) => handlePointerDown(e, index)}
            />
          ))}

          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default RoomBuilderPage;
