import { useState } from "react";
import { IconButton } from "../../UI/IconButton";
import { MetadataPanel } from "../MetadataPanel";
import { ModelViewer } from "../ModelViewer";
import { ImageViewer } from "../ImageViewer"; // Import the ImageViewer component
import { degreesToRadians } from "../../../utils/math";
import { useTranslations } from "../../../hooks/useTranslations";

function PropInfo({ artifactName, commonName, infoViewRotation, metadata, detailedModelFile, size, onClose, imageFiles = [] }) {
    const [showHighestRes, setShowHighestRes] = useState(false);
    const [showMetadata, setShowMetadata] = useState(true);
    const [showImages, setShowImages] = useState(false); // New state for toggling between 3D and images

    const { getComponentLabels } = useTranslations();
    const UILabels = getComponentLabels('propInfo'); // Retrieve metadataPanel labels

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                <button onClick={onClose} style={styles.closeButton}>
                    &times;
                </button>

                <div style={styles.contentWrapper}>
                    <div style={styles.infoViewer}>
                        {showImages ? (
                            <ImageViewer
                                imageFiles={imageFiles}
                                showMetadata={showMetadata}
                                containerStyle={{
                                    ...styles.modelSection,
                                    width: showMetadata ? "65%" : "100%"
                                }}
                            />
                        ) : (
                            <ModelViewer
                                modelFiles={detailedModelFile}
                                size={size}
                                rotation={degreesToRadians(infoViewRotation)}
                                showHighestRes={showHighestRes}
                                containerStyle={{
                                    ...styles.modelSection,
                                    width: showMetadata ? "65%" : "100%"
                                }}
                            />
                        )}

                        <MetadataPanel
                            title={commonName}
                            subtitle={artifactName}
                            metadata={metadata}
                            showMetadata={showMetadata}
                            onToggleMetadata={() => setShowMetadata(!showMetadata)}
                        />
                    </div>

                    <div style={styles.buttonsRow}>
                        {!showImages && ( // Only show HD toggle when in 3D view
                            <IconButton
                                iconOn="toggle_hd_on.svg"
                                isActive={showHighestRes}
                                onClick={() => setShowHighestRes(!showHighestRes)}
                                title={showHighestRes ? UILabels.toggleHDOn : UILabels.toggleHDOff}
                                backgroundColor={showHighestRes ? "#272626" : "#777777"}
                            />
                        )}
                        {imageFiles.length > 0 && <IconButton
                            iconOn="toggle_model.svg"
                            iconOff="toggle_images.svg"
                            isActive={showImages}
                            onClick={() => setShowImages(!showImages)}
                            title={showImages ? UILabels.toggleModel : UILabels.toggleImages}
                            backgroundColor={showImages ? "#272626" : "#777777"}
                        />}
                        <IconButton
                            iconOn="toggle_info_on.svg"
                            isActive={showMetadata}
                            onClick={() => setShowMetadata(!showMetadata)}
                            title={showMetadata ? UILabels.toggleMetadataOn : UILabels.toggleMetadataOff}
                            backgroundColor={showMetadata ? "#272626" : "#777777"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

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