import { useState, useEffect } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useNPCMovement } from './hooks/useNPCMovement';
import { useNPCActions } from './hooks/useNPCActions';
import { useNPCPropInteraction } from './hooks/useNPCPropInteraction';
import { NPCDebug } from './visuals/NPCDebug';
import phrases from '../data/quotesData.json'; // Import your JSON file

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
  const [currentPhrase, setCurrentPhrase] = useState("");
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

  const { scene, animations } = useGLTF(model);
  const { actions } = useAnimations(animations, groupRef);
  const { closestTarget, findClosestTarget } = useNPCPropInteraction({
    groupRef,
    propsData,
    poisData,
    isPerformingActions
  });

  // Function to get random phrase
  const getRandomPhrase = (key) => {
    const category = phrases[0][key];
    if (category && category.length > 0) {
      return category[Math.floor(Math.random() * category.length)];
    }
    return "I'm observing this interesting artifact";
  };

  // Update phrase when target changes
  useEffect(() => {
    if (closestTarget) {
      if (closestTarget.type === 'prop') {
        setCurrentPhrase(getRandomPhrase(closestTarget.artifactName));
      } else {
        // For POIs, use general "Cova bonica" phrases
        setCurrentPhrase(getRandomPhrase("Cova bonica"));
      }
    } else {
      // When no target, use general "Cova bonica" phrases
      setCurrentPhrase(getRandomPhrase("Cova bonica"));
    }
  }, [closestTarget]);

  // Animation control
  useEffect(() => {
    if (!actions) return;

    Object.values(actions).forEach(action => action?.fadeOut(0.2));

    if (!isPerformingActions) {
      actions['Walk']?.reset().fadeIn(0.3).play();
    } else {
      if (closestTarget) {
        actions['Idle']?.reset().fadeIn(0.3).play();
      } else {
        actions['LookAround']?.reset().fadeIn(0.3).play();
      }
    }

    return () => {
      Object.values(actions).forEach(action => action?.fadeOut(0.1));
    };
  }, [isPerformingActions, closestTarget, actions]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />
      <NPCDebug
        isPerformingActions={isPerformingActions}
        speechContent={currentPhrase}
        playerRef={playerRef}
        groupRef={groupRef}
      />
    </group>
  );
}

useGLTF.preload('/assets/models/characters/leonard.glb');