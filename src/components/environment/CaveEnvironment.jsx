import { useGLTF } from "@react-three/drei";
import { useMemo, useRef, useEffect } from "react";
import { CF_WORKER_URL } from "../../config";
import { useGLTFReady } from "./hooks/useGLTFReady";
import DisposeOnlyModel from "./DisposeOnlyModel";

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

// Inside Ground
export function Ground({ environmentUrl }) {
  const isHDReady = useGLTFReady(environmentUrl);
  const shouldShowHD = environmentUrl && isHDReady;

  const previousHDUrlRef = useRef(null);

  // Track last used HD modelUrl for disposal
  useEffect(() => {
    if (shouldShowHD) {
      previousHDUrlRef.current = environmentUrl;
    }
  }, [environmentUrl, shouldShowHD]);

  return (
    <>
      <MemoizedTransparentModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/cb_pasarela.glb/`} />
      <MemoizedModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/cb_background.glb/`} />

      {shouldShowHD ? (
        <MemoizedModel modelUrl={environmentUrl} />
      ) : (
        <MemoizedModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/LOD_03.glb/`} />
      )}

      {/* When HD is off, pass previous HD url for cleanup */}
      {!shouldShowHD && previousHDUrlRef.current && (
        <DisposeOnlyModel modelUrl={previousHDUrlRef.current} />
      )}
    </>
  );
}



