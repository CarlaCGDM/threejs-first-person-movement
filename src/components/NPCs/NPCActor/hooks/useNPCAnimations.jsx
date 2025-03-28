import { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';

export function useNPCAnimations(path) {
  const group = useRef();
  const { scene, animations } = useGLTF(path);
  const { actions, mixer } = useAnimations(animations, group);

  // Cleanup animations on unmount
  useEffect(() => {
    return () => animations.forEach((clip) => actions[clip.name]?.stop());
  }, []);

  return {
    model: scene,
    animations: actions,
    mixer,
    group
  };
}