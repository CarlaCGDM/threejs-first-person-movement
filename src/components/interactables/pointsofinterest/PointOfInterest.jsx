import { Html, Clone, useCursor } from "@react-three/drei";
import { forwardRef, Suspense, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useSettings } from "../../../context/SettingsContext";
import PulsatingIndicator from "./PulsatingIndicator";
import { FloatingName } from "../FloatingName";
import { DebugCube } from "../DebugCube";
import { useHighlightMaterial } from "../hooks/useHighlightMaterial";
import { usePOIModelLoader } from "../hooks/usePOIModelLoader";
import { usePOIInteractions } from "../hooks/usePOIInteractions";
import { usePlayerDistance } from "../hooks/usePlayerDistance";

/**
 * Interactive Point of Interest component featuring:
 * - Dynamic 3D model loading
 * - Hover/click interactions with visual feedback
 * - Distance-based behavior (proximity detection)
 * - Pulsating selection indicator
 * - Debug visualization tools
 * - Asynchronous loading states
 * 
 * Props:
 * @param {number[]} position - [x,y,z] world coordinates
 * @param {string} poiName - Display name for the POI
 * @param {object} metadata - Additional data about the location
 * @param {string} modelFile - Path to the 3D model asset
 * @param {string[]} imageFiles - Associated images for detailed view
 * @param {React.Ref} occlusionMeshRef - Reference for visibility culling
 * @param {React.Ref} ref - Forwarded ref to the group
 */
const PointOfInterest = forwardRef(({
  position,
  poiName,
  metadata,
  modelFile,
  imageFiles,
  occlusionMeshRef
}, ref) => {
  // State Management
  // -----------------------------------------------------------------

  const [validUrl, setValidUrl] = useState("/assets/models/treasureChest.glb");   // Model URL with fallback to default treasure chest
  const [size, setSize] = useState(new THREE.Vector3(1, 1, 1)); // Dimensions of the loaded model (default 1x1x1 cube)
  const [materials, setMaterials] = useState([]); // Materials from the model for hover effects

  // Context and Hooks
  // -----------------------------------------------------------------

  // Access global settings and dispatch function
  const { dispatch, settings } = useSettings();
  const { devMode, selectedProp, selectedPOI, playerRef } = settings;

  // Track player proximity (optimized with frame skipping)
  const playerDistance = usePlayerDistance(position, playerRef);

  // Interaction state and handlers (must be before model loader)
  const { isHovered, interactionHandlers } = usePOIInteractions(
    dispatch,
    poiName,
    metadata,
    imageFiles
  );

  const { highlightedMaterial, transparentMaterial } = useHighlightMaterial();  // Materials for hover highlighting
  const currentMaterial = isHovered ? highlightedMaterial : transparentMaterial;  // Determine which material to use based on hover state

  // Model Loading
  // -----------------------------------------------------------------

  // Load and manage the 3D model
  const { scene } = usePOIModelLoader(
    validUrl,
    useCallback((newSize) => {
      // Only update if size actually changed
      if (!newSize.equals(size)) setSize(newSize);
    }, [size]),
    useCallback((mats) => setMaterials(mats), []),
    currentMaterial
  );

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
      {/* Async model loading with fallback UI */}
      <Suspense fallback={null
      }>
        {/* Only render if model loaded successfully */}
        {scene && <Clone object={scene} />}
      </Suspense>

      {/* Debug bounding box (visible in dev mode) */}
      {devMode && (
        <DebugCube
          size={size}
          color="blue" // Different color than props for distinction
        />
      )}

      {/* Floating name tag (visible on hover when nothing else is selected) */}
      {playerDistance <= 5 && !selectedPOI && !selectedProp && (
        <FloatingName
          name={poiName} // Show "?" when far away
          position={[0, 0.5, 0]} // Position above center
          playerDistance={playerDistance}
          occlusionMeshRef={occlusionMeshRef}
          distanceFactor={4} // Visibility rangeaw
          style={{
            background: 'rgba(30, 30, 40, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            minWidth: '24px',
            padding: '6px 10px',
            borderRadius: '8px',
            fontSize: '14px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            opacity: playerDistance <= 5 ? 1 : 0.7 // Fade when far
          }}
        />
      )}

      {/* Pulsating selection indicator (hidden when POI/prop is selected) */}
      {!selectedPOI && !selectedProp && (
        <PulsatingIndicator
          {...interactionHandlers} // Spread all interaction handlers
        />
      )}
    </group>
  );
});

export default PointOfInterest;