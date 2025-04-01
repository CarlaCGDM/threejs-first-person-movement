import { useState, useEffect, Suspense, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useNPCMovement } from './hooks/useNPCMovement';
import { useNPCActions } from './hooks/useNPCActions';
import { useNPCPropInteraction } from './hooks/useNPCPropInteraction';
import { SpeechBubble } from './visuals/SpeechBubble';
import phrases from '../data/quotesData.json';
import * as THREE from 'three';

// Modified to accept and apply animations
const HighResModel = ({ modelUrl, animations, groupRef, onLoad }) => {
  const { scene } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, scene);

  // Apply animations to this model when it loads
  useEffect(() => {
    console.log("Im reloading the actions!")
    if (scene && animations && animations.length > 0) {
      onLoad(actions);
    }
  }, []);

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
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);
  const highResActionsRef = useRef(null);
  const lastLowResActionRef = useRef(null);
  const lastHighResActionRef = useRef(null);


  // Load animations from low-res model
  const { scene, animations } = useGLTF(model + '/LOD_00.glb');

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

  const getRandomPhrase = (key) => {
    const category = phrases[0][key];
    if (category && category.length > 0) {
      return category[Math.floor(Math.random() * category.length)];
    }
    return "I'm observing this interesting artifact";
  };

  useEffect(() => {
    if (closestTarget) {
      if (closestTarget.type === 'prop') {
        setCurrentPhrase(getRandomPhrase(closestTarget.artifactName));
      } else {
        setCurrentPhrase(getRandomPhrase("Cova bonica"));
      }
    } else {
      setCurrentPhrase(getRandomPhrase("Cova bonica"));
    }
  }, [closestTarget]);

  // Handle high-res model load completion
  const handleHighResLoaded = (highResActions) => {
    highResActionsRef.current = highResActions;
    setHighResLoaded(true);

    // Immediately play the appropriate animation for high-res
    if (animationsReady) {
      updateAnimation(highResActionsRef.current, true);
    }
  };

  const updateAnimation = (actionsObj, isHighRes) => {
    if (!actionsObj) return;
  
    let nextAction;
    if (!isPerformingActions) {
      nextAction = actionsObj['Walk'];
    } else if (closestTarget) {
      nextAction = actionsObj['Idle'];
    } else {
      nextAction = actionsObj['LookAround'];
    }
  
    if (!nextAction) return;
  
    // Choose the correct last action ref
    const lastActionRef = isHighRes ? lastHighResActionRef : lastLowResActionRef;
    const currentAction = lastActionRef.current;
  
    if (currentAction && currentAction !== nextAction) {
      console.log(`Crossfading from ${currentAction.getClip().name} to ${nextAction.getClip().name}`);
      
      currentAction.crossFadeTo(nextAction, 0.3, true);
      nextAction.reset().play();  // 🔥 Explicitly call play()
    } else {
      console.log(`Playing ${nextAction.getClip().name}`);
      nextAction.reset().fadeIn(0.3).play();
    }
  
    // Store the newly played action
    lastActionRef.current = nextAction;
  };
  





  // Apply animations to currently visible model
 useEffect(() => {
  if (!animationsReady) return;

  if (highResLoaded && highResActionsRef.current) {
    // Ensure we are triggering an animation update
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
      {/* High-res model with animations passed in */}
      <Suspense fallback={null}>
        {animationsReady && (
          <HighResModel
            modelUrl={model + '/LOD_04.glb'}
            animations={animations}
            groupRef={groupRef}
            onLoad={handleHighResLoaded}
          />
        )}
      </Suspense>

      {/* Low-res model until high-res is loaded */}
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