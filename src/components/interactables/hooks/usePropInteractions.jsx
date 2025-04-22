import { useCursor } from "@react-three/drei";
import { useState, useEffect } from "react";
import * as THREE from "three";

/**
 * Handles all prop interactions (hover, click) with material effects
 * @param {THREE.Material[]} materials - Materials to affect on hover
 * @param {function} dispatch - Settings context dispatcher
 * @param {string} artifactName - Prop identifier
 * @param {Object} metadata - Additional prop data
 * @param {string} detailedModelFile - High-res model path
 * @param {THREE.Vector3} size - Prop dimensions
 * @returns {{
 *   isHovered: boolean,
 *   interactionHandlers: { onPointerOver: function, onPointerOut: function, onClick: function }
 * }}
 */
export const usePropInteractions = (materials, dispatch, artifactName, commonName, infoViewRotation, metadata, detailedModelFile, imageFiles, size) => {
  const [isHovered, setIsHovered] = useState(false);
  useCursor(isHovered);

  // Reuse your existing hover effect logic
  useEffect(() => {
    if (materials.length > 0) {
      materials.forEach((material) => {
        material.emissive = new THREE.Color(isHovered ? 0xffffff : 0x000000);
        material.emissiveIntensity = isHovered ? 0.5 : 0;
        material.needsUpdate = true;
      });
    }
  }, [isHovered, materials]);

  const handlePointerOver = () => setIsHovered(true);
  const handlePointerOut = () => setIsHovered(false);

  const onClick = () => {
    dispatch({
      type: "SELECT_PROP",
      payload: { artifactName, commonName, metadata, infoViewRotation, detailedModelFile, imageFiles, size },
    });
    dispatch({
      type: "SET_VISITED_PROP",
      payload: { propName: artifactName, visited: true }
    });
  };

  return { 
    isHovered,
    interactionHandlers: { 
      onPointerOver: handlePointerOver, 
      onPointerOut: handlePointerOut,
      onClick 
    }
  };
};