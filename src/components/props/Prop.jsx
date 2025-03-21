import { Html, Clone, useGLTF, useCursor } from "@react-three/drei";
import { forwardRef, Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useSettings } from "../../context/SettingsContext";

const Model = ({ modelUrl, onComputedSize, onMaterialsLoaded }) => {
    const gltf = useGLTF(modelUrl);

    useEffect(() => {
        if (gltf.scene) {
            const bbox = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            onComputedSize(size); // Pass the computed size to the parent

            // Collect materials for highlighting
            const materials = [];
            gltf.scene.traverse((child) => {
                if (child.isMesh && child.material) {
                    materials.push(child.material);
                }
            });
            onMaterialsLoaded(materials); // Pass materials to the parent
        }
    }, [gltf.scene, onComputedSize, onMaterialsLoaded]);

    return <Clone object={gltf.scene} />;
};

const Prop = forwardRef(({ position, rotation, artifactName, metadata, modelFile, detailedModelFile, teleportRotationAngle = 0, occlusionMeshRef }, ref) => {
    const [validUrl, setValidUrl] = useState("/assets/models/treasureChest.glb"); // Fallback model
    const [size, setSize] = useState(new THREE.Vector3(1, 1, 1)); // Default size
    const [isHovered, setIsHovered] = useState(false); // Track hover state
    const [materials, setMaterials] = useState([]); // Store materials for highlighting
    const { dispatch, settings } = useSettings();
    const { devMode } = settings;
    const { selectedProp } = settings;
    const { selectedPOI } = settings;

    // Convert degrees to radians
    const radRotation = rotation.map(THREE.MathUtils.degToRad);
    const radTeleportRotation = THREE.MathUtils.degToRad(teleportRotationAngle);

    // Calculate the teleport position
    const teleportOffset = new THREE.Vector3(
        Math.sin(radTeleportRotation) * (size.x / 2 + 1.0), // 0.5 meters away
        0.125,
        Math.cos(radTeleportRotation) * (size.z / 2 + 1.0) // 0.5 meters away
    );

    // Highlight effect on hover
    useEffect(() => {
        if (materials.length > 0) {
            materials.forEach((material) => {
                if (isHovered) {
                    // Increase emissive intensity for highlight effect
                    material.emissive = new THREE.Color(0xffffff);
                    material.emissiveIntensity = 0.5;
                } else {
                    // Reset emissive properties
                    material.emissive = new THREE.Color(0x000000);
                    material.emissiveIntensity = 0;
                }
                material.needsUpdate = true; // Ensure the material updates
            });
        }
    }, [isHovered, materials]);

    // Handle click events
    const handleClick = () => {
        console.log("size is: " + size.x)
        // Notify the SettingsContext that this prop was clicked
        dispatch({
            type: "SELECT_PROP",
            payload: { artifactName, metadata, detailedModelFile, size },
        });
    };

    // Handle hover events
    const handlePointerOver = () => {
        setIsHovered(true);
    };

    const handlePointerOut = () => {
        setIsHovered(false);
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
            rotation={radRotation || [0, 0, 0]}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
        >
            {/* Physics collider */}
            <RigidBody type="fixed" colliders="cuboid">
                <CuboidCollider args={[size.x / 2, size.y / 2, size.z / 2]} position={[0, size.y / 2, 0]} />
            </RigidBody>

            {/* Load the model with suspense */}
            <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                <Model modelUrl={validUrl} onComputedSize={setSize} onMaterialsLoaded={setMaterials} />
            </Suspense>

            {/* Debug meshes (only visible in devMode) */}
            {devMode && (
                <>
                    {/* Model bounding box for debugging */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[size.x, size.y, size.z]} />
                        <meshBasicMaterial color="red" wireframe />
                    </mesh>

                    {/* Teleport position marker for debugging */}
                    <mesh position={teleportOffset}>
                        <boxGeometry args={[0.25, 0.25, 0.25]} />
                        <meshBasicMaterial color="red" />
                    </mesh>
                </>
            )}

            {/* Floating name */}
            {!selectedPOI && !selectedProp && <Html as="div" center occlude={[occlusionMeshRef]} position={[0, size.y + 0.3, 0]}>
                <p style={{
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: "5px",
                    borderRadius: "5px"
                }}>
                    {artifactName}
                </p>
            </Html>}
        </group>
    );
});

export default Prop;