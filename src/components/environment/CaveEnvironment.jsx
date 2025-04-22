import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect } from "react";
import { CF_WORKER_URL } from "../../config";
import { MemoizedChunkedModel } from "./MemoizedChunkedModel";

const MemoizedModel = ({ modelUrl }) => {
  const gltf = useGLTF(modelUrl);

  // Memoize the cloned scene to avoid re-cloning on every render
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  return <primitive object={scene} />;
};

const MemoizedTransparentModel = ({ modelUrl }) => {
  const gltf = useGLTF(modelUrl);

  // Memoize the cloned scene to avoid re-cloning on every render
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  scene.frustumCulled = false
  scene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.alphaTest = 0.5
      child.material.depthWrite = true
      child.material.transparent = false
    }
  });

  return <primitive object={scene} />;
};

export function Ground() {

  return (
    <>
      <MemoizedTransparentModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/cb_pasarela.glb/`} />
      {/* <MemoizedChunkedModel modelPath={`${CF_WORKER_URL}CovaBonica_LODs/LOD_03_Chunks/`} /> */}
      <MemoizedModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/LOD_04.glb/`} />
      <MemoizedModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/cb_background.glb/`} />
    </>
  );
}