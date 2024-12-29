import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const Draggable = ({ children }) => {
  const { camera, scene, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const [activeObject, setActiveObject] = useState(null); // Object đang được pick
  const [mode, setMode] = useState('drag'); // Chế độ hiện tại: "drag", "rotate" hoặc "scale"

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
      case 'R':
      case 'r':// Toggle chế độ giữa drag và rotate
        setMode((prev) => (prev === 'drag' ? 'rotate' : prev === 'rotate' ? 'scale' : 'drag'));
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
        else if (mode === 'scale') {
          switch (event.key) {
            case 'ArrowUp': // Tăng kích thước
              activeObject.scale.multiplyScalar(1.1);
              break;
            case 'ArrowDown': // Giảm kích thước
              activeObject.scale.multiplyScalar(0.9);
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
              onClick={() => setMode((prev) => (prev === 'drag' ? 'rotate' : prev === 'rotate' ? 'scale' : 'drag'))}
              style={{
                backgroundColor: mode === 'drag' ? '#333' : mode === 'rotate' ? '#555' : '#777',
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
              (e.target.style.backgroundColor =
                mode === 'drag' ? '#333' : mode === 'rotate' ? '#555' : '#777')
              }
            >
              {mode === 'drag' ? 'Drag\n(Switch to Rotate)' : mode === 'rotate' ? 'Rotate\n(Switch to Scale)' : 'Scale\n(Switch to Drag)'}
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
  // Dịch chuyển tâm về gốc trên mặt phẳng xz
  object.position.x -= center.x;
  object.position.z -= center.z;

  // Dịch chuyển đáy vật thể để chạm vào mặt phẳng Oxz
  object.position.y -= box.min.y;
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
    centerModelToOrigin(scene);

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

const WASDControls = (isActive) => {
  const { camera } = useThree();
  var player = { height: 1.8, speed: 2, turnSpeed: Math.PI * 0.02 };
  const keys = useRef({});

  useEffect(() => {
    if(!isActive)
      return;
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    // Lấy hướng nhìn hiện tại của camera
    const vector = new THREE.Vector3();
    camera.getWorldDirection(vector);

    // Tính góc theo trục Y (phẳng x-z)
    const Y_angle = Math.atan2(vector.x, vector.z);


    if (keys.current['w']) {
      camera.position.x -= Math.sin(Y_angle) * player.speed;
      camera.position.z -= -Math.cos(Y_angle) * player.speed;
      // camera.position.z -= 0.1;
    }
    if (keys.current['s']) {
      camera.position.x += Math.sin(Y_angle) * player.speed;
      camera.position.z += -Math.cos(Y_angle) * player.speed;
      // camera.position.z += 0.1;
    }
    if (keys.current['a']) {
      camera.position.x += Math.sin(Y_angle + Math.PI / 2) * player.speed;
      camera.position.z += -Math.cos(Y_angle + Math.PI / 2) * player.speed;
      // camera.position.x -= 0.1;
    }
    if (keys.current['d']) {
      camera.position.x += Math.sin(Y_angle - Math.PI / 2) * player.speed;
      camera.position.x += Math.sin(Y_angle - Math.PI / 2) * player.speed;
      // camera.position.x += 0.1;
    }
  });

  return null;
};

// Custom FirstPersonControls
const CustomFirstPersonControls = ({ isActive }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    controlsRef.current = new FirstPersonControls(camera, gl.domElement);
    controlsRef.current.lookSpeed = 0.25;
    controlsRef.current.movementSpeed = 100;
    controlsRef.current.autoForward = false;
    controlsRef.current.activeLook = true;
    controlsRef.current.mouseDragOn = true;
    controlsRef.current.lookVeritcal = false;

    return () => controlsRef.current.dispose();
  }, [camera, gl]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = isActive;
    }
  }, [isActive]);

  useFrame((_, delta) => {
    if (controlsRef.current?.enabled) {
      controlsRef.current.update(delta);
    }
  });

  return null;
};

// CustomPointerLockControls Component
const CustomPointerLockControls = ({ isActive }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const velocity = useRef([0, 0, 0]); // Lưu vận tốc
  const keys = { w: false, a: false, s: false, d: false };
  const speed = 0.1;

  // Cập nhật vận tốc dựa trên phím bấm
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (keys.hasOwnProperty(event.key)) keys[event.key] = true;
    };

    const handleKeyUp = (event) => {
      if (keys.hasOwnProperty(event.key)) keys[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    controlsRef.current = new PointerLockControls(camera, gl.domElement);

    if (isActive) {
      controlsRef.current.lock();
    } else {
      controlsRef.current.unlock();
    }

    return () => controlsRef.current.dispose();
  }, [isActive, camera, gl]);

  // Di chuyển camera trong vòng lặp frame
  useFrame(() => {
    if (!controlsRef.current || !isActive) return;

    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3();
    const sideways = new THREE.Vector3();

    // Lấy hướng di chuyển
    controlsRef.current.getDirection(forward);
    sideways.crossVectors(camera.up, forward).normalize();

    // Cập nhật vận tốc dựa trên phím bấm
    velocity.current[0] =
      (keys.w ? -1 : 0) + (keys.s ? 1 : 0) * speed;
    velocity.current[2] =
      (keys.a ? -1 : 0) + (keys.d ? 1 : 0) * speed;

    // Áp dụng vận tốc
    camera.position.addScaledVector(forward, velocity.current[0]);
    camera.position.addScaledVector(sideways, velocity.current[2]);
  });

  return null;
};

