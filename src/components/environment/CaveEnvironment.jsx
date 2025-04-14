import { useGLTF } from "@react-three/drei";
import { useMemo, useEffect } from "react";
import { useBlobGLTF } from "../../utils/useBlobGLTF";

const MemoizedModel = ({ modelUrl }) => {

  const gltf = useBlobGLTF(modelUrl); // Changed from useGLTF

  // Memoize the cloned scene to avoid re-cloning on every render
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

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

  return (
    <>
      <MemoizedTransparentModel modelUrl={'/assets/models/CovaBonica_LODs/cb_pasarela.glb' } /> {/* Remove '/assets/models/' prefix since blob paths are relative */}
      <MemoizedModel modelUrl={'CovaBonica_LODs/LOD_03.glb'} />
    </>
  );
}