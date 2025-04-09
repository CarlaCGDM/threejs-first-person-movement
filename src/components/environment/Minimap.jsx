import { useEffect, useMemo, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Clone } from "@react-three/drei";
import * as THREE from "three";

function MinimapScene({ playerRef }) {
    const { scene: model } = useGLTF("/assets/models/CovaBonica_LODs/LOD_00.glb");
    const { scene: path } = useGLTF("/assets/models/CovaBonica_LODs/cb_pasarela.glb");
    const { scene: pawn } = useGLTF("/assets/models/pawn.glb");
    const { scene: POI1 } = useGLTF("/assets/models/POIs/POI1.glb");
    const { scene: POI2 } = useGLTF("/assets/models/POIs/POI2.glb");
    const { scene: POI3 } = useGLTF("/assets/models/POIs/POI3.glb");
    const { scene: POI4 } = useGLTF("/assets/models/POIs/POI4.glb");

    const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
    const [isPlayerReady, setIsPlayerReady] = useState(false); // 🔹 Track when playerRef is valid

    // Clone and scale the cave model
    const miniModel = useMemo(() => {
        const clone = model.clone();
        clone.scale.set(0.3, 0.3, 0.3);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
            }
        });
        return clone;
    }, [model]);

    // Clone and scale the path model
    const miniPath = useMemo(() => {
        const clone = path.clone();
        clone.scale.set(0.3, 0.3, 0.3);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ color: "#3d292a", transparent: true, opacity: 1, side: THREE.DoubleSide });
            }
        });
        return clone;
    }, [path]);

    // Clone and scale the path model
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

     // Clone and scale the path model
     const miniPOI1 = useMemo(() => {
        const clone = POI1.clone();
        clone.scale.set(0.3, 0.3, 0.3);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide});
            }
        });
        return clone;
    }, [POI1]);

     // Clone and scale the path model
     const miniPOI2 = useMemo(() => {
        const clone = POI2.clone();
        clone.scale.set(0.3, 0.3, 0.3);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide});
            }
        });
        return clone;
    }, [POI2]);

    // Clone and scale the path model
    const miniPOI3 = useMemo(() => {
        const clone = POI3.clone();
        clone.scale.set(0.3, 0.3, 0.3);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide});
            }
        });
        return clone;
    }, [POI3]);

     // Clone and scale the path model
     const miniPOI4 = useMemo(() => {
        const clone = POI4.clone();
        clone.scale.set(0.3, 0.3, 0.3);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide});
            }
        });
        return clone;
    }, [POI4]);

    // Wait for playerRef to become available
    useEffect(() => {
        if (!playerRef?.current) {
            const checkInterval = setInterval(() => {
                if (playerRef.current) {
                    setIsPlayerReady(true);
                    clearInterval(checkInterval);
                }
            }, 100); // Check every 100ms

            return () => clearInterval(checkInterval);
        } else {
            setIsPlayerReady(true);
        }
    }, [playerRef]);

    // Update player position when ref is available
    useEffect(() => {
        if (!isPlayerReady) return;

        const updatePlayerPosition = () => {
            if (playerRef.current) {
                const newPlayerPosition = playerRef.current.translation();
                setPlayerPosition([
                    newPlayerPosition.x * 0.3,
                    newPlayerPosition.y * 0.3,
                    newPlayerPosition.z * 0.3
                ]);
            }
            requestAnimationFrame(updatePlayerPosition);
        };

        updatePlayerPosition();

        return () => cancelAnimationFrame(updatePlayerPosition);
    }, [isPlayerReady]); // 🔹 Start updating only when playerRef is ready

    return (
        <>
            <Suspense fallback={null} >
                <group position={[-1,0,0]}>
                <Clone object={miniModel} />
                <Clone object={miniPath} />
                {/* <Clone object={miniPOI1} position={[4.97213*0.3, -2.4*0.3, 2.24257*0.3]}/>
                <Clone object={miniPOI2} position={[2.47955*0.3, -2.6*0.3, -2.72549*0.3]}/>
                <Clone object={miniPOI3} position={[9.47179*0.3, -0.489526*0.3, -2.33263*0.3]}/>
                <Clone object={miniPOI4} position={[-4.38825*0.3, -3.46406*0.3, 3.71715*0.3]}/> */}
                </group>
            </Suspense >

            {/* Player Indicator */}
            {isPlayerReady && (
                <group position={playerPosition}>
                     <Clone object={miniPawn} position={[-1,-0.2,0]}/>
                </group>
            )}

            {/* Grid Helper */}
            <gridHelper args={[10, 5]} />

            {/* Controls */}
            <OrbitControls enableZoom={false} enablePan={false} />
        </>
    );
}

export function Minimap({ playerRef }) {
    return (
        <div style={styles.minimapContainer}>
            <Canvas
                camera={{ position: [0,7,0], fov: 50 }}
                style={styles.minimapCanvas}
            >
                <MinimapScene playerRef={playerRef} />
            </Canvas>
        </div>
    );
}

// Styles
const styles = {
    minimapContainer: {
        position: "fixed", // Changed from absolute to fixed
        bottom: "5px",
        right: "5px",
        width: "200px",
        height: "200px",
        border: "1px solid #3a3a3a", // Matches navbar border
        borderRadius: "0.5vw",
        backgroundColor: "#272626CC", // Same as navbar
        zIndex: 1000,
        overflow: "hidden",
        // Remove borderRadius for sharp corners
    },
    minimapCanvas: {
        width: "100%",
        height: "100%",
    },
};