import { useState, useEffect } from 'react';
import { useDebug } from '../../../context/DebugContext';

export function useChunkedModel(modelPath, shouldLoad = true) {
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const debugChunks = useDebug('Cloudflare', 'Chunks');
  const debugErrors = useDebug('Cloudflare', 'Errors');

  useEffect(() => {
    if (!shouldLoad || modelUrl) return;

    setLoading(true);

    fetch(`${modelPath}chunk_manifest.json`)
      .then(r => r.json())
      .then(manifest => 
        Promise.all(
          manifest.chunks.map(chunk =>
            fetch(`${modelPath}${chunk}`).then(r => r.arrayBuffer())
          )
        )
      )
      .then(chunks => {
        const blob = new Blob(chunks, { type: 'model/gltf-binary' });
        setModelUrl(URL.createObjectURL(blob));
        setLoading(false);
        if (debugChunks) console.log("[Cloudflare/Chunks] Model loaded successfully.");
      })
      .catch(err => {
        setLoading(false);
        if (debugErrors) console.error("[Cloudflare/Errors] Error in useChunkedModel:", err);
      });

  }, [shouldLoad, modelPath, modelUrl, debugChunks, debugErrors]);

  return { modelUrl, loading };
}
