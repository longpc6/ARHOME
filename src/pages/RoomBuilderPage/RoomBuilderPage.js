import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditableModelViewer from '../../components/EditableModelView/EditableModelViewer.js';
import "./RoomBuilderPage.css";

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

  useEffect(() => {
    if (architecturalModels.length > 0) {
      setSelectedArchitecture(architecturalModels[0].url);
    }
  }, [architecturalModels]);

  const handleDragStart = (e, model) => {
    e.dataTransfer.setData('model', JSON.stringify(model));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const model = JSON.parse(e.dataTransfer.getData('model'));
    console.log('Model:', model);
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 10 - 5;
    const z = ((e.clientY - rect.top) / rect.height) * -10 + 5;
    setFurnitureOnCanvas((prev) => [...prev, { ...model, position: [x, 0, z] }]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || (!file.name.endsWith('.gltf') && !file.name.endsWith('.glb'))) {
      alert('Vui lòng tải lên tệp GLTF hoặc GLB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const objectUrl = e.target.result;
      setArchitecturalModels((prev) => [...prev, { name: file.name, url: objectUrl }]);
      setSelectedArchitecture(objectUrl);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', padding: '80px 20px' }}>
      <div style={{ display: 'absolute', width: '20%', borderRight: '2px solid gray', padding: '20px' }}>
        <h3>Mô hình kiến trúc</h3>
        {architecturalModels.length === 0 ? (
          <p>Không có mô hình nào để hiển thị.</p>
        ) : (
          architecturalModels.map((model, index) => (
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
          ))
        )}

        <h3>Mô hình nội thất</h3>
        {furnitureModels.length === 0 ? (
          <p>Không có mô hình nào để hiển thị.</p>
        ) : (
          furnitureModels.map((model, index) => (
            <FurnitureItem key={index} model={model} onDragStart={handleDragStart} />
          ))
        )}

        <div style={{ marginTop: '20px' }}>
          <h4>Tải lên mô hình kiến trúc</h4>
          <input type="file" onChange={handleFileUpload} />
        </div>
      </div>

      <div
        style={{ width: '80%', position: 'relative' }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <EditableModelViewer
          modelUrl={selectedArchitecture || ''}
          furnitureModels={furnitureOnCanvas || []}
        />
      </div>
    </div>
  );
};

export default RoomBuilderPage;
