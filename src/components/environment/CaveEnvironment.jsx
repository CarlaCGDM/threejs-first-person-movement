import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect } from "react";
import { CF_WORKER_URL } from "../../config";
import { useChunkedModel } from "./hooks/useChunkedModel";

// Memoized standard model that notifies when loading is complete
const MemoizedModel = ({ modelUrl}) => {
  const gltf = useGLTF(modelUrl);

  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  return <primitive object={scene} />;
};

// Transparent variant with material tweaks
const MemoizedTransparentModel = ({ modelUrl }) => {
  const gltf = useGLTF(modelUrl);

  const scene = useMemo(() => {
    const clone = gltf.scene.clone();
    clone.frustumCulled = false;
    clone.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.alphaTest = 0.5;
        child.material.depthWrite = true;
        child.material.transparent = false;
      }
    });
    return clone;
  }, [gltf.scene]);

  return <primitive object={scene} />;
};

// Ground wrapper that loads a chunked model and notifies when it's fully ready
export function Ground({environmentUrl}) {

  return (
    <>
      <MemoizedTransparentModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/cb_pasarela.glb/`} />
      {environmentUrl && <MemoizedModel modelUrl={environmentUrl} />}
      <MemoizedModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/cb_background.glb/`} />
    </>
  );
}

