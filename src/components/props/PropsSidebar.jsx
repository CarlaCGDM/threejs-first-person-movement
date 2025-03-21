import { useState } from "react";
import { PropButton } from "./PropButton";
import { useTeleportPlayer } from "../../hooks/useTeleportPlayer";
import { useSettings } from "../../context/SettingsContext";
import * as THREE from "three";

export function PropsSidebar({ props, playerRef, orbitControlsRef }) {
  const [visitedProps, setVisitedProps] = useState({});
  const { teleportToProp, teleportToStart } = useTeleportPlayer(playerRef);
  const { settings } = useSettings(); // Access settings

  const handleTeleport = (prop) => {
    // Teleport the player
    teleportToProp(prop);

    // Wait a short time to ensure the player has moved, then rotate
    setTimeout(() => {
      if (orbitControlsRef.current) {
        const propPosition = new THREE.Vector3(...prop.position);
        orbitControlsRef.current.lookAt(propPosition);
      }
    }, 50); // 50ms delay to ensure teleportation completes

    // Mark prop as visited
    setVisitedProps((prev) => ({ ...prev, [prop.artifactName]: true }));
  };

  const handleReturnToStart = () => {
    // Teleport the player to the initial position
    teleportToStart(settings.initialPlayerPosition);

    // Look at the initial position
    if (orbitControlsRef.current) {
      orbitControlsRef.current.lookAt(initialPosition);
    }
  };

  return (
    <div style={{ ...styles.sidebar, pointerEvents: "auto" }}>
      <h2 style={styles.heading}>Props</h2>
       {/* "Return to Start Position" Button */}
      <button onClick={handleReturnToStart} style={styles.returnButton}>📍 Start</button>
      {/* List of Props */}
      {props.map((prop, index) => (
        <PropButton
          key={index}
          prop={prop}
          onClick={handleTeleport}
          isVisited={visitedProps[prop.artifactName]}
        />
      ))}
    </div>
  );
}

// Styles (same as before)
const styles = {
  sidebar: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "10px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  heading: {
    margin: "0 0 10px 0",
    fontSize: "18px",
  },
  returnButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    margin: "5px 0",
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "14px",
  },
};