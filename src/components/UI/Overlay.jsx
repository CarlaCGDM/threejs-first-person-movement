import { SettingsPanel } from "./SettingsPanel";
import { PropsSidebar } from "./PropsSidebar";
import { InstructionsPanel } from "./InstructionsPanel";
import PropInfo from "./PropInfo";
import { useSettings } from "../../context/SettingsContext";
import { useEffect } from "react";

export function Overlay({ props, playerRef, orbitControlsRef }) {
  const { settings, dispatch } = useSettings();
  const { selectedProp } = settings;

  const handleClosePropInfo = () => {
    dispatch({ type: "CLEAR_SELECTED_PROP" });
  };

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault(); // Prevent the context menu
    };

    // Add event listener to disable right-click
    document.addEventListener("contextmenu", handleContextMenu);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div style={{ ...styles.overlay, pointerEvents: selectedProp ? "auto" : "none" }}>
      <SettingsPanel />
      <PropsSidebar props={props} playerRef={playerRef} orbitControlsRef={orbitControlsRef} />
      <InstructionsPanel />

      {/* Render PropInfo if a prop is selected */}
      {selectedProp && (
        <PropInfo
          name={selectedProp.name}
          description={selectedProp.description}
          modelUrl={selectedProp.modelUrl}
          size={selectedProp.size}
          onClose={handleClosePropInfo}
        />
      )}
    </div>
  );
}

// Styles
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    fontFamily: "Arial, sans-serif",
    color: "white",
  },
};