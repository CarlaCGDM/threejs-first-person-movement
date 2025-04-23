import { Clone, Detailed, useGLTF } from "@react-three/drei";
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
import { CF_WORKER_URL } from "../../../config";

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
 * 
 */
const Prop = forwardRef((props, ref) => {
    // Destructure all component props (keep existing)
    const {
        position,
        rotation,
        artifactName,
        commonName,
        infoViewRotation,
        metadata,
        modelFile,
        detailedModelFile,
        teleportRotationAngle = 0,
        imageFiles,
        occlusionMeshRef
    } = props;

    // Access global settings and state (keep existing)
    const { dispatch, settings } = useSettings();
    const {
        devMode,
        selectedProp,
        selectedPOI,
        playerRef
    } = settings;

    // State for low-res model (new)
    const [lowResModel, setLowResModel] = useState(null);
    const [lowResSize, setLowResSize] = useState({ x: 1, y: 1, z: 1 });

    // Load low-res model immediately (new)
    useEffect(() => {
        const loadLowRes = async () => {
            try {
                const url = modelFile || "Hapleidoceros_LODs";
                const lowResUrl = `${CF_WORKER_URL + url}/LOD_00.glb`;
                const model = await useGLTF(lowResUrl);
                
                // Calculate size for the low-res model
                const box = new THREE.Box3().setFromObject(model.scene);
                const size = box.getSize(new THREE.Vector3());
                
                setLowResModel(model.scene);
                setLowResSize(size);
            } catch (error) {
                console.error("Failed to load low-res model:", error);
            }
        };
        
        loadLowRes();
    }, [modelFile]);

    // Existing hooks (keep all these)
    const [validUrl, setValidUrl] = useState("Hapleidoceros_LODs");
    const playerDistance = usePlayerDistance(position, playerRef);
    const { models, size, materials } = useLODModels(validUrl, useModelLoader);
    const { interactionHandlers } = usePropInteractions(
        materials,
        dispatch,
        artifactName,
        commonName,
        infoViewRotation,
        metadata,
        detailedModelFile,
        imageFiles,
        size
    );
    const teleportOffset = useTeleportPosition(size, rotation, teleportRotationAngle);
    const radRotation = degreesToRadians(rotation || [0, 0, 0]);

    // Update model URL when prop changes (keep existing)
    useEffect(() => {
        if (modelFile) {
            setValidUrl(modelFile);
        }
    }, [modelFile]);

    // Determine which size to use (new)
    const currentSize = models.high ? size : lowResSize;

    return (
        <group ref={ref} position={position}>
            {/* Rotated container for model and interactions */}
            <group rotation={radRotation} {...interactionHandlers}>
                {/* Always show low-res model if available */}
                {lowResModel && <primitive object={lowResModel} />}
                
                {/* Suspense-wrapped LODs (existing functionality) */}
                <Suspense fallback={null}>
                    <Detailed distances={[0, 10, 20]}>
                        {models.high && <Clone object={models.high} />}
                        {models.mid && <Clone object={models.mid} />}
                        {models.low && <Clone object={models.low} />}
                    </Detailed>
                </Suspense>

                {/* Debug bounding box (using current size) */}
                {devMode && <DebugCube size={currentSize} />}
            </group>

            {/* Teleport target marker (using current size) */}
            {devMode && <TeleportMarker position={teleportOffset} />}

            {/* Floating name tag (using current size) */}
            {!selectedPOI && !selectedProp && (
                <FloatingName
                    name={artifactName}
                    playerDistance={playerDistance}
                    distanceFactor={5}
                    position={[0, currentSize.y + 0.3, 0]}
                    occlusionMeshRef={occlusionMeshRef}
                />
            )}
        </group>
    );
});

export default Prop;