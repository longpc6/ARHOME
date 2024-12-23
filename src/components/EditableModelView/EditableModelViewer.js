import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

const Draggable = ({ children }) => {
  const { camera, scene, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const [activeObject, setActiveObject] = useState(null); // Object đang được pick
  const [mode, setMode] = useState('drag'); // Chế độ hiện tại: "drag" hoặc "rotate"

  const getTopParent = (object) => {
    while (object.parent && object.parent.type !== "Scene") {
      object = object.parent;
    }
    return object;
  };

  const getIntersectedObjects = (event) => {
    const rect = event.target.getBoundingClientRect();
    mouse.current.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.current.setFromCamera(mouse.current, camera);
    return raycaster.current.intersectObjects(scene.children, true);
  };

  const handleMouseClick = (event) => {
    const intersects = getIntersectedObjects(event);
    const draggableObjects = intersects
      .map((intersect) => getTopParent(intersect.object))
      .filter((obj) => obj.userData && obj.userData.draggable);

    if (draggableObjects.length > 0) {
      const pickedObject = draggableObjects[0];
      setActiveObject(pickedObject); // Set đối tượng để drag hoặc rotate
    } else {
      setActiveObject(null); // Bỏ chọn nếu click vào vùng khác
    }
  };

  const handleMouseMove = (event) => {
    if (!activeObject || mode !== 'drag') return;

    const rect = event.target.getBoundingClientRect();
    mouse.current.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.current.setFromCamera(mouse.current, camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -activeObject.position.y);
    const intersectPoint = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, intersectPoint);

    if (intersectPoint) {
      activeObject.position.x = intersectPoint.x;
      activeObject.position.z = intersectPoint.z;
    }
  };

  const handleKeyDown = (event) => {
    if (!activeObject) return;

    switch (event.key) {
      case 'R' || 'r': // Toggle chế độ giữa drag và rotate
        setMode(mode === 'drag' ? 'rotate' : 'drag');
        break;
      case 'Escape': // Hủy chọn object
        setActiveObject(null);
        break;
      default:
        if (mode === 'rotate') {
          switch (event.key) {
            case 'ArrowLeft': // Rotate left
              activeObject.rotation.y += 0.1;
              break;
            case 'ArrowRight': // Rotate right
              activeObject.rotation.y -= 0.1;
              break;
            case 'ArrowUp': // Rotate up
              activeObject.rotation.x += 0.1;
              break;
            case 'ArrowDown': // Rotate down
              activeObject.rotation.x -= 0.1;
              break;
            default:
              break;
          }
        }
    }
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('click', handleMouseClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('click', handleMouseClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeObject, mode]);

  return (
    <>
      <Html position={[0, 0, 0]} zIndexRange={[1, 0]}>
        {/* Hiện nút chỉ khi đã chọn object */}
        {activeObject && (
          <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
            <button
              onClick={() => setMode(mode === 'drag' ? 'rotate' : 'drag')}
              style={{
                backgroundColor: mode === 'drag' ? '#333' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '5px 10px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#000')}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = mode === 'drag' ? '#333' : '#555')
              }
            >
              {mode === 'drag' ? 'Switch to Rotate' : 'Switch to Drag'}
            </button>
          </div>
        )}
      </Html>
      {children}
    </>
  );
};

const centerModelToOrigin = (object) => {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);
};

const ArchitectureModel = ({ url }) => {
  const { scene } = useGLTF(url);

  useEffect(() => {
    centerModelToOrigin(scene);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
};

const FurnitureModel = ({ model }) => {
  const { scene } = useGLTF(model.model_3d);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        scene.userData.draggable = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1} position={model.position} />;
};

const EditableModelViewer = ({ modelUrl, furnitureModels }) => {
  furnitureModels = furnitureModels || [];

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
      <gridHelper args={[10, 10]} position={[0, 0, 0]} />
      <Suspense fallback={<mesh><boxGeometry /><meshBasicMaterial color="gray" /></mesh>}>
        <Draggable>
          {modelUrl && <ArchitectureModel url={modelUrl} />}
          {furnitureModels.map((furniture, index) => (
            <FurnitureModel key={index} model={furniture} />
          ))}
        </Draggable>
      </Suspense>
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};

export default EditableModelViewer;
