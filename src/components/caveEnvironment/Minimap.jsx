
import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Clone } from "@react-three/drei";
import * as THREE from "three";

function MinimapScene({ playerRef }) {
    const { scene: model } = useGLTF("/assets/models/CovaBonica_LODs/LOD_00.glb"); 
    const { scene: path } = useGLTF("/assets/models/CovaBonica_LODs/cb_pasarela.glb"); 

    const [playerPosition, setPlayerPosition] = useState([0, 0, 0])

    // Clone and scale the cave model
    const miniModel = useMemo(() => model.clone(), [model]); // Memoize the cloned scene to avoid re-cloning on every render
    miniModel.scale.set(0.3, 0.3, 0.3); // Scale up to 0.5
    // Traverse the model and replace materials with a white material
    miniModel.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        }
    });

    // Clone and scale the path model
    const miniPath = useMemo(() => path.clone(), [path]); // Memoize the cloned scene to avoid re-cloning on every render
    miniPath.scale.set(0.3, 0.3, 0.3); // Scale up to 0.5
    // Traverse the model and replace materials with a white material
    miniPath.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({ color: "blue", transparent: true, opacity: 1, side: THREE.DoubleSide});
        }
    });

    // Update player sphere position to match the main player's position
    useEffect(() => {
        if (!playerRef?.current) return; // Ensure playerRef.current is valid
    
        const updatePlayerPosition = () => {
            if (!playerRef.current) return; // Double-check inside the function
            const newPlayerPosition = playerRef.current.translation();
            setPlayerPosition([
                newPlayerPosition.x * 0.3,
                newPlayerPosition.y * 0.3,
                newPlayerPosition.z * 0.3
            ]);
            requestAnimationFrame(updatePlayerPosition);
        };
    
        updatePlayerPosition();
    
        // Cleanup
        return () => {
            cancelAnimationFrame(updatePlayerPosition);
        };
    }, [playerRef]);

    return (
        <>
            {/* Add the mini model */}
            <Clone object={miniModel} />
            <Clone object={miniPath} />

            {/* Add a sphere to represent the player */}
            <mesh position={playerPosition}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="red" />
            </mesh>

            {/* Add a grid helper */}
            <gridHelper args={[10, 10]} />

            {/* Add OrbitControls */}
            <OrbitControls
                enableZoom={false} // Disable zooming
                enablePan={false} // Disable panning
            />
        </>
    );
}

export function Minimap({ playerRef }) {
    return (
        <div style={styles.minimapContainer}>
            <Canvas
                camera={{ position: [5, 5, 5], fov: 50 }} // Adjust camera position and field of view
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
        overflow: "hidden", // Ensure the canvas doesn't overflow
    },
    minimapCanvas: {
        width: "100%",
        height: "100%",
    },
};