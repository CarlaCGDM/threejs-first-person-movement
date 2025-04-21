import { useState, useEffect } from 'react';
import { useDebug } from '../../../context/DebugContext';

export function useChunkedModel(modelPath) {
  const [modelUrl, setModelUrl] = useState(null);
  const debugChunks = useDebug('Cloudflare', 'Chunks');
  const debugErrors = useDebug('Cloudflare', 'Errors');

  useEffect(() => {
    if (debugChunks) console.log("[Cloudflare/Chunks] 1. Starting chunk load for:", modelPath);
    
    fetch(`${modelPath}chunk_manifest.json`)
      .then(r => {
        if (debugChunks) console.log("[Cloudflare/Chunks] 2. Manifest loaded, status:", r.status);
        return r.json();
      })
      .then(manifest => {
        if (debugChunks) {
          console.log("[Cloudflare/Chunks] 3. Full manifest response:", manifest);
          console.log("[Cloudflare/Chunks] 3. Parsed manifest chunks:", manifest.chunks);
        }
        
        return Promise.all(
          manifest.chunks.map(chunk => {
            if (debugChunks) console.log("[Cloudflare/Chunks] 4. Requesting chunk:", chunk);
            return fetch(`${modelPath}${chunk}`)
              .then(r => {
                if (debugChunks) console.log("[Cloudflare/Chunks] 5. Chunk loaded:", chunk, "status:", r.status);
                return r.arrayBuffer();
              });
          })
        );
      })
      .then(chunks => {
        if (debugChunks) console.log("[Cloudflare/Chunks] 6. All chunks loaded, creating blob");
        const blob = new Blob(chunks, { type: 'model/gltf-binary' });
        setModelUrl(URL.createObjectURL(blob));
      })
      .catch(err => {
        if (debugErrors) console.error("[Cloudflare/Errors] Error in useChunkedModel:", err);
      });
  }, [modelPath, debugChunks, debugErrors]);

  return { modelUrl };
}