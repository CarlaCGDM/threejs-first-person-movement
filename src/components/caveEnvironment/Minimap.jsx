import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Clone } from "@react-three/drei";
import * as THREE from "three";

function MinimapScene({ playerRef }) {
    const { scene: model } = useGLTF("/assets/models/CovaBonica_LODs/LOD_00.glb"); 
    const { scene: path } = useGLTF("/assets/models/CovaBonica_LODs/cb_pasarela.glb"); 

    const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
    const [isPlayerReady, setIsPlayerReady] = useState(false); // 🔹 Track when playerRef is valid

    // Clone and scale the cave model
    const miniModel = useMemo(() => {
        const clone = model.clone();
        clone.scale.set(0.3, 0.3, 0.3);
        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
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
                child.material = new THREE.MeshBasicMaterial({ color: "blue", transparent: true, opacity: 1, side: THREE.DoubleSide });
            }
        });
        return clone;
    }, [path]);

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
            <Clone object={miniModel} />
            <Clone object={miniPath} />

            {/* Player Indicator */}
            {isPlayerReady && (
                <mesh position={playerPosition}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshBasicMaterial color="red" />
                </mesh>
            )}

            {/* Grid Helper */}
            <gridHelper args={[10, 10]} />

            {/* Controls */}
            <OrbitControls enableZoom={false} enablePan={false} />
        </>
    );
}

export function Minimap({ playerRef }) {
    return (
        <div style={styles.minimapContainer}>
            <Canvas
                camera={{ position: [5, 5, 5], fov: 50 }}
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
        position: "absolute",
        bottom: "20px",
        right: "20px",
        width: "200px",
        height: "200px",
        border: "2px solid white",
        borderRadius: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
    },
    minimapCanvas: {
        width: "100%",
        height: "100%",
    },
};
