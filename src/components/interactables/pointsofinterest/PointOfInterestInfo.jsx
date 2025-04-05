import { useState } from "react";
import { IconButton } from "../../UI/IconButton";
import { ImageViewer } from "../ImageViewer";
import { MetadataPanel } from "../MetadataPanel";

function PointOfInterestInfo({ poiName, metadata, imageFiles = [], onClose }) {
    const [showMetadata, setShowMetadata] = useState(true);

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                {/* Close Button */}
                <button onClick={onClose} style={styles.closeButton}>
                    &times;
                </button>

                {/* Main Content Area */}
                <div style={styles.contentWrapper}>
                    {/* Horizontal Layout Container */}
                    <div style={styles.horizontalContainer}>
                        {/* Image Viewer - Left Side */}
                        <ImageViewer
                            imageFiles={imageFiles}
                            showMetadata={showMetadata}
                        />

                        {/* Metadata Section - Right Side */}
                        <MetadataPanel
                            title={poiName}
                            metadata={metadata}
                            showMetadata={showMetadata}
                            onToggleMetadata={() => setShowMetadata(!showMetadata)}
                            customFields={['description']} // Only show these fields
                        />
                    </div>

                    {/* Buttons Row */}
                    <div style={styles.buttonsRow}>
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
    horizontalContainer: {
        display: "flex",
        flex: 1,
        gap: "20px",
        overflow: "hidden",
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

export default PointOfInterestInfo;