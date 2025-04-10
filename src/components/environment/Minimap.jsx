import { useEffect, useMemo, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Clone } from "@react-three/drei";
import * as THREE from "three";

function MinimapScene({ playerRef }) {
    const { scene: model } = useGLTF("/assets/models/CovaBonica_LODs/LOD_00.glb");
    const { scene: path } = useGLTF("/assets/models/CovaBonica_LODs/cb_pasarela.glb");
    const { scene: pawn } = useGLTF("/assets/models/pawn.glb");
    const { scene: pawnBase } = useGLTF("/assets/models/pawnBase.glb");
    const { scene: POI1 } = useGLTF("/assets/models/POIs/POI1.glb");
    const { scene: POI2 } = useGLTF("/assets/models/POIs/POI2.glb");
    const { scene: POI3 } = useGLTF("/assets/models/POIs/POI3.glb");
    const { scene: POI4 } = useGLTF("/assets/models/POIs/POI4.glb");

    const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
    const [playerRotation, setPlayerRotation] = useState(0); // Track player's Y rotation
    const [isPlayerReady, setIsPlayerReady] = useState(false);

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

    // Clone and scale the pawn model
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

    // Clone and scale the pawnBase model
    const miniPawnBase = useMemo(() => {
        const clone = pawnBase.clone();
        clone.scale.set(0.3, 0.3, 0.3);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ color: "yellow" });
            }
        });
        return clone;
    }, [pawnBase]);

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

    // Update player position and rotation when ref is available
    useEffect(() => {
        if (!isPlayerReady) return;

        const updatePlayerPosition = () => {
            if (playerRef.current) {
                const newPlayerPosition = playerRef.current.translation();
                const newPlayerRotation = playerRef.current.rotation().y; // Get Y rotation
                setPlayerPosition([
                    newPlayerPosition.x * 0.3,
                    newPlayerPosition.y * 0.3,
                    newPlayerPosition.z * 0.3,
                ]);
                setPlayerRotation(newPlayerRotation); // Update player rotation
            }
            requestAnimationFrame(updatePlayerPosition);
        };

        updatePlayerPosition();

        return () => cancelAnimationFrame(updatePlayerPosition);
    }, [isPlayerReady]);

    return (
        <>
            <Suspense fallback={null} >
                <group position={[-1,0,0]}>
                    <Clone object={miniModel} />
                    <Clone object={miniPath} />
                </group>
            </Suspense >

            {/* Player Indicator */}
            {isPlayerReady && (
                <group position={playerPosition} rotation={[0, playerRotation, 0]}> {/* Apply Y rotation */}
                    <Clone object={miniPawn} position={[-1,-0.2,0]} />
                    <Clone object={miniPawnBase} position={[-1,-0.2,0]} />
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
    },
    minimapCanvas: {
        width: "100%",
        height: "100%",
    },
};
