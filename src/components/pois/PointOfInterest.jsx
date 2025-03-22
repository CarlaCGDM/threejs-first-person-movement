import { Html, Clone, useGLTF, useCursor } from "@react-three/drei";
import { forwardRef, Suspense, useState, useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import { useSettings } from "../../context/SettingsContext";
import PulsatingIndicator from "./PulsatingIndicator";

const Model = ({ modelUrl, onComputedSize, onMaterialsLoaded, highlightedMaterial }) => {
    const gltf = useGLTF(modelUrl);

    useEffect(() => {
        if (gltf.scene) {
            const bbox = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            onComputedSize(size); // Pass the computed size to the parent

            // Collect materials for highlighting (use highlightedMaterial when needed)
            const materials = [];
            gltf.scene.traverse((child) => {
                if (child.isMesh && child.material) {
                    // Apply highlighted material or the original material
                    child.material = highlightedMaterial || child.material;
                    materials.push(child.material);
                }
            });
            onMaterialsLoaded(materials); // Pass materials to the parent
        }
    }, [gltf.scene, onComputedSize, onMaterialsLoaded, highlightedMaterial]);

    return <Clone object={gltf.scene} />;
};

const PointOfInterest = forwardRef(({ position, poiName, metadata, modelFile, imageFile, occlusionMeshRef }, ref) => {
    const [validUrl, setValidUrl] = useState("/assets/models/treasureChest.glb"); // Fallback model
    const [size, setSize] = useState(new THREE.Vector3(1, 1, 1)); // Default size
    const [isHovered, setIsHovered] = useState(false); // Track hover state
    const [materials, setMaterials] = useState([]); // Store materials for highlighting
    const { dispatch, settings } = useSettings();
    const { devMode, selectedProp, selectedPOI } = settings;

    // Highlight material for hover effect
    const highlightedMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide, // Ensure both sides are rendered
    }), []);

    const transparentMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide, // Ensure both sides are rendered
    }), []);

    // Memoize callbacks to prevent unnecessary re-renders
    const handleComputedSize = useCallback((newSize) => {
        if (!newSize.equals(size)) {
            setSize(newSize);
        }
    }, [size]);

    const handleMaterialsLoaded = useCallback((newMaterials) => {
        setMaterials(newMaterials);
    }, []);

    // Handle hover events
    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
    };

    // Handle click events
    const handleClick = () => {
        // Notify the SettingsContext that this POI was clicked
        dispatch({
            type: "SELECT_POI",
            payload: { poiName, metadata, imageFile },
        });
    };

    // Use cursor hook for visual feedback
    useCursor(isHovered);

    useEffect(() => {
        if (modelFile) {
            setValidUrl(modelFile);
        }
    }, [modelFile]);

    return (
        <group
            ref={ref}
            position={position}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
        >
            {/* Load the model with suspense */}
            <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                <Model
                    modelUrl={validUrl}
                    onComputedSize={handleComputedSize}
                    onMaterialsLoaded={handleMaterialsLoaded}
                    highlightedMaterial={isHovered ? highlightedMaterial : transparentMaterial}
                />
            </Suspense>

            {/* Debug meshes (only visible in devMode) */}
            {devMode && (
                <>
                    {/* Model bounding box for debugging */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[size.x, size.y, size.z]} />
                        <meshBasicMaterial color="blue" wireframe />
                    </mesh>
                </>
            )}

            {/* Floating name */}
            {isHovered && (
                <Html as="div" center position={[0, 0, 0]}>
                    <p style={{
                        display: "inline-block",  // Ensures it fits the text width
                        whiteSpace: "nowrap",  // Prevents word wrapping
                        color: "white",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        padding: "5px",
                        borderRadius: "5px",
                    }}>
                        {poiName}
                    </p>
                </Html>
            )}
            {!isHovered && !selectedPOI && !selectedProp && <PulsatingIndicator position={position} />}
        </group>
    );
});

export default PointOfInterest;