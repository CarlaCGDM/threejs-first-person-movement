import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { CF_WORKER_URL } from "../../config";
import { useGLTFReady } from "./hooks/useGLTFReady";
import { useIsMobile } from "../../hooks/useIsMobile";
import DisposeOnlyModel from "./DisposeOnlyModel";

const MemoizedModel = ({ modelUrl }) => {
  const gltf = useGLTF(modelUrl);
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  return <primitive object={scene} />;
};

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

export function Ground({ environmentUrl }) {
  const isHDReady = useGLTFReady(environmentUrl);
  const shouldShowHD = environmentUrl && isHDReady;
  const isMobile = useIsMobile();
  const previousHDUrlRef = useRef(null);

  const fallbackLOD = isMobile
    ? `${CF_WORKER_URL}CovaBonica_LODs/LOD_03.glb`
    : `${CF_WORKER_URL}CovaBonica_LODs/LOD_03.glb`;

  useEffect(() => {
    if (shouldShowHD) {
      previousHDUrlRef.current = environmentUrl;
    }
  }, [environmentUrl, shouldShowHD]);

  return (
    <>
      <MemoizedTransparentModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/cb_pasarela.glb`} />
      <MemoizedModel modelUrl={`${CF_WORKER_URL}CovaBonica_LODs/cb_background.glb`} />

      {shouldShowHD ? (
        <MemoizedModel modelUrl={environmentUrl} />
      ) : (
        <MemoizedModel modelUrl={fallbackLOD} />
      )}

      {!shouldShowHD && previousHDUrlRef.current && (
        <DisposeOnlyModel modelUrl={previousHDUrlRef.current} />
      )}
    </>
  );
}



