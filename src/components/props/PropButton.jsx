import { useState } from "react";

export function PropButton({ prop, onClick, isVisited }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isIconHovered, setIsIconHovered] = useState(false); // New state for icon hover

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleIconMouseEnter = () => {
    setIsIconHovered(true); // Set icon hover state to true
  };

  const handleIconMouseLeave = () => {
    setIsIconHovered(false); // Set icon hover state to false
  };

  // Construct the image URL using the prop.iconFolder and appending "512.png"
  const iconUrl = `${prop.iconFolder}512.png`;

  return (
    <div style={styles.container}>
      <button
        onClick={() => onClick(prop)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          ...styles.button,
          backgroundColor: isVisited ? "green" : isHovered ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
          transition: "all 0.2s ease",
        }}
      >
        <div style={styles.buttonContent}>
          <img
            src={iconUrl}
            alt={`${prop.artifactName} icon`}
            style={styles.icon}
            onMouseEnter={handleIconMouseEnter} // Add hover handlers for the icon
            onMouseLeave={handleIconMouseLeave}
          />
        </div>
      </button>
      {/* Tooltip-like label */}
      {isIconHovered && (
        <div style={styles.tooltip}>
          {prop.artifactName}
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    position: "relative", // Needed for absolute positioning of the tooltip
  },
  button: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "left",
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: "64px", // Adjust the size as needed
    height: "64px", // Adjust the size as needed
    backgroundColor: "black", // Set the background color to black
    borderRadius: "4px", // Optional: add some border radius
    cursor: "pointer", // Ensure the icon has a pointer cursor
  },
  tooltip: {
    position: "absolute",
    top: "-30px", // Adjust positioning as needed
    left: "50%", // Center the tooltip relative to the icon
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "14px",
    whiteSpace: "nowrap", // Prevent text from wrapping
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    zIndex: 10, // Ensure the tooltip appears above other elements
  },
};