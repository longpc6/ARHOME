import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Component cho mô hình
const DraggableModel = ({ url, color, material, position, onUpdatePosition }) => {
  const { scene } = useGLTF(url);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Thay đổi màu sắc
        if (color) {
          const colorMap = {
            original: new THREE.Color(1, 1, 1),
            'black-grey': new THREE.Color(0.1, 0.1, 0.1),
            'white-vanilla': new THREE.Color(1, 0.9, 0.8),
            brown: new THREE.Color(0.6, 0.4, 0.2),
          };
          child.material.color = colorMap[color] || new THREE.Color(1, 1, 1);
        }

        // Thay đổi vật liệu
        if (material) {
          const textureMap = {
            wood: '/textures/wood_texture.jpg',
            metal: '/textures/metal_texture.jpg',
            glass: '/textures/glass_texture.jpg',
          };

          const texturePath = textureMap[material];
          if (texturePath) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(texturePath);
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, color, material]);

  useFrame((state) => {
    if (isDragging) {
      // Lấy vị trí của chuột trong không gian 3D
      const [x, y, z] = position;
      const vector = new THREE.Vector3();
      state.raycaster.setFromCamera(state.mouse, state.camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = state.raycaster.ray.intersectPlane(plane, vector);

      if (intersection) {
        onUpdatePosition([intersection.x, y, intersection.z]);
      }
    }
  });

  return (
    <primitive
      object={scene}
      position={position}
      scale={1}
      onPointerDown={(e) => {
        e.stopPropagation();
        setIsDragging(true);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        setIsDragging(false);
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        if (isDragging) {
          document.body.style.cursor = 'grabbing';
        } else {
          document.body.style.cursor = 'default';
        }
      }}
    />
  );
};

// EditableModelViewer
const EditableModelViewer = ({ modelUrl, color = 'original', material = 'original' }) => {
  const [modelPosition, setModelPosition] = useState([0, 0, 0]);

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
        <DraggableModel
          url={modelUrl}
          color={color}
          material={material}
          position={modelPosition}
          onUpdatePosition={setModelPosition}
        />
      </Suspense>
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

export default EditableModelViewer;
