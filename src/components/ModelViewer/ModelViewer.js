import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ url, color, material }) => {
  const { scene } = useGLTF(url);
  const originalAttributes = useRef(new Map()); // Lưu trữ thuộc tính gốc của từng mesh

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const originalData = originalAttributes.current.get(child.uuid);

        // Lưu lại màu sắc và texture gốc nếu chưa lưu
        if (!originalData) {
          originalAttributes.current.set(child.uuid, {
            color: child.material.color.clone(),
            map: child.material.map,
          });
        }

        const { color: originalColor, map: originalMap } = originalAttributes.current.get(child.uuid);

        // Áp dụng màu sắc
        if (color === 'original') {
          child.material.color.copy(originalColor); // Khôi phục màu gốc
        } else {
          const colorMap = {
            'black-grey': new THREE.Color(0.1, 0.1, 0.1),
            'white-vanilla': new THREE.Color(1, 0.9, 0.8),
            brown: new THREE.Color(0.6, 0.4, 0.2),
          };
          child.material.color = colorMap[color] || originalColor;
        }

        // Áp dụng hoặc khôi phục texture
        if (material === 'original') {
          child.material.map = originalMap; // Khôi phục texture gốc
        } else {
          const textureMap = {
            wood: "/assets/textures/Wood049_8K-PNG_Color.png",
            metal: "/assets/textures/PaintedMetal005_4K-PNG_Displacement.png",
            diamond: "/assets/textures/DiamondPlate008C_8K-PNG_Roughness.png",
          };

          const texturePath = textureMap[material];
          if (texturePath) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(texturePath);
            child.material.map = texture;
          }
        }

        child.material.needsUpdate = true; // Đảm bảo cập nhật lại material
      }
    });
  }, [scene, color, material]);

  return <primitive object={scene} scale={1} />;
};


const ModelViewer = ({ modelUrl, color = 'original', material = 'original' }) => {
  return (
    <Canvas
      style={{ width: '100%', height: '500px' }}
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <Suspense fallback={null}>
        <Environment files="/assets/HDRIs/untitled.hdr" background />
        <Model url={modelUrl} color={color} material={material} />
      </Suspense>
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

export default ModelViewer;
