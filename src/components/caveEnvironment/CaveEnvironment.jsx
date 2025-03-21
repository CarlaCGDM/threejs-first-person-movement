import { useGLTF, Html, useProgress } from "@react-three/drei";
import { useMemo, Suspense } from "react";

const MemoizedModel = ({ modelUrl }) => {
  const gltf = useGLTF(modelUrl);

  // Memoize the cloned scene to avoid re-cloning on every render
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  return <primitive object={scene} />;
};

const Loader = () => {
  const { progress, loaded, total } = useProgress();
  return (
    <Html center>
      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        color: "white",
      }}>
        <div className="spinner" style={{
          border: "4px solid rgba(255, 255, 255, 0.3)",
          borderTop: "4px solid white",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          animation: "spin 1s linear infinite",
          margin: "0 auto 10px",
        }} />
        <div style={{ width: "200px", height: "10px", backgroundColor: "#444", borderRadius: "5px" }}>
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          />
        </div>
        <p style={{ marginTop: "10px" }}>{Math.round(progress)}% loaded ({loaded}/{total} items)</p>
      </div>
    </Html>
  );
}

export function Ground() {

  return (
    <>
      <Suspense fallback={
        <>
          <MemoizedModel modelUrl={'/assets/models/CovaBonica_LODs/LOD_00.glb'} />
          <Loader />
        </>
      }>
        <MemoizedModel modelUrl={'/assets/models/CovaBonica_LODs/LOD_03.glb'} />

      </Suspense>
      <MemoizedModel modelUrl={'/assets/models/CovaBonica_LODs/cb_pasarela.glb'} />s
    </>
  );
}