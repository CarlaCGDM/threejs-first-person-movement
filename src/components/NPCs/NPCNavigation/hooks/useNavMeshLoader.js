import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useMemo } from 'react';

export function useNavMeshLoader(path) {
  const gltf = useLoader(GLTFLoader, path);
  
  const navMesh = useMemo(() => {
    let mesh = null;
    gltf.scene.traverse((node) => {
      if (node.isMesh) mesh = node;
    });
    return mesh;
  }, [gltf]);

  return navMesh;
}