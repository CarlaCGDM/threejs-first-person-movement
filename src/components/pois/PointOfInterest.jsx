import { Html, Clone, useGLTF, useCursor } from "@react-three/drei";
import { forwardRef, Suspense, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useSettings } from "../../context/SettingsContext";
import PulsatingIndicator from "./PulsatingIndicator";
import { FloatingName } from "../FloatingName";
import { DebugCube } from "../DebugCube";
import { useHighlightMaterial } from "../../hooks/useHighlightMaterial";
import { useFrame } from "@react-three/fiber";

const Model = ({ modelUrl, onComputedSize, onMaterialsLoaded, highlightedMaterial }) => {
    const gltf = useGLTF(modelUrl);

    useEffect(() => {
        if (gltf.scene) {
            const bbox = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            bbox.getSize(size);
            onComputedSize(size);

            const materials = [];
            gltf.scene.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material = highlightedMaterial || child.material;
                    materials.push(child.material);
                }
            });
            onMaterialsLoaded(materials);
        }
    }, [gltf.scene, onComputedSize, onMaterialsLoaded, highlightedMaterial]);

    return <Clone object={gltf.scene} />;
};

const PointOfInterest = forwardRef(({ position, poiName, metadata, modelFile, imageFile, occlusionMeshRef }, ref) => {
    const [validUrl, setValidUrl] = useState("/assets/models/treasureChest.glb");
    const [size, setSize] = useState(new THREE.Vector3(1, 1, 1));
    const [isHovered, setIsHovered] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [playerDistance, setPlayerDistance] = useState(1);
    const { dispatch, settings } = useSettings();
    const { devMode, selectedProp, selectedPOI } = settings;
    const { highlightedMaterial, transparentMaterial } = useHighlightMaterial();

    // Distance calculation
    // useFrame(() => {
    //     if (!settings.playerRef?.current) return;
    //     const playerPos = settings.playerRef.current.position;
    //     const poiPos = new THREE.Vector3(...position);
    //     setPlayerDistance(poiPos.distanceTo(playerPos));
    // });

    const handleComputedSize = useCallback((newSize) => {
        if (!newSize.equals(size)) {
            setSize(newSize);
        }
    }, [size]);

    const handleMaterialsLoaded = useCallback((newMaterials) => {
        setMaterials(newMaterials);
    }, []);

    const handlePointerOver = () => setIsHovered(true);
    const handlePointerOut = () => setIsHovered(false);

    const handleClick = () => {
        setIsHovered(false);
        dispatch({
            type: "SELECT_POI",
            payload: { poiName, metadata, imageFile },
        });
    };

    useCursor(isHovered);

    useEffect(() => {
        if (modelFile) {
            setValidUrl(modelFile);
        }
    }, [modelFile]);

    return (
        <group ref={ref} position={position}>
            <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                <Model
                    modelUrl={validUrl}
                    onComputedSize={handleComputedSize}
                    onMaterialsLoaded={handleMaterialsLoaded}
                    highlightedMaterial={isHovered ? highlightedMaterial : transparentMaterial}
                />
            </Suspense>

            {devMode && (
                <DebugCube
                    position={[0, 0, 0]}
                    size={size}
                    color="blue"
                />
            )}

            {isHovered && !selectedPOI && !selectedProp && (
                <FloatingName
                    name={playerDistance <= 5 ? poiName : "?"}
                    position={[0, 0.7, 0]}
                    playerDistance={playerDistance}
                    occlusionMeshRef={occlusionMeshRef}
                    distanceFactor={6}
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
                        opacity: playerDistance <= 5 ? 1 : 0.7
                    }}
                />
            )}

            {!selectedPOI && !selectedProp && (
                <PulsatingIndicator
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}
                    onClick={handleClick}
                />
            )}
        </group>
    );
});

export default PointOfInterest;