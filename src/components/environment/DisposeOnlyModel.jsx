import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export default function DisposeOnlyModel({ modelUrl }) {
  const gltf = useGLTF(modelUrl); // Needed to access the original scene

  useEffect(() => {
    // Clean up meshes and materials
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose?.();
        if (Array.isArray(child.material)) {
          child.material.forEach(disposeMaterial);
        } else {
          disposeMaterial(child.material);
        }
      }
    });

    // Clear from cache
    useGLTF.clear(modelUrl);
  }, [modelUrl]);

  return null;
}

function disposeMaterial(material) {
    if (material.isMaterial) {
      for (const key in material) {
        const value = material[key];
        if (value && typeof value.dispose === 'function') {
          value.dispose();
        }
      }
      material.dispose();
    }
  }
  