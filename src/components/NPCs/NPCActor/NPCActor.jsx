import { useState, useEffect, Suspense, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useNPCMovement } from './hooks/useNPCMovement';
import { useNPCActions } from './hooks/useNPCActions';
import { useNPCPropInteraction } from './hooks/useNPCPropInteraction';
import { SpeechBubble } from './visuals/SpeechBubble';
import { useNPCSpeech } from './hooks/useNPCSpeech';
import * as THREE from 'three';

const HighResModel = ({ modelUrl, animations, groupRef, onLoad, initialAnimation }) => {
  const { scene } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions && initialAnimation) {
      actions[initialAnimation]?.reset().fadeIn(0).play();
      onLoad(actions);
    }
  }, [actions, initialAnimation]);

  return <primitive object={scene} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />;
};

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
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);
  const highResActionsRef = useRef(null);
  const lastLowResActionRef = useRef(null);
  const lastHighResActionRef = useRef(null);
  const [currentAnimation, setCurrentAnimation] = useState('Walk');

  // Load animations from low-res model
  const { scene, animations } = useGLTF(model + '/LOD_01.glb');

  useEffect(() => {
    if (animations && animations.length > 0) {
      setAnimationsReady(true);
    }
  }, [animations]);

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

  // Get animation actions for low-res model
  const { actions: lowResActions } = useAnimations(animations, scene);

  const { closestTarget, findClosestTarget } = useNPCPropInteraction({
    groupRef,
    propsData,
    poisData,
    isPerformingActions
  });

  // Use the speech hook
  const currentPhrase = useNPCSpeech(closestTarget);

  // Handle high-res model load completion
  const handleHighResLoaded = (highResActions) => {
    highResActionsRef.current = highResActions;
    setHighResLoaded(true);

    if (animationsReady) {
      updateAnimation(highResActionsRef.current, true);
    }
  };

  const updateAnimation = (actionsObj, isHighRes) => {
    if (!actionsObj) return;
  
    let nextActionName;
    if (!isPerformingActions) {
      nextActionName = 'Walk';
    } else if (closestTarget) {
      nextActionName = 'Idle';
    } else {
      nextActionName = 'LookAround';
    }
  
    setCurrentAnimation(nextActionName);
    const nextAction = actionsObj[nextActionName];
    if (!nextAction) return;
  
    const lastActionRef = isHighRes ? lastHighResActionRef : lastLowResActionRef;
    const currentAction = lastActionRef.current;
  
    if (currentAction && currentAction !== nextAction) {
      currentAction.crossFadeTo(nextAction, 0.3, true);
      nextAction.reset().play();
    } else if (!currentAction) {
      nextAction.reset().fadeIn(0).play();
    }
  
    lastActionRef.current = nextAction;
  };

  useEffect(() => {
    if (!animationsReady) return;

    if (highResLoaded && highResActionsRef.current) {
      updateAnimation(highResActionsRef.current, true);
    } else {
      updateAnimation(lowResActions, false);
    }

    return () => {
      const actionsObj = highResLoaded ? highResActionsRef.current : lowResActions;
      if (actionsObj) {
        Object.values(actionsObj).forEach(action => {
          if (action) {
            action.fadeOut(0.1);
            action.stop();
          }
        });
      }
    };
  }, [isPerformingActions, closestTarget, highResLoaded, animationsReady, highResActionsRef.current]);

  useEffect(() => {
    console.log('Current animation state:', {
      isPerformingActions,
      closestTarget,
      highResLoaded,
      animationsReady,
      lowResActions: Object.keys(lowResActions || {}),
      highResActions: highResActionsRef.current ? Object.keys(highResActionsRef.current || {}) : "Not Loaded",
      lastLowResAction: lastLowResActionRef.current ? lastLowResActionRef.current.getClip().name : "None",
      lastHighResAction: lastHighResActionRef.current ? lastHighResActionRef.current.getClip().name : "None"
    });
  }, [isPerformingActions, closestTarget, highResLoaded, highResActionsRef.current]);

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        {animationsReady && (
          <HighResModel
            modelUrl={model + '/LOD_03.glb'}
            animations={animations}
            groupRef={groupRef}
            onLoad={handleHighResLoaded}
            initialAnimation={currentAnimation}
          />
        )}
      </Suspense>

      {!highResLoaded && <primitive object={scene} position={[0, 0, 0]} rotation={[0, Math.PI, 0]} />}

      <SpeechBubble
        isPerformingActions={isPerformingActions}
        speechContent={currentPhrase}
        playerRef={playerRef}
        groupRef={groupRef}
        color={color}
      />
    </group>
  );
}