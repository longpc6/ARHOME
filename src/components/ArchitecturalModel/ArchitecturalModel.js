import React from 'react';
import { useGLTF } from '@react-three/drei';

const ArchitecturalModel = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
};

export default ArchitecturalModel;
