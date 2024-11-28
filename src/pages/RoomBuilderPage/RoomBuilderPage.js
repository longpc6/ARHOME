import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Component để render mô hình GLTF
const Model = ({ url, position, scale = 1 }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={position} scale={scale} />;
};

// Component mô hình nội thất trong sidebar
const FurnitureItem = ({ model, onDragStart }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, model)}
    style={{
      border: '1px solid gray',
      padding: '10px',
      margin: '5px',
      cursor: 'grab',
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

  const userId = localStorage.getItem("userId");

  // Fetch architectural models (kiến trúc)
  useEffect(() => {
    const fetchArchitecturalModels = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/architectural-models`);
        setArchitecturalModels(response.data);
      } catch (error) {
        console.error('Error fetching architectural models:', error);
      }
    };

    fetchArchitecturalModels();
  }, []);

  // Fetch furniture models (nội thất) - dùng từ logic ProductPage
  useEffect(() => {
    const fetchFurnitureModels = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/products`);
        setFurnitureModels(response.data); // Chuyển data nội thất vào state
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

  // Upload architectural models
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!userId) {
      alert("Bạn cần đăng nhập để tải lên mô hình.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/upload-architectural-model`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Tải lên thành công!");
      setArchitecturalModels((prev) => [...prev, response.data]); // Cập nhật danh sách
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Tải lên thất bại!");
    }
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
      </div>

      {/* Canvas */}
      <div
        style={{ width: '80%', position: 'relative' }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />

          {/* Hiển thị mô hình kiến trúc được chọn */}
          {selectedArchitecture && <Model url={selectedArchitecture} position={[0, 0, 0]} />}

          {/* Hiển thị các đồ nội thất được thả vào */}
          {furnitureOnCanvas.map((item, index) => (
            <Model key={index} url={item.url} position={item.position} />
          ))}

          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default RoomBuilderPage;
