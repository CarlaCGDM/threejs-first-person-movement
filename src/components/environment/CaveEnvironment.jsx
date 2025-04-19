import { useGLTF, Html, useProgress, Clone } from "@react-three/drei";
import { useMemo, Suspense, useEffect } from "react";
import * as THREE from "three";

const MemoizedModel = ({ modelUrl }) => {
  const gltf = useGLTF(modelUrl);

  // Memoize the cloned scene to avoid re-cloning on every render
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useEffect(() => {
    let count = 0;
    scene.traverse(child => {
      if (child.isMesh) count++;
    });
    console.log(`Draw call estimate for ${modelUrl}:`, count);
  }, [scene]);

  return <primitive object={scene} />;
};

const MemoizedTransparentModel = ({ modelUrl }) => {
  const gltf = useGLTF(modelUrl);

  // Memoize the cloned scene to avoid re-cloning on every render
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useEffect(() => {
    let count = 0;
    scene.traverse(child => {
      if (child.isMesh) count++;
    });
    console.log(`Draw call estimate for ${modelUrl}:`, count);
  }, [scene]);

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

  const workerUrl = "https://my-worker.nadinaccg.workers.dev/?path=";

  return (
    <>
      <MemoizedTransparentModel modelUrl={'/assets/models/CovaBonica_LODs/cb_pasarela.glb'} />
      <MemoizedModel modelUrl={`${workerUrl}CovaBonica_LODs/LOD_03.glb`} />
      <MemoizedModel modelUrl={'/assets/models/CovaBonica_LODs/cb_background.glb'} />
    </>
  );
}