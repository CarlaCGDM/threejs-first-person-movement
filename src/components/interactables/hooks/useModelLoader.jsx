import { useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { CF_WORKER_URL } from "../../../config";

/**
 * A hook to load a 3D model, compute its size, and collect materials.
 * @param {string} modelUrl - The URL of the 3D model to load.
 * @param {function} onComputedSize - Callback to receive the computed size of the model.
 * @param {function} onMaterialsLoaded - Callback to receive the materials of the model.
 * @returns {object} - The loaded GLTF scene.
 */
export const useModelLoader = (modelUrl, onComputedSize, onMaterialsLoaded) => {
    
    const gltf = useGLTF(CF_WORKER_URL + modelUrl);

    useEffect(() => {
        if (gltf.scene) {
            // Compute the bounding box size
            const bbox = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            onComputedSize(size);

            // Collect materials for highlighting
            const materials = [];
            gltf.scene.traverse((child) => {
                if (child.isMesh && child.material) {
                    materials.push(child.material);
                }
            });
            onMaterialsLoaded(materials);
        }
    }, [gltf.scene, onComputedSize, onMaterialsLoaded]);

    return gltf.scene;
};