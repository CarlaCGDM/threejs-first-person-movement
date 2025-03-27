import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useNPCMovement } from './hooks/useNPCMovement';
import { useNPCActions } from './hooks/useNPCActions';
import { NPCDebug } from './visuals/NPCDebug';

export function NPCActor({
  path,
  speed = 0.5,
  rotationSpeed = 2,
  smoothness = 0.5,
  onPathComplete,
  color = 'hotpink',
  debug = true,
  propsData = []
}) {
  const [closestProp, setClosestProp] = useState(null);
  const lookAtTarget = useRef(null);
  const isRotating = useRef(false);

  const { isPerformingActions, startActions } = useNPCActions({
    onActionComplete: onPathComplete
  });

  const { groupRef } = useNPCMovement({
    path,
    speed,
    rotationSpeed,
    smoothness,
    lookAheadPoints: 5,
    onReachEnd: () => {
      startActions(5000);
      findClosestProp();
    }
  });

  // Smooth rotation towards target
  useFrame((_, delta) => {
    if (!groupRef.current || !lookAtTarget.current || !isPerformingActions) return;
    
    const targetPos = lookAtTarget.current;
    const npcPos = groupRef.current.position;
    
    // Calculate direction FROM PROP TO NPC (inverse of before)
    const direction = new THREE.Vector3()
      .subVectors(
        new THREE.Vector3(npcPos.x, 0, npcPos.z),
        new THREE.Vector3(targetPos.x, 0, targetPos.z)
      )
      .normalize();
    
    if (direction.length() > 0) {
      const targetQuat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // Default forward
        direction
      );
      
      groupRef.current.quaternion.slerp(targetQuat, 5 * delta);
    }
  });

  const findClosestProp = () => {
    if (!groupRef.current) {
      setClosestProp(null);
      return;
    }
    
    const npcPosition = groupRef.current.position;
    let closest = null;
    let minDistance = 10;
    
    propsData.forEach(prop => {
      const propPosition = new THREE.Vector3(...prop.position);
      const distance = npcPosition.distanceTo(propPosition);
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = prop;
      }
    });
    
    setClosestProp(closest);
    lookAtTarget.current = closest 
      ? new THREE.Vector3(...closest.position) 
      : null;
  };

  useEffect(() => {
    if (!isPerformingActions) {
      setClosestProp(null);
      lookAtTarget.current = null;
      isRotating.current = false;
    }
  }, [isPerformingActions]);

  const speechContent = closestProp 
    ? `I'm looking at the ${closestProp.artifactName}` 
    : "I'm just taking a look around!";

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.5, 1.6, 0.5]} />
        <meshStandardMaterial color={isPerformingActions ? 'purple' : color} />
      </mesh>

      {debug && (
        <>
          
          <NPCDebug 
            isPerformingActions={isPerformingActions} 
            speechContent={speechContent} 
          />
        </>
      )}
    </group>
  );
}