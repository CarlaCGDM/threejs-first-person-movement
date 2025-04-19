import { useState, useEffect } from 'react';

export function useChunkedModel(modelPath) {
  const [modelUrl, setModelUrl] = useState(null);

  useEffect(() => {
    console.log("1. Starting chunk load for:", modelPath);
    
    fetch(`${modelPath}chunk_manifest.json`)
      .then(r => {
        console.log("2. Manifest loaded, status:", r.status);
        return r.json();
      })
      .then(manifest => {
        console.log("3. Full manifest response:", manifest); // Add this line
        console.log("3. Parsed manifest chunks:", manifest.chunks);
        return Promise.all(
          manifest.chunks.map(chunk => {
            console.log("4. Requesting chunk:", chunk);
            return fetch(`${modelPath}${chunk}`)
              .then(r => {
                console.log("5. Chunk loaded:", chunk, "status:", r.status);
                return r.arrayBuffer();
              });
          })
        );
      })
      .then(chunks => {
        console.log("6. All chunks loaded, creating blob");
        const blob = new Blob(chunks, { type: 'model/gltf-binary' });
        setModelUrl(URL.createObjectURL(blob));
      })
      .catch(err => console.error("Error in useChunkedModel:", err));
  }, [modelPath]);

  return { modelUrl };
}