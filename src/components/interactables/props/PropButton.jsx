import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function PropButton({ prop, onClick, isVisited }) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const iconUrl = `${prop.iconFolder}128.png`;

  useEffect(() => {
    const tooltipContainer = document.getElementById("tooltip-root");
    if (!tooltipContainer) {
      const div = document.createElement("div");
      div.id = "tooltip-root";
      document.body.appendChild(div);
    }
  }, []);

  const handleMouseEnter = (event) => {
    setIsHovered(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 35, // Position above button
      left: rect.left + rect.width / 2, // Center it
    });
  };

  return (
    <>
      <div style={styles.container}>
        <button
          onClick={() => onClick(prop)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...styles.button,
            border: isHovered ? "1px solid #3a3a3a" :  "1px solid transparent",
          }}
        >
          <img 
            src={iconUrl} 
            alt={prop.artifactName} 
            style={{
              ...styles.icon,
              filter: isVisited ? "saturate(0.2)" : "none",
              opacity: isVisited ? 0.7 : 1,
            }} 
          />
        </button>
      </div>

      {/* Render tooltip using a portal */}
      {isHovered &&
        createPortal(
          <div
            style={{
              ...styles.tooltip,
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
            }}
          >
            {prop.artifactName}
          </div>,
          document.getElementById("tooltip-root")
        )}
    </>
  );
}

const styles = {
  container: {
    position: "relative",
  },
  button: {
    width: "8vh",
    height: "8vh",
    padding: "0",
    border: "1px solid transparent",
    borderRadius: "0.25vw",
    backgroundColor: "#1a1a1a",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    outline: "none",
  },
  icon: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "filter 0.2s ease, opacity 0.2s ease", // Add smooth transition
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#272626",
    color: "#E2E2E2",
    border: "1px solid #3a3a3a",
    padding: "5px 10px",
    fontSize: "0.8rem",
    fontFamily: "'Mulish', sans-serif",
    whiteSpace: "nowrap",
    borderRadius: "4px",
    transform: "translateX(-50%)",
    zIndex: 1000,
    pointerEvents: "none",
  },
};

export default PropButton;