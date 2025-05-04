import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useEffect, useState } from 'react';

export function useGLTFReady(modelUrl) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!modelUrl) return;

    let cancelled = false;

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      () => {
        if (!cancelled) setReady(true);
      },
      undefined,
      () => {
        if (!cancelled) setReady(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [modelUrl]);

  return ready;
}
