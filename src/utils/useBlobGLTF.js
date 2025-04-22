import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function useBlobGLTF(modelPath) {
  const [gltf, setGltf] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    
    fetch(`/.netlify/functions/serve-model?path=${modelPath}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then(buffer => {
        return new Promise((resolve, reject) => {
          loader.parse(buffer, '', resolve, reject);
        });
      })
      .then(setGltf)
      .catch(err => {
        console.error(`Failed to load ${modelPath}:`, err);
        setError(err);
      });

  }, [modelPath]);

  return { gltf, error };
}