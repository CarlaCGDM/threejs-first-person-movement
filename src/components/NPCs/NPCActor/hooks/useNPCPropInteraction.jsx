import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function useNPCPropInteraction({
  groupRef,
  propsData = [],
  poisData = [],
  isPerformingActions
}) {
  const [closestTarget, setClosestTarget] = useState(null);
  const lookAtTarget = useRef(null);
  const isRotating = useRef(false);

  // Unified target finding (props take priority)
  const findClosestTarget = () => {
    if (!groupRef.current) {
      setClosestTarget(null);
      return;
    }

    const npcPos = groupRef.current.position;
    let closest = null;
    let minDistance = 3; // meters

    // Check props first (higher priority)
    propsData.forEach(prop => {
      const propPos = new THREE.Vector3(...prop.position);
      const distance = npcPos.distanceTo(propPos);
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = { ...prop, type: 'prop' }; // Mark as prop
      }
    });

    // Only check POIs if no props found
    if (!closest) {
      poisData.forEach(poi => {
        const poiPos = new THREE.Vector3(...poi.position);
        const distance = npcPos.distanceTo(poiPos);
        
        if (distance < minDistance) {
          minDistance = distance;
          closest = { ...poi, type: 'poi' }; // Mark as poi
        }
      });
    }

    setClosestTarget(closest);
    lookAtTarget.current = closest 
      ? new THREE.Vector3(...closest.position)
      : null;
  };

  // Rotation logic (unchanged)
  useFrame((_, delta) => {
    if (!groupRef.current || !lookAtTarget.current || !isPerformingActions) return;

    const npcPos = groupRef.current.position;
    const targetPos = lookAtTarget.current;

    const direction = new THREE.Vector3()
      .subVectors(
        new THREE.Vector3(npcPos.x, 0, npcPos.z),
        new THREE.Vector3(targetPos.x, 0, targetPos.z)
      )
      .normalize();

    if (direction.length() > 0) {
      const targetYRotation = Math.atan2(direction.x, direction.z);
      const targetQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        targetYRotation
      );
      
      groupRef.current.quaternion.slerp(targetQuat, 5 * delta);
      isRotating.current = true;
    }
  });

  useEffect(() => {
    if (!isPerformingActions) {
      setClosestTarget(null);
      lookAtTarget.current = null;
      isRotating.current = false;
    }
  }, [isPerformingActions]);

  return {
    closestTarget, // Now contains either prop or poi
    findClosestTarget
  };
}