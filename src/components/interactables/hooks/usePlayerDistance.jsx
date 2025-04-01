import { useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

let frameCount = 0;

/**
 * Tracks distance between a position and the player, with frame skipping for performance
 * @param {number[]} position - [x, y, z] world position
 * @param {React.Ref} playerRef - Reference to player object
 * @param {number} [threshold=5] - Distance threshold for "nearby" state
 * @param {number} [frameSkip=5] - Only calculate every N frames
 * @returns {number} Current distance to player
 */
export const usePlayerDistance = (position, playerRef, threshold = 5, frameSkip = 5) => {
  const [distance, setDistance] = useState(Infinity);
  const positionVec = new THREE.Vector3(...position);

  useFrame(() => {
    if (!playerRef?.current) return;
    if (frameCount++ % frameSkip !== 0) return;

    const currentDistance = positionVec.distanceTo(playerRef.current.position);
    const isNearby = currentDistance <= threshold;
    const wasNearby = distance <= threshold;

    if (isNearby !== wasNearby) {
      setDistance(currentDistance);
    }
  });

  return distance;
};