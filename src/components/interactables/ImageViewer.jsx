import { useState } from "react";

export function ImageViewer({ imageFiles = [], showMetadata = true }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

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

        return imageFiles.slice(start, end).map((item, index) => ({
            index: start + index,
            src: item.image,
            isActive: start + index === currentImageIndex
        }));
    };

    return (
        <div style={{
            ...styles.imageViewer,
            width: showMetadata ? "60%" : "100%",
        }}>
            {/* Main Image Container */}
            <div style={{
                ...styles.mainImageContainer,
                height: showMetadata ? "auto" : "80%"
            }}>
                <div
                    style={styles.imageContainer}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <img
                        src={imageFiles[currentImageIndex]?.image}
                        alt={`Image ${currentImageIndex + 1}/${imageFiles.length}`}
                        style={styles.mainImage}
                    />
                    {/* Image description overlay (only shows when not hovering) */}
                    {imageFiles[currentImageIndex]?.imageDescription && (
                        <div style={{
                            ...styles.imageDescriptionOverlay,
                            opacity: isHovering ? 0.25 : 1
                        }}>
                            <div style={styles.imageDescriptionText}>
                                {imageFiles[currentImageIndex].imageDescription}
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
                    <img
                        src={`/assets/icons/ui/small_arrow_left.svg`}
                        alt={"Imagen anterior"}
                    />
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
                    <img
                        src={`/assets/icons/ui/small_arrow_right.svg`}
                        alt={"Imagen anterior"}
                    />
                </button>
            </div>
        </div>
    );
}

// Updated styles with overlay caption
const styles = {
    imageViewer: {
        display: "flex",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    mainImageContainer: {
        minHeight: "300px",
        maxHeight: "80%",
        display: "flex",
        flexDirection: "column",
        position: 'relative', // Needed for absolute positioning of overlay
    },
    imageContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: 'relative', // Needed for absolute positioning of overlay
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
    },
    mainImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "0.5vw",
    },
    imageDescriptionOverlay: {
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '0 0 4px 4px',
        transition: 'opacity 0.3s ease', // Keep the transition here
    },
    imageDescriptionText: {
        fontSize: '0.8rem',
        lineHeight: '1.3',
        textAlign: 'center',
    },
    navButton: {
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(39, 38, 38, 0.2)",
        //color: "#E2E2E2",
        border: "none",
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
        width: "100%",
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
    }
};