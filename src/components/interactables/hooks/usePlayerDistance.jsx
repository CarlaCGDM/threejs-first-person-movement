import { useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/**
 * Tracks distance between a position and the player, with frame skipping for performance
 * @param {number[] | undefined} position - [x, y, z] world position or undefined
 * @param {React.Ref} playerRef - Reference to player object
 * @param {number} [threshold=5] - Distance threshold for "nearby" state
 * @param {number} [frameSkip=5] - Only calculate every N frames
 * @returns {number} Current distance to player
 */
export const usePlayerDistance = (position, playerRef, threshold = 5, frameSkip = 5) => {
  const [distance, setDistance] = useState(Infinity);
  const frameCountRef = useRef(0);

  useFrame(() => {
    // Safety check for position and player existence
    if (!position || !playerRef?.current?.position) return;
    
    // Frame skipping for performance
    frameCountRef.current += 1;
    if (frameCountRef.current % frameSkip !== 0) return;

    // Create vector from position only when needed (inside useFrame)
    const positionVec = new THREE.Vector3(position[0] || 0, position[1] || 0, position[2] || 0);
    const currentDistance = positionVec.distanceTo(playerRef.current.position);
    
    const isNearby = currentDistance <= threshold;
    const wasNearby = distance <= threshold;

    if (isNearby !== wasNearby) {
      setDistance(currentDistance);
    }
  });

  return distance;
};