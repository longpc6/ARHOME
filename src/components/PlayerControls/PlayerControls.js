import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import gsap from "gsap";

function Model({ url, mtlUrl, materialOptions }) {
  const [progress, setProgress] = useState(0);
  const objRef = useRef();

  useEffect(() => {
    const fileExtension = url.split(".").pop().toLowerCase();

    if (fileExtension === "obj" && mtlUrl) {
      const mtlLoader = new MTLLoader();
      mtlLoader.load(
        mtlUrl,
        (materials) => {
          materials.preload();
          const objLoader = new OBJLoader();
          objLoader.setMaterials(materials);
          objLoader.load(
            url,
            (obj) => {
              objRef.current.add(obj);
            },
            (xhr) => {
              setProgress((xhr.loaded / xhr.total) * 100);
            },
            undefined,
            (error) => {
              console.error("Error loading OBJ file with MTL:", error);
            }
          );
        },
        undefined,
        (error) => {
          console.error("Error loading MTL file:", error);
        }
      );
    } else if (fileExtension === "obj") {
      const objLoader = new OBJLoader();
      objLoader.load(
        url,
        (obj) => {
          objRef.current.add(obj);
        },
        (xhr) => {
          setProgress((xhr.loaded / xhr.total) * 100);
        },
        undefined,
        (error) => {
          console.error("Error loading OBJ file:", error);
        }
      );
    } else if (fileExtension === "gltf" || fileExtension === "glb") {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        url,
        (gltf) => {
          objRef.current.add(gltf.scene);
        },
        (xhr) => {
          setProgress((xhr.loaded / xhr.total) * 100);
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF/GLB file:", error);
        }
      );
    } else {
      console.error("Unsupported file format:", fileExtension);
    }
  }, [url, mtlUrl]);

  useEffect(() => {
    // Thay đổi màu sắc hoặc texture
    if (objRef.current && materialOptions) {
      objRef.current.traverse((child) => {
        if (child.isMesh) {
          if (materialOptions.texture) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
              materialOptions.texture,
              (texture) => {
                child.material.map = texture;
                child.material.color.set("#ffffff"); // Reset màu để không bị ảnh hưởng
                child.material.needsUpdate = true;
              },
              undefined,
              (error) => {
                console.error("Error loading texture:", error);
              }
            );
          } else {
            child.material.map = null; // Bỏ texture
            child.material.color.set(materialOptions.color);
          }
          child.material.needsUpdate = true;
        }
      });
    }
  }, [materialOptions]);

  return (
    <>
      {progress < 100 && (
        <Html center>
          <div style={{ textAlign: "center", color: "white" }}>
            <div style={{ marginBottom: "10px" }}>Loading: {Math.round(progress)}%</div>
            <div
              style={{
                width: "200px",
                height: "10px",
                backgroundColor: "#444",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: "#4caf50",
                }}
              ></div>
            </div>
          </div>
        </Html>
      )}
      <group ref={objRef} />
    </>
  );
}

export default function ModelViewer({ modelUrl, mtlUrl }) {
  const [materialOptions, setMaterialOptions] = useState({
    color: "#ffffff",
    metalness: 0.5, // Độ kim loại
    roughness: 0.5, // Độ nhám
  });
  const cameraRef = useRef();
  const [isTour, setIsTour] = useState(false);

  // Bắt đầu tour ảo
  const startTour = () => {
    setIsTour(true);
    gsap.to(cameraRef.current.position, {
      x: 0,
      y: 5,
      z: 10,
      duration: 2,
      onComplete: () => {
        gsap.to(cameraRef.current.position, {
          x: 10,
          y: 5,
          z: 0,
          duration: 3,
          repeat: -1,
          yoyo: true,
        });
      },
    });
  };

  const handleColorChange = (event) => {
    setMaterialOptions((prev) => ({
      ...prev,
      color: event.target.value,
      texture: null, // Xóa texture nếu đổi sang màu
    }));
  };

  const handleTextureChange = (event) => {
    setMaterialOptions((prev) => ({
      ...prev,
      texture: URL.createObjectURL(event.target.files[0]), // Lấy URL từ file
    }));
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Canvas hiển thị mô hình */}
      <div style={{ flex: 1 }}>
        <Canvas shadows>
          <Environment files="assets/HDRIs/untitled.hdr" background />
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 10]} castShadow />
          <PerspectiveCamera makeDefault position={[0, 2, 5]} ref={cameraRef} />
          <Suspense
            fallback={
              <Html center>
                <span style={{ color: "white" }}>Loading...</span>
              </Html>
            }
          >
            <Model url={modelUrl} mtlUrl={mtlUrl} materialOptions={materialOptions} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>

      {/* Giao diện tùy chỉnh */}
      <div style={{ width: "300px", padding: "10px", backgroundColor: "#f0f0f0" }}>
        <h3>Customize Model</h3>
        <label>
          Color:
          <input
            type="color"
            value={materialOptions.color}
            onChange={handleColorChange}
            style={{ marginLeft: "10px", display: "block" }}
          />
        </label>
        <label>
          Texture:
          <input
            type="file"
            accept="image/*"
            onChange={handleTextureChange}
            style={{ marginTop: "10px" }}
          />
        </label>
        <button
          onClick={startTour}
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Virtual Tour
        </button>
      </div>
    </div>
  );
}
