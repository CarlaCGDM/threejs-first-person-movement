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
  model = "/assets/models/characters/leonard.glb",
  propsData = [],
  poisData = [],
  playerRef
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
      const randomDelay = Math.floor(Math.random() * (100000 - 15000 + 1)) + 15000;
      startActions(randomDelay);
      findClosestTarget();
    }
  });

  // 2. Now load animations using the existing groupRef
  const { scene, animations } = useGLTF(model);
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

    // Always stop all animations first for clean transitions
    Object.values(actions).forEach(action => action?.fadeOut(0.2));

    if (!isPerformingActions) {
      // Walking state (priority 1)
      actions['Walk']?.reset().fadeIn(0.3).play();
    } else {
      // Stopped state
      if (closestTarget) {
        // Looking at specific target (priority 2)
        actions['Idle']?.reset().fadeIn(0.3).play();
      } else {
        // Generic idle/looking around (priority 3)
        actions['LookAround']?.reset().fadeIn(0.3).play();
      }
    }

    return () => {
      // Cleanup on unmount
      Object.values(actions).forEach(action => action?.fadeOut(0.1));
    };
  }, [isPerformingActions, closestTarget, actions]);

  const speechContent = closestTarget
    ? closestTarget.type === 'prop'
      ? `I'm looking at the ${closestTarget.artifactName}`
      : `I'm observing ${closestTarget.poiName}`
    : "I'm just taking a look around!";

  return (
    <group ref={groupRef}>
      {/* Animated model */}
      <primitive object={scene} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />
      <NPCDebug
        isPerformingActions={isPerformingActions}
        speechContent={speechContent}
        playerRef={playerRef}  // Your player's THREE object ref
        groupRef={groupRef}    // From useNPCMovement
      />
    </group>
  );
}

// Preload the model
useGLTF.preload('/assets/models/characters/leonard.glb');