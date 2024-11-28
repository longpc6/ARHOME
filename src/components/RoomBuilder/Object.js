import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Object({ modelUrl, position, scale }) {
  const model = useLoader(GLTFLoader, modelUrl);
  return <primitive object={model.scene} position={position} scale={scale} />;
}

export default Object;
