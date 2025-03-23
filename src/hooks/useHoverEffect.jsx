import { useEffect, useState } from "react";
import * as THREE from "three";

/**
 * A hook to handle hover effects for 3D objects by modifying material properties.
 * @param {THREE.Material[]} materials - The materials of the 3D object.
 * @returns {[boolean, { onPointerOver: function, onPointerOut: function }]} - The hover state and event handlers.
 */
export const useHoverEffect = (materials) => {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (materials.length > 0) {
            materials.forEach((material) => {
                if (isHovered) {
                    // Increase emissive intensity for highlight effect
                    material.emissive = new THREE.Color(0xffffff);
                    material.emissiveIntensity = 0.5;
                } else {
                    // Reset emissive properties
                    material.emissive = new THREE.Color(0x000000);
                    material.emissiveIntensity = 0;
                }
                material.needsUpdate = true; // Ensure the material updates
            });
        }
    }, [isHovered, materials]);

    // Event handlers for hover
    const handlePointerOver = () => setIsHovered(true);
    const handlePointerOut = () => setIsHovered(false);

    return [isHovered, { onPointerOver: handlePointerOver, onPointerOut: handlePointerOut }];
};