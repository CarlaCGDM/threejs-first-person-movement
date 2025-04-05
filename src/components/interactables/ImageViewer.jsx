import { useState } from "react";
import { ArrowLeft } from "../UI/icons/ArrowLeft";
import { ArrowRight } from "../UI/icons/ArrowRight";


export function ImageViewer({ imageFiles = [], showMetadata = true }) {
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
        <div style={{
            ...styles.imageViewer,
            width: showMetadata ? "60%" : "100%",
        }}>
            {/* Main Image Container */}
            <div style={{
                ...styles.mainImageContainer,
                height: showMetadata ? "auto" : "80%"
            }}>
                <div style={styles.imageContainer}>
                    <img
                        src={imageFiles[currentImageIndex]}
                        alt={`Image ${currentImageIndex + 1}/${imageFiles.length}`}
                        style={styles.mainImage}
                    />
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
                    <ArrowLeft />
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
                    <ArrowRight />
                </button>
            </div>
        </div>
    );
}

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
        borderRadius: "0.5vw",
    },
    navButton: {
        position: "relative",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(39, 38, 38, 0.7)",
        color: "#E2E2E2",
        border: "none",
        borderRadius: "50%",
        width: "2.5vw",
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
    },
};