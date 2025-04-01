import { useState } from "react";
import * as THREE from "three";

/**
 * Loads LOD models and manages their shared state
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

  const models = {
    low: useModelLoader(`${baseUrl}/LOD_00.glb`, setSize, setMaterials),
    mid: useModelLoader(`${baseUrl}/LOD_01.glb`, setSize, setMaterials),
    high: useModelLoader(`${baseUrl}/LOD_02.glb`, setSize, setMaterials)
  };

  return { models, size, materials };
};