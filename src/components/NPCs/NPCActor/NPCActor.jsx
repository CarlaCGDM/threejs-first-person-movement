import { useState, useEffect } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
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
  propsData = [],
  poisData = []
}) {
  // 1. First get movement control (this provides groupRef)
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
      findClosestTarget();
    }
  });

  // 2. Now load animations using the existing groupRef
  const { scene, animations } = useGLTF('/assets/models/characters/leonard.glb');
  const { actions } = useAnimations(animations, groupRef);

  // 3. Then add prop interaction
  const { closestTarget, findClosestTarget } = useNPCPropInteraction({
    groupRef,
    propsData,
    poisData,
    isPerformingActions
  });

  // Animation control
  useEffect(() => {
    if (!actions) return;

    if (isPerformingActions) {
      actions['Walk']?.fadeOut(0.3);
      actions['Idle']?.reset().fadeIn(0.3).play();
      
      if (closestTarget) {
        actions['LookAt']?.reset().fadeIn(0.5).play();
      } else {
        actions['LookAt']?.fadeOut(0.3);
      }
    } else {
      actions['Idle']?.fadeOut(0.3);
      actions['LookAt']?.fadeOut(0.1);
      actions['Walk']?.reset().fadeIn(0.3).play();
    }
  }, [isPerformingActions, closestTarget]);

  const speechContent = closestTarget
    ? closestTarget.type === 'prop'
      ? `I'm looking at the ${closestTarget.artifactName}`
      : `I'm observing ${closestTarget.poiName}`
    : "I'm just taking a look around!";

  return (
    <group ref={groupRef}>
      {/* Animated model */}
      <primitive object={scene} position={[0, 0, 0]} rotation={[0,Math.PI,0]} />
        <NPCDebug 
          isPerformingActions={isPerformingActions} 
          speechContent={speechContent} 
        />
    </group>
  );
}

// Preload the model
useGLTF.preload('/assets/models/characters/leonard.glb');