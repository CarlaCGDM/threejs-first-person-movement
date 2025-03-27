import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function useNPCPropInteraction({
  groupRef,
  propsData,
  isPerformingActions
}) {
  const [closestProp, setClosestProp] = useState(null);
  const lookAtTarget = useRef(null);
  const isRotating = useRef(false);

  // Find closest prop (unchanged)
  const findClosestProp = () => {
    if (!groupRef.current) {
      setClosestProp(null);
      return;
    }
    
    const npcPos = groupRef.current.position;
    let closest = null;
    let minDistance = 3;
    
    propsData.forEach(prop => {
      const propPos = new THREE.Vector3(...prop.position);
      const distance = npcPos.distanceTo(propPos);
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = prop;
      }
    });
    
    setClosestProp(closest);
    lookAtTarget.current = closest ? new THREE.Vector3(...closest.position) : null;
  };

  // Vertical-axis-only rotation (fixed)
  useFrame((_, delta) => {
    if (!groupRef.current || !lookAtTarget.current || !isPerformingActions) return;

    const npcPos = groupRef.current.position;
    const targetPos = lookAtTarget.current;

    // Calculate direction on XZ plane only (ignoring Y axis)
    const direction = new THREE.Vector3()
      .subVectors(
        new THREE.Vector3(npcPos.x, 0, npcPos.z),
        new THREE.Vector3(targetPos.x, 0, targetPos.z)
      )
      .normalize();

    if (direction.length() > 0) {
      // Calculate target Y rotation only
      const targetYRotation = Math.atan2(direction.x, direction.z);
      const targetQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0), // Only rotate around Y axis
        targetYRotation
      );
      
      // Smooth rotation
      groupRef.current.quaternion.slerp(targetQuat, 5 * delta);
      isRotating.current = true;
    }
  });

  useEffect(() => {
    if (!isPerformingActions) {
      setClosestProp(null);
      lookAtTarget.current = null;
      isRotating.current = false;
    }
  }, [isPerformingActions]);

  return {
    closestProp,
    findClosestProp
  };
}