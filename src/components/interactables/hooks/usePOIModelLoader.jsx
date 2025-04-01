import { useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

/**
 * Handles POI model loading, size calculation, and material management
 * @param {string} modelUrl - URL of the 3D model
 * @param {function} onComputedSize - Callback when size is calculated
 * @param {function} onMaterialsLoaded - Callback when materials are loaded
 * @param {THREE.Material} highlightMaterial - Material for hover state
 * @returns {THREE.Object3D} Loaded model scene
 */
export const usePOIModelLoader = (modelUrl, onComputedSize, onMaterialsLoaded, material) => {
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    if (!scene) return;

    // Calculate size
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    onComputedSize(size);

    // Apply materials
    const materials = [];
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = material || child.material;
        materials.push(child.material);
      }
    });
    onMaterialsLoaded(materials);

  }, [scene, onComputedSize, onMaterialsLoaded, material]);

  return { scene };
};