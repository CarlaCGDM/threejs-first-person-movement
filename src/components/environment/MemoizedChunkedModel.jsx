import { useGLTF, Html } from "@react-three/drei";
import { useMemo, useState } from "react";
import { useChunkedModel } from "./hooks/useChunkedModel";
import { CF_WORKER_URL } from "../../config";

export function MemoizedChunkedModel({ modelPath }) {
  const { modelUrl } = useChunkedModel(modelPath);
  const [fallback] = useState(`${CF_WORKER_URL}tabbyCat.glb`); // Fallback to first chunk
  
  // Only call useGLTF when we have a valid URL
  const gltf = useGLTF(modelUrl || fallback);

  const scene = useMemo(() => {
    if (!gltf.scene) return null;
    const clonedScene = gltf.scene.clone();
    // Optional: Add any scene modifications here
    return clonedScene;
  }, [gltf.scene]);

  if (!modelUrl) {
    return (
      <Html center>
        <div className="loading">Loading model...</div>
      </Html>
    );
  }

  return scene ? <primitive object={scene} /> : null;
}

