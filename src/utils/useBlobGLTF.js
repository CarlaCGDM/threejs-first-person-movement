// src/utils/useBlobGLTF.js
import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function useBlobGLTF(modelPath) {
  const [gltf, setGltf] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    
    // Fetch from Netlify Blob
    fetch(`/.netlify/functions/serve-model?path=${modelPath}`)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        loader.parse(buffer, '', (gltf) => {
          setGltf(gltf);
        });
      });
  }, [modelPath]);

  return gltf;
}