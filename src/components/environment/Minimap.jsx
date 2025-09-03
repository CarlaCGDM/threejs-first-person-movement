import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Clone } from "@react-three/drei";
import * as THREE from "three";
import { CF_WORKER_URL } from "../../config";
import { useIsMobile } from "../../hooks/useIsMobile";

function MinimapScene({ playerRef, orbitControlsRef, customOrbitControlsRef }) {
  const { scene: model } = useGLTF(`${CF_WORKER_URL}CovaBonica_LODs/LOD_00.glb`);
  const { scene: path } = useGLTF(`${CF_WORKER_URL}CovaBonica_LODs/cb_pasarela.glb`);
  const { scene: pawn } = useGLTF(`${CF_WORKER_URL}pawn.glb`);
  const { scene: pawnBase } = useGLTF(`${CF_WORKER_URL}pawnBase.glb`);
  const { scene: POI1 } = useGLTF(`${CF_WORKER_URL}POIs/POI1.glb`);
  const { scene: POI2 } = useGLTF(`${CF_WORKER_URL}POIs/POI2.glb`);
  const { scene: POI3 } = useGLTF(`${CF_WORKER_URL}POIs/POI3.glb`);
  const { scene: POI4 } = useGLTF(`${CF_WORKER_URL}POIs/POI4.glb`);

  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isOrbitControlsReady, setIsOrbitControlsReady] = useState(false);
  const pawnRef = useRef();

  useEffect(() => {
    if (!customOrbitControlsRef?.current) {
      const t = setInterval(() => {
        if (customOrbitControlsRef.current) {
          setIsOrbitControlsReady(true);
          clearInterval(t);
        }
      }, 100);
      return () => clearInterval(t);
    } else {
      setIsOrbitControlsReady(true);
    }
  }, [customOrbitControlsRef]);

  useFrame(() => {
    if (isOrbitControlsReady && customOrbitControlsRef.current) {
      try {
        const rotationData = customOrbitControlsRef.current.getCameraRotation();
        if (rotationData && pawnRef.current) {
          const verticalRotation = new THREE.Euler(0, rotationData.y, 0);
          pawnRef.current.rotation.copy(verticalRotation);
        }
      } catch (err) {
        console.error("Error getting rotation:", err);
      }
    }
  });

  const miniModel = useMemo(() => {
    const clone = model.clone();
    clone.scale.set(0.3, 0.3, 0.3);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.4,
        });
      }
    });
    return clone;
  }, [model]);

  const miniPath = useMemo(() => {
    const clone = path.clone();
    clone.scale.set(0.3, 0.3, 0.3);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: "#3d292a",
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide,
        });
      }
    });
    return clone;
  }, [path]);

  const miniPawn = useMemo(() => {
    const clone = pawn.clone();
    clone.scale.set(0.3, 0.3, 0.3);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ color: "orange" });
      }
    });
    return clone;
  }, [pawn]);

  const miniPawnBase = useMemo(() => {
    const clone = pawnBase.clone();
    clone.scale.set(0.3, 0.3, 0.3);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ color: "orange" });
      }
    });
    return clone;
  }, [pawnBase]);

  const miniPOI1 = useMemo(() => {
    const clone = POI1.clone();
    clone.scale.set(0.3, 0.3, 0.3);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide });
      }
    });
    return clone;
  }, [POI1]);

  const miniPOI2 = useMemo(() => {
    const clone = POI2.clone();
    clone.scale.set(0.3, 0.3, 0.3);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide });
      }
    });
    return clone;
  }, [POI2]);

  const miniPOI3 = useMemo(() => {
    const clone = POI3.clone();
    clone.scale.set(0.3, 0.3, 0.3);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide });
      }
    });
    return clone;
  }, [POI3]);

  const miniPOI4 = useMemo(() => {
    const clone = POI4.clone();
    clone.scale.set(0.3, 0.3, 0.3);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide });
      }
    });
    return clone;
  }, [POI4]);

  useEffect(() => {
    if (!playerRef?.current) {
      const t = setInterval(() => {
        if (playerRef.current) {
          setIsPlayerReady(true);
          clearInterval(t);
        }
      }, 100);
      return () => clearInterval(t);
    } else {
      setIsPlayerReady(true);
    }
  }, [playerRef]);

  useEffect(() => {
    if (!isPlayerReady) return;

    let handle = 0;
    const update = () => {
      if (playerRef.current) {
        const p = playerRef.current.translation();
        setPlayerPosition([p.x * 0.3, p.y * 0.3, p.z * 0.3]);
      }
      handle = requestAnimationFrame(update);
    };
    update();
    return () => cancelAnimationFrame(handle);
  }, [isPlayerReady, playerRef]);

  return (
    <>
      <Suspense fallback={null}>
        <group position={[-1, 0, 0]}>
          <Clone object={miniModel} />
          <Clone object={miniPath} />
        </group>
      </Suspense>

      {isPlayerReady && playerRef?.current && (
        <group position={playerPosition}>
          <Clone object={miniPawn} position={[-1, -0.2, 0]} />
          <group position={[-1, -0.2, 0]} rotation={[0, Math.PI, 0]}>
            <Clone object={miniPawnBase} ref={pawnRef} />
          </group>
        </group>
      )}

      <gridHelper args={[10, 3]} />
      <OrbitControls ref={orbitControlsRef} enableZoom={false} enablePan={false} />
    </>
  );
}

export function Minimap({ playerRef, customOrbitControlsRef }) {
  const orbitControlsRef = useRef();

  const isMobile = useIsMobile();

  // Responsive square size for mobile
  const [size, setSize] = useState(200);

  useEffect(() => {
    if (!isMobile) return; // desktop keeps default 200px & bottom-right
    const compute = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isLandscape = w > h;

      // desired default size
      const desired = 200;

      // limit: <= 50% of the *short* side spec you gave
      const halfLimit = isLandscape ? h * 0.5 : w * 0.5;

      // margin so we don't kiss the edges
      const margin = 10;

      // final square side
      const side = Math.max(120, Math.min(desired, Math.floor(halfLimit - margin)));
      setSize(side);
    };

    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, [isMobile]);

  const containerStyle = isMobile
    ? {
        position: "fixed",
        top: "calc(max(6vh,5vw))",
        right: "calc(max(1vh,1vw))",
        width: `${size}px`,
        height: `${size}px`,
        border: "1px solid #3a3a3a",
        borderRadius: "0.5vw",
        backgroundColor: "#272626CC",
        zIndex: 1000,
        overflow: "hidden",
        // make sure other UI can still receive touches underneath except inside the map
        pointerEvents: "auto",
      }
    : {
        position: "fixed",
        bottom: "5px",
        right: "5px",
        width: "200px",
        height: "200px",
        border: "1px solid #3a3a3a",
        borderRadius: "0.5vw",
        backgroundColor: "#272626CC",
        zIndex: 1000,
        overflow: "hidden",
        pointerEvents: "auto",
      };

  return (
    <div style={containerStyle}>
      <Canvas camera={{ position: [0, 7, 0], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <MinimapScene
          playerRef={playerRef}
          orbitControlsRef={orbitControlsRef}
          customOrbitControlsRef={customOrbitControlsRef}
        />
      </Canvas>
    </div>
  );
}
