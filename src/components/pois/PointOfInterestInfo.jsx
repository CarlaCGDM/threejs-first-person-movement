function PointOfInterestInfo({ poiName, metadata, imageFile, onClose }) {
    return (
        <div style={{ ...styles.overlay, pointerEvents: "auto" }}>
            <div style={styles.popup}>
                {/* Close Button */}
                <button onClick={onClose} style={styles.closeButton}>
                    &times;
                </button>

                {/* POI Name */}
                <h2 style={styles.name}>{poiName}</h2>

                {/* POI Image */}
                <div style={styles.imageContainer}>
                    <img
                        src={imageFile}
                        alt={poiName}
                        style={styles.image}
                    />
                </div>

                {/* POI Description */}
                <div style={styles.info}>
                    <p style={styles.description}><strong>Description</strong></p>
                    <p style={styles.description}>{metadata.description}</p>
                </div>
            </div>
        </div>
    );
}

// Styles
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
        zIndex: 1000, // Ensure the overlay is on top
    },
    popup: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
        position: "relative", // Required for the close button positioning
        maxWidth: "400px", // Limit the width of the popup
    },
    imageContainer: {
        width: "300px", // Fixed width for the image container
        height: "300px", // Fixed height for the image container
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: "100%", // Ensure the image fills the container
        height: "100%", // Ensure the image fills the container
        objectFit: "cover", // Resize the image to fit the container while maintaining aspect ratio
    },
    info: {
        width: "100%",
        textAlign: "left",
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

export default PointOfInterestInfo;