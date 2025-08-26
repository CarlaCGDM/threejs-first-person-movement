import { useState, useRef, useEffect } from "react";
import { useTranslations } from "../../hooks/useTranslations";

export function ImageViewer({ imageFiles = [], showMetadata = true }) {
    const [zoom, setZoom] = useState(1); // Zoom level (1 = 100% size)
    const [pan, setPan] = useState({ x: 0, y: 0 }); // Image pan position
    const [isDragging, setIsDragging] = useState(false); // Flag for drag state
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Starting position of the drag
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    const maxZoom = 3; // Maximum zoom level
    const minZoom = 1; // Minimum zoom level (image should not shrink below its original size)

    const { getComponentLabels } = useTranslations();
    const UILabels = getComponentLabels('metadataPanel'); // Retrieve metadataPanel labels

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    // Reset pan when image changes or zoom resets
    useEffect(() => {
        setPan({ x: 0, y: 0 });
        
        // Load and get dimensions of the current image
        if (imageFiles[currentImageIndex]?.image) {
            const img = new Image();
            img.onload = () => {
                setImageDimensions({
                    width: img.width,
                    height: img.height
                });
            };
            img.src = imageFiles[currentImageIndex].image;
        }
    }, [currentImageIndex, imageFiles]);

    // Update container dimensions when mounted and on window resize
    useEffect(() => {
        const updateContainerDimensions = () => {
            if (containerRef.current) {
                setContainerDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateContainerDimensions();
        window.addEventListener('resize', updateContainerDimensions);
        
        return () => {
            window.removeEventListener('resize', updateContainerDimensions);
        };
    }, []);

    // Zoom function with wheel
    const handleWheel = (event) => {
        event.preventDefault();
        
        // Get cursor position relative to image
        const rect = containerRef.current.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;
        
        // Calculate current position in the image
        const imageX = cursorX - pan.x;
        const imageY = cursorY - pan.y;
        
        // Determine zoom direction and amount
        const delta = event.deltaY < 0 ? 0.1 : -0.1; 
        const newZoom = Math.min(maxZoom, Math.max(minZoom, zoom + delta));
        
        // Only proceed if zoom actually changed
        if (newZoom !== zoom) {
            // Calculate new pan position to zoom toward cursor
            const newPanX = cursorX - (imageX * (newZoom / zoom));
            const newPanY = cursorY - (imageY * (newZoom / zoom));
            
            setZoom(newZoom);
            setPan({ 
                x: newPanX,
                y: newPanY
            });
        }
    };

    // Handle dragging for panning
    const handleMouseDown = (event) => {
        if (zoom <= minZoom) return; // Disable panning at minimum zoom
        setIsDragging(true);
        setDragStart({ 
            x: event.clientX - pan.x, 
            y: event.clientY - pan.y 
        });
    };

    const handleMouseMove = (event) => {
        if (!isDragging || zoom <= minZoom) return;
        
        const newX = event.clientX - dragStart.x;
        const newY = event.clientY - dragStart.y;
        
        // Calculate boundaries for panning
        const zoomedWidth = imageDimensions.width * zoom;
        const zoomedHeight = imageDimensions.height * zoom;
        
        // Allow panning within these boundaries
        const minX = containerDimensions.width - zoomedWidth;
        const minY = containerDimensions.height - zoomedHeight;
        
        // Update pan position with boundaries
        setPan({ 
            x: Math.min(Math.max(newX, minX), 0),
            y: Math.min(Math.max(newY, minY), 0) 
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Navigation
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === imageFiles.length - 1 ? 0 : prevIndex + 1
        );
        setZoom(1); // Reset zoom when changing images
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imageFiles.length - 1 : prevIndex - 1
        );
        setZoom(1); // Reset zoom when changing images
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
        <div
            style={{
                ...styles.imageViewer,
                width: showMetadata ? "60%" : "100%",
            }}
        >
            {/* Main Image Container */}
            <div 
                style={{ ...styles.mainImageContainer, height: showMetadata ? "auto" : "80%" }}
                onWheel={handleWheel} // Enable zooming with mouse wheel
            >
                <div
                    ref={containerRef}
                    style={styles.imageContainer}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => {
                        setIsHovering(false);
                        handleMouseUp();
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <img
                        ref={imageRef}
                        src={imageFiles[currentImageIndex]?.image}
                        alt={`Image ${currentImageIndex + 1}/${imageFiles.length}`}
                        style={{
                            ...styles.mainImage,
                            transform: `scale(${zoom})`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease',
                            transformOrigin: 'center center',
                            marginLeft: `${pan.x}px`,
                            marginTop: `${pan.y}px`
                        }}
                    />
                    {/* Image description overlay (only shows when not hovering) */}
                    {imageFiles[currentImageIndex]?.imageDescription && (
                        <div style={{ ...styles.imageDescriptionOverlay, opacity: isHovering ? 0.25 : 1 }}>
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
                        pointerEvents: imageFiles.length <= 1 ? "none" : "auto",
                    }}
                >
                    <img
                        src={`/assets/icons/ui/small_arrow_left.svg`}
                        alt={UILabels.prevImage}
                    />
                </button>
                {getVisibleThumbnails().map((thumb) => (
                    <div
                        key={thumb.index}
                        style={{
                            ...styles.thumbnail,
                            border: thumb.isActive ? "2px solid #272626" : "1px solid #ccc",
                            opacity: thumb.isActive ? 1 : 0.7,
                        }}
                        onClick={() => setCurrentImageIndex(thumb.index)}
                    >
                        <img
                            src={thumb.src}
                            alt={`${UILabels.thumbnailAltText} ${thumb.index + 1}`}
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
                        pointerEvents: imageFiles.length <= 1 ? "none" : "auto",
                    }}
                >
                    <img
                        src={`/assets/icons/ui/small_arrow_right.svg`}
                        alt={UILabels.nextImage}
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
        width: "100%",
    },
    imageContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: 'relative', // Needed for absolute positioning of overlay
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        overflow: "hidden", // Important: prevent image from overflowing container
        cursor: "grab", // Indicate draggable
        borderRadius: "0.5vw",
    },
    mainImage: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
        userSelect: "none", // Prevent image selection during drag
    },
    imageDescriptionOverlay: {
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '0 0 0.5vw 0.5vw',
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