import { Html, Clone, useGLTF, useCursor } from "@react-three/drei";
import { forwardRef, Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { useSettings } from "../../context/SettingsContext";
import { degreesToRadians } from "../../utils/math";
import { useModelLoader } from "../../hooks/useModelLoader";
import { useHoverEffect } from "../../hooks/useHoverEffect";
import { useTeleportPosition } from "../../hooks/useTeleportPosition";
import { DebugCube } from "../DebugCube";
import { TeleportMarker } from "../TeleportMarker";
import { FloatingName } from "../FloatingName";

const Prop = forwardRef(({ position, rotation, artifactName, metadata, modelFile, detailedModelFile, teleportRotationAngle = 0, occlusionMeshRef }, ref) => {
    const [validUrl, setValidUrl] = useState("/assets/models/treasureChest.glb"); // Fallback model
    const [size, setSize] = useState(new THREE.Vector3(1, 1, 1)); // Default size
    const [materials, setMaterials] = useState([]); // Store materials for highlighting
    const { dispatch, settings } = useSettings();
    const { devMode } = settings;
    const { selectedProp } = settings;
    const { selectedPOI } = settings;

    // Use the model loader hook
    const modelScene = useModelLoader(validUrl, setSize, setMaterials);

    // Convert degrees to radians
    const radRotation = degreesToRadians(rotation || [0, 0, 0]);

    // Use the teleport position hook
    const offset = useTeleportPosition(size, rotation, teleportRotationAngle);

    // Use the hover effect hook
    const [isHovered, hoverEventHandlers] = useHoverEffect(materials);

    // Use cursor hook for visual feedback
    useCursor(isHovered);

    // Handle click events
    const handleClick = () => {
        // Notify the SettingsContext that this prop was clicked
        dispatch({
            type: "SELECT_PROP",
            payload: { artifactName, metadata, detailedModelFile, size },
        });
    };

    useEffect(() => {
        if (modelFile) {
            setValidUrl(modelFile);
        }
    }, [modelFile]);

    return (
        <group ref={ref} position={position}>
            {/* Rotated Group (For Model & Colliders) */}
            <group
                rotation={radRotation || [0, 0, 0]}
                {...hoverEventHandlers} // Spread hover event handlers
                onClick={handleClick}
            >
                {/* Load the model with suspense */}
                <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                    <Clone object={modelScene} />
                </Suspense>

                {/* Render bounding box debug */}
                {devMode && <DebugCube position={[0, 0, 0]} size={size} color="red" />}
            </group>

            {/* Render teleport debug */}
            {devMode && <TeleportMarker position={offset} />}

            {/* Render floating name */}
            {!selectedPOI && !selectedProp && (
                <FloatingName
                    name={artifactName}
                    position={[0, size.y + 0.3, 0]}
                    occlusionMeshRef={occlusionMeshRef}
                    distanceFactor={3}
                />
            )}
        </group>
    );
});

export default Prop;