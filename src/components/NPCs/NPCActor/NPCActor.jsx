import { useState, useEffect, Suspense, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useNPCMovement } from './hooks/useNPCMovement';
import { useNPCActions } from './hooks/useNPCActions';
import { useNPCPropInteraction } from './hooks/useNPCPropInteraction';
import { SpeechBubble } from './visuals/SpeechBubble';
import { useNPCSpeech } from './hooks/useNPCSpeech';
import * as THREE from 'three';

export function NPCActor({
  path,
  speed = 0.5,
  rotationSpeed = 2,
  smoothness = 0.5,
  onPathComplete,
  model = "/assets/models/characters/sophie",
  propsData = [],
  poisData = [],
  playerRef,
  color = "lime"
}) {
  const [animationsReady, setAnimationsReady] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const lastActionRef = useRef(null);
  const [currentAnimation, setCurrentAnimation] = useState('Walk');
  const [playerDistance, setPlayerDistance] = useState(Infinity);
  const actionsRef = useRef(null);

  const { scene, animations } = useGLTF(model + '/LOD_01.glb');

  const { actions } = useAnimations(animations, scene);

  // Store actions in ref for consistent access
  useEffect(() => {
    if (actions) {
      actionsRef.current = actions;
    }
  }, [actions]);

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

  const { isPerformingActions, startActions } = useNPCActions({
    onActionComplete: onPathComplete
  });

  const { closestTarget, findClosestTarget } = useNPCPropInteraction({
    groupRef,
    propsData,
    poisData,
    isPerformingActions
  });

  const currentPhrase = useNPCSpeech(closestTarget);

  useEffect(() => {
    if (animations && animations.length > 0 && actions) {
      setAnimationsReady(true);
    }
  }, [animations, actions]);

  useEffect(() => {
    if (!animationsReady) return;

    // Ensure materials are properly set before showing
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.FrontSide;
      }
    });

    // Initialize all animations (but don't play them yet)
    if (actions) {
      Object.values(actions).forEach(action => {
        // Make sure all animations are initialized
        action.reset();
      });
      // Start first animation safely
      updateAnimation('Walk');
    }

    setModelReady(true); // Now safe to render

    return () => {
      if (actions) {
        Object.values(actions).forEach(action => {
          action.fadeOut(0.1);
          action.stop();
        });
      }
    };
  }, [animationsReady]);

  // Function to determine which animation to play
  const determineAnimationName = () => {
    if (!isPerformingActions) {
      return 'Walk';
    } else if (closestTarget) {
      return 'Idle';
    } else {
      return 'LookAround';
    }
  };

  // Separated animation update into its own effect
  useEffect(() => {
    if (!animationsReady) return;
    const nextActionName = determineAnimationName();
    updateAnimation(nextActionName);
  }, [isPerformingActions, closestTarget, animationsReady]);

  // Improved animation transition function
  const updateAnimation = (nextActionName) => {
    if (!actionsRef.current) return;
    
    setCurrentAnimation(nextActionName);
    const nextAction = actionsRef.current[nextActionName];
    if (!nextAction) {
      console.warn(`Animation "${nextActionName}" not found`);
      return;
    }

    const currentAction = lastActionRef.current;
    
    // If we're trying to play the same animation that's already playing, do nothing
    if (currentAction === nextAction && nextAction.isRunning()) {
      return;
    }

    // Handle transition to new animation
    if (currentAction) {
      // Properly stop the current animation to avoid T-pose
      currentAction.fadeOut(0.3);
      
      // Reset and play the next animation
      nextAction.reset();
      nextAction.fadeIn(0.3);
      nextAction.play();
    } else {
      // First animation
      nextAction.reset();
      nextAction.fadeIn(0.3);
      nextAction.play();
    }

    lastActionRef.current = nextAction;
    
    console.log("Animation changed to:", nextActionName);
  };

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        {modelReady && (
          <primitive object={scene} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />
        )}
      </Suspense>

      <SpeechBubble
        isPerformingActions={isPerformingActions}
        speechContent={currentPhrase}
        playerRef={playerRef}
        groupRef={groupRef}
        color={color}
        onDistanceChange={setPlayerDistance}
      />
    </group>
  );
}