const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
    <planeGeometry args={[50, 50]} />
    <meshStandardMaterial color="lightgray" />
  </mesh>
);

const CombinedControls = ({ isActive }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const pointerLockControlsRef = useRef();
  const velocity = useRef([0, 0, 0]);
  const keys = { w: false, a: false, s: false, d: false };
  const speed = 0.1;

  useEffect(() => {
    controlsRef.current = new FirstPersonControls(camera, gl.domElement);
    controlsRef.current.lookSpeed = 0.25;
    controlsRef.current.movementSpeed = 100;
    controlsRef.current.autoForward = true;
    controlsRef.current.activeLook = true;
    controlsRef.current.mouseDragOn = true;
    controlsRef.current.lookVertical = false;

    pointerLockControlsRef.current = new PointerLockControls(camera, gl.domElement);

    return () => {
      controlsRef.current.dispose();
      pointerLockControlsRef.current.dispose();
    };
  }, [camera, gl]);

  useEffect(() => {
    if (isActive) {
      pointerLockControlsRef.current.lock();
    } else {
      pointerLockControlsRef.current.unlock();
    }
  }, [isActive]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (keys.hasOwnProperty(event.key)) keys[event.key] = true;
    };

    const handleKeyUp = (event) => {
      if (keys.hasOwnProperty(event.key)) keys[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (isActive) {
      // PointerLockControls for movement
      const direction = new THREE.Vector3();
      const forward = new THREE.Vector3();
      const sideways = new THREE.Vector3();

      pointerLockControlsRef.current.getDirection(forward);
      sideways.crossVectors(camera.up, forward).normalize();

      velocity.current[0] =
        (keys.w ? -1 : 0) + (keys.s ? 1 : 0) * speed;
      velocity.current[2] =
        (keys.a ? -1 : 0) + (keys.d ? 1 : 0) * speed;

      camera.position.addScaledVector(forward, velocity.current[0]);
      camera.position.addScaledVector(sideways, velocity.current[2]);

      // FirstPersonControls for camera rotation
      controlsRef.current.update(delta);
    }
  });

  return null;
};

const EditableModelViewer = ({ modelUrl, furnitureModels }) => {
  furnitureModels = furnitureModels || [];

  const [isFirstPerson, setIsFirstPerson] = useState(false);

  // Lắng nghe phím "F" để bật/tắt chế độ
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.toLowerCase() === 'f') {
        setIsFirstPerson((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!modelUrl) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        Chọn một mô hình để hiển thị
      </div>
    );
  }

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 75 }}
      style={{ width: '100%', height: '500px' }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      {/* <gridHelper args={[10, 10]} position={[0, 0, 0]} /> */}
      <Floor />
      <Suspense fallback={<mesh><boxGeometry /><meshBasicMaterial color="gray" /></mesh>}>
        <Draggable>
          {modelUrl && <ArchitectureModel url={modelUrl} />}
          {furnitureModels.map((furniture, index) => (
            <FurnitureModel key={index} model={furniture} />
          ))}
        </Draggable>
      </Suspense>
      {/* PointerLockControls */}
      <CustomFirstPersonControls isActive={isFirstPerson}/>
      {/* OrbitControls - Disabled in First-Person Mode */}
      {!isFirstPerson && <OrbitControls enableZoom={true} />}
    </Canvas>
  );
};

export default EditableModelViewer;
