import { Suspense, useState } from "react";
import { OrbitControls, Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { QualityToggle } from "./QualityToggle";
import { LazyLoadModel } from "./LazyLoadModel";


function PropInfo({ artifactName, metadata, detailedModelFile, size, onClose }) {
    const [showHighestRes, setShowHighestRes] = useState(false);

    // Default size if not provided
    const defaultSize = new THREE.Vector3(1, 1, 1);
    const modelSize = size || defaultSize;

    // Calculate camera distance based on the model's size
    const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
    const cameraDistance = maxDimension * 1;

    // Determine which model to show
    const getModelToShow = () => {

        if (showHighestRes) {
            return <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                <LazyLoadModel url={detailedModelFile + "/LOD_04.glb"} size={size} />
            </Suspense>
        } else {
            return <Suspense fallback={ <Html center><span>Loading...</span></Html> }>
                <LazyLoadModel url={detailedModelFile + "/LOD_02.glb"} size={size} />
            </Suspense>
        }
    };

    return (
        <div style={{ ...styles.overlay, pointerEvents: "auto" }}>
            <div style={styles.popup}>
                {/* Close Button */}
                <button onClick={onClose} style={styles.closeButton}>
                    &times;
                </button>

                {/* 3D Model Viewer */}
                <div style={styles.modelViewerContainer}>
        
                    <QualityToggle 
                        isHighRes={showHighestRes} 
                        onToggle={setShowHighestRes}
                    />

                    <Canvas
                        camera={{
                            position: [cameraDistance, cameraDistance, cameraDistance],
                            fov: 45,
                            near: 0.01,
                            far: 1000,
                        }}
                        style={styles.modelViewer}
                    >
                        <ambientLight intensity={4.5} />
                        <pointLight position={[10, 10, 10]} intensity={0.5} />

                        {getModelToShow()}

                        <OrbitControls enablePan={true} enableZoom={true} />
                    </Canvas>
                </div>

                {/* Model Metadata - shows immediately */}
                <div style={styles.info}>
                    <h2 style={styles.name}>{artifactName}</h2>
                    <p style={styles.description}><strong>Periodo histórico</strong></p><p style={styles.description}> {metadata.historicalPeriod}</p>
                    <p style={styles.description}><strong>Procedencia</strong></p><p style={styles.description}> {metadata.excavationSite}</p>
                    <p style={styles.description}><strong>Localización actual</strong></p><p style={styles.description}> {metadata.currentLocation}</p>
                    <p style={styles.description}><strong>Descripción</strong></p><p style={styles.description}> {metadata.description}</p>
                    <p style={styles.description}><strong>Dimensiones</strong></p><p style={styles.description}> {metadata.size}</p>
                    <p style={styles.description}><strong>Digitalización</strong></p><p style={styles.description}> {metadata.digitizedBy}</p>
                </div>
            </div>
        </div>
    );
}

// Updated styles
const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    popup: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        position: "relative",
    },
    modelViewerContainer: {
        position: "relative", // Needed for absolute positioning of toggle
    },
    qualityToggleContainer: {
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 10, // Ensure it's above the canvas
    },
    qualityToggle: {
        background: "rgba(255, 255, 255, 0.8)",
        border: "1px solid #333",
        borderRadius: "4px",
        padding: "5px 10px",
        cursor: "pointer",
        fontSize: "14px",
    },
    modelViewer: {
        width: "300px",
        height: "300px",
        borderRadius: "10px",
        overflow: "hidden",
    },
    info: {
        maxWidth: "300px",
    },
    name: {
        margin: "0 0 10px 0",
        fontSize: "24px",
        color: "#333",
    },
    description: {
        margin: 0,
        fontSize: "16px",
        color: "#555",
    },
    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "none",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
        color: "#333",
    },
};

export default PropInfo;