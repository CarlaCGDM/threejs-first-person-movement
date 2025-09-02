import { useState } from "react";
import { PropButton } from "./PropButton";
import { usePlayerTeleport } from "../../player/hooks/usePlayerTeleport";
import { useSettings } from "../../../context/SettingsContext";
import * as THREE from "three";
import { useIsMobile } from "../../../hooks/useIsMobile";

export function PropsSidebar({ props, playerRef, orbitControlsRef }) {
  const { teleportToProp, teleportToStart } = usePlayerTeleport(playerRef);
  const { settings, dispatch } = useSettings(); // Get dispatch from context

  // Detect mobile devices
  const isMobile = useIsMobile();
  if (isMobile) {
    return;
  }

  const handleTeleport = (prop) => {
    teleportToProp(prop);
    setTimeout(() => {
      if (orbitControlsRef.current) {
        const propPosition = new THREE.Vector3(...prop.position);
        orbitControlsRef.current.lookAt(propPosition);
      }
    }, 50);
    // Update visited props through context
    // dispatch({
    //   type: "SET_VISITED_PROP",
    //   payload: { propName: prop.artifactName, visited: true }
    // });
  };

  const handleReturnToStart = () => {
    teleportToStart(settings.initialPlayerPosition);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.lookAt(settings.initialPlayerPosition);
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.propsGrid}>
        {props.map((prop, index) => (
          <PropButton
            key={index}
            prop={prop}
            onClick={handleTeleport}
            isVisited={settings.visitedProps[prop.artifactName]} // Get from settings
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    bottom: "5px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#272626CC",
    borderRight: "1px solid #3a3a3a",
    borderTop: "1px solid #3a3a3a",
    borderBottom: "1px solid #3a3a3a",
    borderRadius: "0.5vw 0.5vw 0.5vw 0",
    padding: "10px",
    zIndex: 999,
    height: "11vh",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "thin",
    scrollbarColor: "#E5B688 transparent",
    pointerEvents: 'auto',
    display: "flex",
    gap: "10px",
  },
  propsGrid: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    alignItems: "center",
  },
};