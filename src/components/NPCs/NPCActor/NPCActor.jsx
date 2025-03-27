import { useState } from 'react';
import { useNPCMovement } from './hooks/useNPCMovement';
import { useNPCActions } from './hooks/useNPCActions';
import { useNPCPropInteraction } from './hooks/useNPCPropInteraction';
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

  const { closestProp, findClosestProp } = useNPCPropInteraction({
    groupRef,
    propsData,
    isPerformingActions
  });

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