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
export const useLowResModel = (baseUrl, useModelLoader) => {
  const [size, setSize] = useState(new THREE.Vector3(1, 1, 1));
  const [materials, setMaterials] = useState([]);

  const lowres = useModelLoader(`${baseUrl}/LOD_00.glb`, setSize, setMaterials)

  return lowres;
};