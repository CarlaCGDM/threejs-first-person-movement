import { useState } from "react";

export function PropButton({ prop, onClick, isVisited }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
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
      <span style={styles.buttonText}>{prop.artifactName}</span>
    </button>
  );
}

// Styles
const styles = {
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
  buttonText: {
    fontSize: "14px",
  },
};