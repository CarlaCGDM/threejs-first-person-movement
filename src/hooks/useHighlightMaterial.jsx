import * as THREE from "three";
import { useMemo } from "react";

/**
 * A hook to create highlight and transparent materials.
 * @returns {{
 *   highlightedMaterial: THREE.Material,
 *   transparentMaterial: THREE.Material
 * }} - The highlight and transparent materials.
 */
export const useHighlightMaterial = () => {
    const highlightedMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide, // Ensure both sides are rendered
    }), []);

    const transparentMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide, // Ensure both sides are rendered
    }), []);

    return { highlightedMaterial, transparentMaterial };
};