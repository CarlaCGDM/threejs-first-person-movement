import { Clone, Detailed } from "@react-three/drei";
import { forwardRef, Suspense, useState, useEffect } from "react";
import { useSettings } from "../../../context/SettingsContext";
import { degreesToRadians } from "../../../utils/math";
import { useModelLoader } from "../hooks/useModelLoader";
import { useTeleportPosition } from "../hooks/useTeleportPosition";
import { DebugCube } from "../DebugCube";
import { TeleportMarker } from "../TeleportMarker";
import { FloatingName } from "../FloatingName";
import { usePlayerDistance } from "../hooks/usePlayerDistance";
import { useLODModels } from "../hooks/useLODModels";
import { usePropInteractions } from "../hooks/usePropInteractions";

/**
 * Interactive 3D artifact component with:
 * - Level-of-Detail (LOD) rendering
 * - Hover/click interactions
 * - Dynamic distance-based behaviors
 * - Teleportation waypoints
 * - Debug visualization options
 * 
 * Props:
 * @param {number[]} position - [x,y,z] world coordinates
 * @param {number[]} rotation - [x,y,z] rotation in degrees
 * @param {string} artifactName - Display name
 * @param {object} metadata - Additional artifact data
 * @param {string} modelFile - Base path for 3D models
 * @param {string} detailedModelFile - High-res model for inspection view
 * @param {number} [teleportRotationAngle=0] - Facing direction after teleport
 * @param {React.Ref} occlusionMeshRef - Reference for name tag visibility culling
 * @param {React.Ref} ref - Forwarded ref to the group
 */
const Prop = forwardRef((props, ref) => {
    // Destructure all component props
    const {
        position,
        rotation,
        artifactName,
        metadata,
        modelFile,
        detailedModelFile,
        teleportRotationAngle = 0,  // Default facing forward
        occlusionMeshRef
    } = props;

    // Access global settings and state
    const { dispatch, settings } = useSettings();
    const {
        devMode,       // Debug visualization toggle
        selectedProp,  // Currently selected artifact
        selectedPOI,   // Currently selected point-of-interest
        playerRef      // Reference to player object
    } = settings;

    // Component state and custom hooks
    // -----------------------------------------------------------------

    // Model URL handling with fallback
    const [validUrl, setValidUrl] = useState("/assets/models/Hapleidoceros_LODs");

    // Track player proximity (optimized with frame skipping)
    const playerDistance = usePlayerDistance(position, playerRef);

    // Load LOD models and get their dimensions/materials
    const { models, size, materials } = useLODModels(validUrl, useModelLoader);

    // Handle hover/click interactions with material effects
    const { interactionHandlers } = usePropInteractions(
        materials,
        dispatch,
        artifactName,
        metadata,
        detailedModelFile,
        size
    );

    // Calculate teleport position based on object bounds
    const teleportOffset = useTeleportPosition(size, rotation, teleportRotationAngle);

    // Convert rotation from degrees to radians for Three.js
    const radRotation = degreesToRadians(rotation || [0, 0, 0]);

    // Effects
    // -----------------------------------------------------------------

    // Update model URL when prop changes
    useEffect(() => {
        if (modelFile) {
            setValidUrl(modelFile);
        }
    }, [modelFile]);

    // Render
    // -----------------------------------------------------------------

    return (
        <group ref={ref} position={position}>
            {/* Rotated container for model and interactions */}
            <group rotation={radRotation} {...interactionHandlers}>
                {/* Async model loading with suspense fallback */}
                <Suspense fallback={models.low ?
                    <Clone object={models.low} /> :  // Show lowest LOD while loading
                    <LoadingFallback />             // Generic loader if no models exist
                }>
                    {/* LOD switching at 10m and 20m distances */}
                    <Detailed distances={[0, 10, 20]}>
                        {models.high && <Clone object={models.high} />}  {/* <10m */}
                        {models.mid && <Clone object={models.mid} />}    {/* 10-20m */}
                        {models.low && <Clone object={models.low} />}    {/* >20m */}
                    </Detailed>
                </Suspense>

                {/* Debug bounding box in development mode */}
                {devMode && <DebugCube size={size} />}
            </group>

            {/* Teleport target marker (debug only) */}
            {devMode && <TeleportMarker position={teleportOffset} />}

            {/* Floating name tag - hides during interactions */}
            {!selectedPOI && !selectedProp && (
                <FloatingName
                    name={artifactName}
                    playerDistance={playerDistance}
                    distanceFactor={5}              // Visibility scaling
                    position={[0, size.y + 0.3, 0]} // Position above object
                    occlusionMeshRef={occlusionMeshRef} // Hide when obstructed
                />
            )}
        </group>
    );
});

export default Prop;