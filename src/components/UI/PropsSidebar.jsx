import { useState } from "react";
import { PropButton } from "./PropButton";
import { useTeleportPlayer } from "../../hooks/useTeleportPlayer";
import * as THREE from "three";

export function PropsSidebar({ props, playerRef, orbitControlsRef }) {
  const [visitedProps, setVisitedProps] = useState({});
  const teleportPlayer = useTeleportPlayer(playerRef);

  const handleTeleport = (prop) => {
    // Teleport the player
    teleportPlayer(prop);

    // Wait a short time to ensure the player has moved, then rotate
    setTimeout(() => {
        if (orbitControlsRef.current) {
            const propPosition = new THREE.Vector3(...prop.position);
            orbitControlsRef.current.lookAt(propPosition);
        }
    }, 50); // 50ms delay to ensure teleportation completes

    // Mark prop as visited
    setVisitedProps((prev) => ({ ...prev, [prop.name]: true }));
};

  return (
    <div style={{...styles.sidebar, pointerEvents:"auto"}}>
      <h2 style={styles.heading}>Props</h2>
      {props.map((prop, index) => (
        <PropButton
          key={index}
          prop={prop}
          onClick={handleTeleport}
          isVisited={visitedProps[prop.name]}
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
};