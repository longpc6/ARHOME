import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Component Draggable
const Draggable = ({ children }) => {
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const [draggable, setDraggable] = useState(null); // Object đang được pick

  // Lọc để lấy parent object cấp cao nhất
  const getTopParent = (object) => {
    while (object.parent && object.parent.type !== "Scene") {
      object = object.parent;
    }
    return object;
  };

  // Hàm tính giao điểm
  const getIntersectedObjects = (event) => {
    // Lấy vị trí và kích thước của Canvas
    const rect = event.target.getBoundingClientRect();
  
    // Chuẩn hóa tọa độ chuột theo Canvas
    mouse.current.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
  
    // Tính raycaster từ tọa độ chuẩn hóa
    raycaster.current.setFromCamera(mouse.current, camera);
  
    // Trả về các object giao với raycaster
    return raycaster.current.intersectObjects(scene.children, true);
  };

  // Xử lý click chuột để chọn Object
  const handleMouseClick = (event) => {
    const intersects = getIntersectedObjects(event);

    console.log('Intersected Objects:', intersects);

    // Lọc các object có `userData.draggable`
    const draggableObjects = intersects
      .map((intersect) => getTopParent(intersect.object))
      .filter((obj) => obj.userData && obj.userData.draggable);

    if (draggable) {
      console.log('Dropping object:', draggable.name);
      setDraggable(null);
    } else if (draggableObjects.length > 0) {
      const pickedObject = draggableObjects[0];
      console.log('Picked object:', pickedObject.name);
      setDraggable(pickedObject);
    }
  };

  // Di chuyển Object
  const handleMouseMove = (event) => {
    if (!draggable) return;

    mouse.current.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.current.setFromCamera(mouse.current, camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectPoint = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, intersectPoint);

    if (intersectPoint) {
      draggable.position.x = intersectPoint.x;
      draggable.position.z = intersectPoint.z;
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [draggable]);

  return <>{children}</>;
};

// Component Model
const Model = ({ url }) => {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Đánh dấu là draggable
        scene.userData.draggable = true;

        // Debug Bounding Box
        const boxHelper = new THREE.BoxHelper(scene, 0xff0000);
        scene.add(boxHelper);
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1} />;
};

// Component chính
const EditableModelViewer = ({ modelUrl }) => {
  if (!modelUrl) {
    return <div style={{ textAlign: 'center', marginTop: '20px' }}>Chọn một mô hình để hiển thị</div>;
  }

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50 }}
      style={{ width: '100%', height: '500px' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <Suspense fallback={null}>
        <Draggable>
          <Model url={modelUrl} />
        </Draggable>
      </Suspense>
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

export default EditableModelViewer;
