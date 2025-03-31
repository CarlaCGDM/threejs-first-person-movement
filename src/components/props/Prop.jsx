import { Html, Clone, useCursor, Detailed } from "@react-three/drei";
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
import { useFrame } from "@react-three/fiber";

const propPos = new THREE.Vector3();
const frameSkip = 5; // Only calculate every 5 frames
let frameCount = 0;

const Prop = forwardRef(({ position, rotation, artifactName, metadata, modelFile, detailedModelFile, teleportRotationAngle = 0, occlusionMeshRef }, ref) => {
    const [validUrl, setValidUrl] = useState("assets/models/Hapleidoceros_LODs"); // Fallback model
    const [size, setSize] = useState(new THREE.Vector3(1, 1, 1)); // Default size
    const [materials, setMaterials] = useState([]); // Store materials for highlighting
    const { dispatch, settings } = useSettings();
    const { devMode } = settings;
    const { selectedProp } = settings;
    const { selectedPOI } = settings;

    const [playerDistance, setPlayerDistance] = useState(Infinity);

    // Calculate distance to player
    // Inside component
    useFrame(() => {
        if (!settings.playerRef?.current) return;

        // Skip frames to reduce calculation frequency
        frameCount++;
        if (frameCount % frameSkip !== 0) return;

        const playerPos = settings.playerRef.current.position;
        propPos.set(position[0], position[1], position[2]); // Reuse vector

        const distance = propPos.distanceTo(playerPos);

        // Only update state if the distance crosses the threshold
        const isNearbyNow = distance <= 5;
        const wasNearby = playerDistance <= 5;

        if (isNearbyNow !== wasNearby) {
            setPlayerDistance(distance);
        }
    });

    // Use the model loader hook
    const lowResModelScene = useModelLoader(validUrl + "/LOD_00.glb", setSize, setMaterials);
    const midResModelScene = useModelLoader(validUrl + "/LOD_01.glb", setSize, setMaterials);
    const highResModelScene = useModelLoader(validUrl + "/LOD_02.glb", setSize, setMaterials);

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
                onClick={handleClick}>

                {/* Load the model with suspense */}
                <Suspense fallback={lowResModelScene ? <Clone object={lowResModelScene} /> : <Html center><span>Loading...</span></Html>}>
                    <Detailed distances={[0, 10, 20]}>
                        {highResModelScene && <Clone object={highResModelScene} />}
                        {midResModelScene && <Clone object={midResModelScene} />}
                        {lowResModelScene && <Clone object={lowResModelScene} />}
                    </Detailed>
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
                    playerDistance={playerDistance}
                    position={[0, size.y + 0.3, 0]}
                    occlusionMeshRef={occlusionMeshRef}
                    distanceFactor={5}
                />
            )}
        </group>
    );
});

export default Prop;