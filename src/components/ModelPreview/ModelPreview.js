// src/components/ModelPreview/ModelPreview.js
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const ModelPreview = ({ modelUrl }) => {
  const { scene } = useGLTF(modelUrl);
  const [hovered, setHovered] = useState(false);

  return (
    <Canvas 
      style={{ width: '100%', height: '250px' }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <ambientLight intensity={0.3} />
      {hovered && <pointLight position={[10, 10, 10]} />}
      <primitive object={scene} scale={1} rotation={[0.2, 1, 0]} />
      {hovered && <OrbitControls />}
    </Canvas>
  );
};

export default ModelPreview;
