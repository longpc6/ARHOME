// src/components/ModelViewer.js
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

const Model = ({ url }) => {
  const { scene } = useGLTF(url); // Load model từ URL
  return <primitive object={scene} scale={1} />;
};

const ModelViewer = ({ modelUrl }) => {
  return (
    <Canvas 
      style={{ width: '100%', height: '500px' }}
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      {/* Thêm ánh sáng môi trường và directional light */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      
      {/* Nếu có HDRI, dùng Environment để chiếu sáng */}
      <Suspense fallback={null}>
        <Environment files="/assets/HDRIs/untitled.hdr" background />
        <Model url={modelUrl} />
      </Suspense>

      {/* Điều chỉnh OrbitControls cho phép xoay mô hình */}
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

export default ModelViewer;
