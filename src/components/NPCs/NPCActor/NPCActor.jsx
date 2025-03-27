import { useState, useEffect } from 'react';
import * as THREE from 'three';
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
      startActions(5000); // Start 5-second action period
      findClosestProp(); // Single check when stopping
    }
  });

  const findClosestProp = () => {
    if (!groupRef.current) return;
    
    const npcPosition = new THREE.Vector3();
    groupRef.current.getWorldPosition(npcPosition);
    
    let closest = null;
    let minDistance = 3; // Max detection distance
    
    propsData.forEach(prop => {
      const propPosition = new THREE.Vector3(...prop.position);
      const distance = npcPosition.distanceTo(propPosition);
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = prop;
      }
    });
    
    setClosestProp(closest);
  };

  // Reset closest prop when starting to move again
  useEffect(() => {
    if (!isPerformingActions) {
      setClosestProp(null);
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
          <NPCDebug 
            isPerformingActions={isPerformingActions} 
            speechContent={speechContent} 
          />
      )}
    </group>
  );
}