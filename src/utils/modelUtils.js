import * as THREE from "three";

/**
 * Clones and scales a 3D model.
 * @param {THREE.Object3D} model - The model to clone and scale.
 * @param {number} scale - The scale factor.
 * @param {THREE.Material} [material] - Optional material to apply to the model.
 * @returns {THREE.Object3D} - The cloned and scaled model.
 */
export const cloneAndScaleModel = (model, scale, material) => {
    const clone = model.clone();
    clone.scale.set(scale, scale, scale);
    if (material) {
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
            }
        });
    }
    return clone;
};