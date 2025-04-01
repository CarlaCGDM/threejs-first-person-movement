import { Suspense, useState } from "react";
import { OrbitControls, Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { LazyLoadModel } from "./LazyLoadModel";
import { IconButton } from "../../UI/IconButton";

function PropInfo({ artifactName, metadata, detailedModelFile, size, onClose }) {
    const [showHighestRes, setShowHighestRes] = useState(false);
    const [showMetadata, setShowMetadata] = useState(true);
    const modelSize = size || new THREE.Vector3(1, 1, 1);
    const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
    const cameraDistance = maxDimension * 1;

    const getModelToShow = () => {
        const modelPath = showHighestRes ? "/LOD_04.glb" : "/LOD_02.glb";
        return (
            <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                <LazyLoadModel url={`${detailedModelFile}${modelPath}`} size={size} />
            </Suspense>
        );
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                {/* Close Button (top-right corner) */}
                <button onClick={onClose} style={styles.closeButton}>
                    &times;
                </button>

                {/* Main Content Area */}
                <div style={styles.contentWrapper}>
                    {/* Info Viewer (3D Canvas + Metadata) */}
                    <div style={styles.infoViewer}>
                        {/* 3D Canvas Section */}
                        <div style={{
                            ...styles.modelSection,
                            width: showMetadata ? "50%" : "100%"
                        }}>
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

                        {/* Metadata Section */}
                        {showMetadata && (
                            <div style={styles.metadataContainer}>
                                <div style={styles.metadataPanel}>
                                    <h2 style={styles.name}>{artifactName}</h2>
                                    <div style={styles.metadataList}>
                                        <div style={styles.metadataItem}>
                                            <h3 style={styles.label}>Periodo histórico</h3>
                                            <p style={styles.value}>{metadata.historicalPeriod}</p>
                                        </div>

                                        <div style={styles.metadataItem}>
                                            <h3 style={styles.label}>Procedencia</h3>
                                            <p style={styles.value}>{metadata.excavationSite}</p>
                                        </div>

                                        <div style={styles.metadataItem}>
                                            <h3 style={styles.label}>Localización actual</h3>
                                            <p style={styles.value}>{metadata.currentLocation}</p>
                                        </div>

                                        <div style={styles.metadataItem}>
                                            <h3 style={styles.label}>Descripción</h3>
                                            <p style={styles.value}>{metadata.description}</p>
                                        </div>

                                        <div style={styles.metadataItem}>
                                            <h3 style={styles.label}>Dimensiones</h3>
                                            <p style={styles.value}>{metadata.size}</p>
                                        </div>

                                        <div style={styles.metadataItem}>
                                            <h3 style={styles.label}>Digitalización</h3>
                                            <p style={styles.value}>{metadata.digitizedBy}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Buttons Row */}
                    <div style={styles.buttonsRow}>
                        <IconButton
                            iconOn="toggle_hd_on.svg"
                            iconOff="toggle_hd_off.svg"
                            isActive={showHighestRes}
                            onClick={() => setShowHighestRes(!showHighestRes)}
                            title="Toggle HD"
                            backgroundColor="#272626"
                        />

                        <IconButton
                            iconOn="icon_measure.svg"
                            iconOff="icon_measure.svg"
                            isActive={false}
                            onClick={() => console.log("Measure tool")}
                            title="Try quiz"
                            backgroundColor="#272626"
                        />
                        <IconButton
                            iconOn="toggle_info_on.svg"
                            iconOff="toggle_info_off.svg"
                            isActive={showMetadata}
                            onClick={() => setShowMetadata(!showMetadata)}
                            title="Toggle Info Panel"
                            backgroundColor="#272626"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Updated Styles
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
        zIndex: 2000,
        pointerEvents: "auto",
    },
    popup: {
        width: "80vw",
        height: "85vh",
        marginTop: "5vh",
        backgroundColor: "#E2E2E2",
        borderRadius: "0.5vw",
        display: "flex",
        flexDirection: "column",
        position: "relative",
    },
    contentWrapper: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "2vh 3vw",
        boxSizing: "border-box",
        gap: "20px",
    },
    infoViewer: {
        display: "flex",
        flex: 1,
        overflow: "hidden",
        alignItems: "stretch",
    },
    modelSection: {
        position: "relative",
        backgroundColor: "#E2E2E2",
        height: "100%",
    },
    modelViewer: {
        width: "100%",
        height: "100%",
    },
    metadataContainer: {
        flex: 1,
        minWidth: "300px",
        marginTop: "20px",
        marginLeft: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,

    },
    metadataPanel: {
        overflowY: "auto",
        backgroundColor: "#F3EEEB",
        padding: "0.5vw 1vw",
        border: "2px solid #272626",
        borderRadius: "0.25vw",
        paddingBottom: "20px",
        /* Scrollbar styling */
        scrollbarWidth: "thin", // For Firefox
        scrollbarColor: "gray transparent", // For Firefox
        /* WebKit browsers (Chrome, Safari) */
        "&::-webkit-scrollbar": {
            width: "6px",
        },
        "&::-webkit-scrollbar-track": {
            background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "gray",
            borderRadius: "3px",
        },
    },
    metadataList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    metadataItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    name: {
        color: "#272626",
        fontFamily: "Mulish, sans-serif",
        fontSize: "1.5rem",
    },
    label: {
        color: "#272626",
        margin: 0,
        fontFamily: "Mulish, sans-serif",
        fontSize: "0.9rem",
        letterSpacing: "0.5px",
    },
    value: {
        color: "#272626",
        margin: 0,
        fontFamily: "Mulish, sans-serif",
        fontSize: "0.9rem",
        lineHeight: "1.4",
    },
    buttonsRow: {
        display: "flex",
        gap: "15px",
        justifyContent: "center",
        paddingTop: "20px",
        borderTop: "1px solid #3a3a3a",
    },
    closeButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "none",
        border: "none",
        color: "#272626",
        fontSize: "24px",
        cursor: "pointer",
        zIndex: 30000,
    },
};

export default PropInfo;