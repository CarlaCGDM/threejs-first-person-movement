import { useState } from "react";
import { IconButton } from "../../UI/IconButton";

function PointOfInterestInfo({ poiName, metadata, imageFiles = [], onClose }) {

    const [showMetadata, setShowMetadata] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === imageFiles.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imageFiles.length - 1 : prevIndex - 1
        );
    };

    const getVisibleThumbnails = () => {
        const thumbnails = [];
        const totalImages = imageFiles.length;

        // Get the start index for slicing
        let start = currentImageIndex - 1;
        if (start < 0) start = 0; // Avoid negative indices

        let end = start + 3;
        if (end > totalImages) {
            start = Math.max(0, totalImages - 3); // Ensure exactly 3 images are displayed
            end = totalImages;
        }

        return imageFiles.slice(start, end).map((src, index) => ({
            index: start + index,
            src,
            isActive: start + index === currentImageIndex
        }));
    };

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
                        <div style={{
                            ...styles.imageViewer,
                            width: showMetadata ? "50%" : "100%"
                        }}>
                            {/* Main Image Container */}
                            <div style={styles.mainImageContainer}>
                               
                                <div style={styles.imageContainer}>
                                    <img
                                        src={imageFiles[currentImageIndex]}
                                        alt={`${poiName} - ${currentImageIndex + 1}/${imageFiles.length}`}
                                        style={styles.mainImage}
                                    />
                                </div>


                            </div>

                            {/* <div style={styles.imageCredits}>
                                <p>Image credits</p>
                            </div> */}

                            {/* Thumbnail Carousel */}
                            <div style={styles.thumbnailContainer}>
                            <button
                                    onClick={prevImage}
                                    disabled={imageFiles.length <= 1}
                                    style={{
                                        ...styles.navButton,
                                        opacity: imageFiles.length <= 1 ? 0.5 : 1,
                                        pointerEvents: imageFiles.length <= 1 ? "none" : "auto"
                                    }}
                                >
                                    &lt;
                                </button>
                                {getVisibleThumbnails().map((thumb) => (
                                    <div
                                        key={thumb.index}
                                        style={{
                                            ...styles.thumbnail,
                                            border: thumb.isActive ? "2px solid #272626" : "1px solid #ccc",
                                            opacity: thumb.isActive ? 1 : 0.7
                                        }}
                                        onClick={() => setCurrentImageIndex(thumb.index)}
                                    >
                                        <img
                                            src={thumb.src}
                                            alt={`Thumbnail ${thumb.index + 1}`}
                                            style={styles.thumbnailImage}
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={nextImage}
                                    disabled={imageFiles.length <= 1}
                                    style={{
                                        ...styles.navButton,
                                        opacity: imageFiles.length <= 1 ? 0.5 : 1,
                                        pointerEvents: imageFiles.length <= 1 ? "none" : "auto"
                                    }}
                                >
                                    &gt;
                                </button>
                            </div>
                        </div>

                        {/* Metadata Section - Right Side */}
                        {showMetadata && <div style={styles.metadataContainer}>
                            <div style={styles.metadataPanel}>
                                <h2 style={styles.name}>{poiName}</h2>
                                <div style={styles.metadataList}>
                                    <div style={styles.metadataItem}>
                                        <h3 style={styles.label}>Descripción</h3>
                                        <p style={styles.value}>{metadata.description}</p>
                                    </div>

                                    {metadata.location && (
                                        <div style={styles.metadataItem}>
                                            <h3 style={styles.label}>Location</h3>
                                            <p style={styles.value}>{metadata.location}</p>
                                        </div>
                                    )}

                                    {metadata.historicalPeriod && (
                                        <div style={styles.metadataItem}>
                                            <h3 style={styles.label}>Historical Period</h3>
                                            <p style={styles.value}>{metadata.historicalPeriod}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>}
                    </div>

                    {/* Buttons Row */}
                    <div style={styles.buttonsRow}>
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

// Updated Styles with Horizontal Layout
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
    imageViewer: {
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    mainImageContainer: {
        minHeight: "300px",
        display: "flex",
    },
    imageContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
    },
    mainImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    imageCredits: {
        color: "#272626",
        margin: 0,
        fontFamily: "Mulish, sans-serif",
        fontSize: "0.8rem",
        lineHeight: "1.4",
    },
    navButton: {
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(39, 38, 38, 0.7)",
        color: "#E2E2E2",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        fontSize: "20px",
        cursor: "pointer",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    thumbnailContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        height: "80px",
        overflow: "hidden", 
    },
    thumbnail: {
        width: "120px",
        height: "80px",
        borderRadius: "4px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    thumbnailImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    metadataContainer: {
        width: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    metadataPanel: {
        backgroundColor: "#F3EEEB",
        padding: "20px",
        border: "2px solid #272626",
        borderRadius: "0.25vw",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "gray transparent",
    },
    metadataList: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    metadataItem: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    name: {
        color: "#272626",
        margin: "0 0 15px 0",
        fontFamily: "Mulish, sans-serif",
        fontSize: "1.5rem",
    },
    label: {
        color: "#272626",
        margin: 0,
        fontFamily: "Mulish, sans-serif",
        fontSize: "0.9rem",
        fontWeight: "bold",
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

export default PointOfInterestInfo;