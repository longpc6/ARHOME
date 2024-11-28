import React, { useState } from 'react';
import ModelViewer from '../../components/ModelViewer/ModelViewer';
import './ModelViewerPage.css';

const ModelViewerPage = () => {
  const [modelPath, setModelPath] = useState(null); // Đường dẫn file 3D được tải lên

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setModelPath(objectURL);
    }
  };

  return (
    <div className="model-viewer-page">
      <h1>Trình diễn mô hình 3D</h1>
      <input
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileUpload}
        className="file-input"
      />
      {modelPath ? (
        <ModelViewer modelPath={modelPath} />
      ) : (
        <p>Vui lòng tải lên một mô hình để xem.</p>
      )}
    </div>
  );
};

export default ModelViewerPage;
