import { useEffect, useMemo, useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Clone } from "@react-three/drei";
import * as THREE from "three";

function MinimapScene({ playerRef, orbitControlsRef, customOrbitControlsRef }) {

    const workerUrl = "https://my-worker.nadinaccg.workers.dev/?path="

    const { scene: model } = useGLTF(`${workerUrl}CovaBonica_LODs/LOD_00.glb`);
    const { scene: path } = useGLTF("/assets/models/CovaBonica_LODs/cb_pasarela.glb");
    const { scene: pawn } = useGLTF("/assets/models/pawn.glb");
    const { scene: pawnBase } = useGLTF("/assets/models/pawnBase.glb");
    const { scene: POI1 } = useGLTF("/assets/models/POIs/POI1.glb");
    const { scene: POI2 } = useGLTF("/assets/models/POIs/POI2.glb");
    const { scene: POI3 } = useGLTF("/assets/models/POIs/POI3.glb");
    const { scene: POI4 } = useGLTF("/assets/models/POIs/POI4.glb");

    const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
    const [isPlayerReady, setIsPlayerReady] = useState(false); // 🔹 Track when playerRef is valid
    const [isOrbitControlsReady, setIsOrbitControlsReady] = useState(false); // 🔹 Track OrbitControls readiness

    const pawnRef = useRef();

    // Wait for orbitControlsRef to become available
    useEffect(() => {
        if (!customOrbitControlsRef?.current) {
            const checkInterval = setInterval(() => {
                if (customOrbitControlsRef.current) {
                    setIsOrbitControlsReady(true);
                    clearInterval(checkInterval);
                }
            }, 100); // Check every 100ms

            return () => clearInterval(checkInterval);
        } else {
            setIsOrbitControlsReady(true);
        }
    }, [customOrbitControlsRef]);

    // Update rotation every frame if orbitControlsRef is ready
    useFrame(() => {
        if (isOrbitControlsReady && customOrbitControlsRef.current) {
            try {
                // Get rotation from CustomOrbitControls
                const rotationData = customOrbitControlsRef.current.getCameraRotation();

                if (rotationData) {
                    // Update the state with the current yaw rotation (vertical)
                    const verticalRotation = new THREE.Euler(0, rotationData.y, 0); // Keep only yaw (vertical)


                    // Apply the constrained rotation to the pawn (apply only yaw)
                    if (pawnRef.current) {
                        pawnRef.current.rotation.copy(verticalRotation);
                    }
                }
            } catch (error) {
                console.error("Error getting rotation:", error);
            }
        }
    });

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
                child.material = new THREE.MeshBasicMaterial({ color: "orange" });
            }
        });
        return clone;
    }, [pawnBase]);

    // Clone and scale the POI models
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
            <Suspense fallback={null}>
                <group position={[-1, 0, 0]}>
                    <Clone object={miniModel} />
                    <Clone object={miniPath} />
                </group>
            </Suspense>

            {/* Player Indicator */}
            {isPlayerReady && playerRef?.current && (
                <group position={playerPosition} >
                    <Clone object={miniPawn} position={[-1, -0.2, 0]} />
                    <group position={[-1, -0.2, 0]} rotation={[0, Math.PI, 0]}>
                        <Clone object={miniPawnBase} ref={pawnRef} />
                    </group>
                </group>
            )}

            {/* Grid Helper */}
            <gridHelper args={[10, 3]} />

            {/* Controls */}
            <OrbitControls ref={orbitControlsRef} enableZoom={false} enablePan={false} />
        </>
    );
}

export function Minimap({ playerRef, customOrbitControlsRef }) {
    const orbitControlsRef = useRef(); // Creating the reference for OrbitControls
    return (
        <div style={styles.minimapContainer}>
            <Canvas
                camera={{ position: [0, 7, 0], fov: 50 }}
                style={styles.minimapCanvas}
            >
                <MinimapScene playerRef={playerRef} orbitControlsRef={orbitControlsRef} customOrbitControlsRef={customOrbitControlsRef} />
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
    },
    minimapCanvas: {
        width: "100%",
        height: "100%",
    },
};
