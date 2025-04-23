import { useState, useEffect } from 'react';
import { useDebug } from '../../../context/DebugContext';

export function useChunkedModel(modelPath) {
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true); // NEW
  const debugChunks = useDebug('Cloudflare', 'Chunks');
  const debugErrors = useDebug('Cloudflare', 'Errors');

  useEffect(() => {
    setLoading(true); // Start loading on each new path
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
        setLoading(false); // DONE loading
      })
      .catch(err => {
        setLoading(false); // Ensure this is set on error too
        if (debugErrors) console.error("[Cloudflare/Errors] Error in useChunkedModel:", err);
      });
  }, [modelPath]);

  return { modelUrl, loading };
}
