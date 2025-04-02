import { useState, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

/**
 * Loads LOD models with priority for low resolution model
 * @param {string} baseUrl - Base path to models (without LOD suffix)
 * @param {function} useModelLoader - Your existing model loader hook
 * @returns {{
 *   models: { low: Object, mid: Object, high: Object },
 *   size: THREE.Vector3,
 *   materials: THREE.Material[]
 * }}
 */
export const useLODModels = (baseUrl, useModelLoader) => {
  const [size, setSize] = useState(new THREE.Vector3(1, 1, 1));
  const [materials, setMaterials] = useState([]);

  // Preload low-res model first to give it priority
  useEffect(() => {
    // Preload low resolution model with priority
    useGLTF.preload(`${baseUrl}/LOD_00.glb`);
    
    // Small delay before loading higher resolution models
    const timer = setTimeout(() => {
      useGLTF.preload(`${baseUrl}/LOD_01.glb`);
      useGLTF.preload(`${baseUrl}/LOD_02.glb`);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [baseUrl]);

  // Always call all model loaders (don't conditionally use hooks)
  const lowModel = useModelLoader(`${baseUrl}/LOD_00.glb`, setSize, setMaterials);
  const midModel = useModelLoader(`${baseUrl}/LOD_01.glb`, setSize, setMaterials);
  const highModel = useModelLoader(`${baseUrl}/LOD_02.glb`, setSize, setMaterials);
  
  const models = { low: lowModel, mid: midModel, high: highModel };

  return { models, size, materials };
};