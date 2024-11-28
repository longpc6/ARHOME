import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Canvas3D = ({ modelPath }) => {
  // Kiểm tra xem có mô hình được tải lên không
  if (!modelPath) {
    return <div>Vui lòng tải lên một mô hình để trình diễn.</div>;
  }

  // Tải mô hình GLTF
  const Model = () => {
    const { scene } = useGLTF(modelPath); // modelPath là đường dẫn đến file GLB
    return <primitive object={scene} scale={0.5} />;
  };

  return (
    <Canvas camera={{ position: [10, 15, 20], fov: 50 }}>
      {/* Ánh sáng */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Hiển thị mô hình */}
      <Model />

      {/* Điều khiển camera */}
      <OrbitControls />
    </Canvas>
  );
};

export default Canvas3D;
