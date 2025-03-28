import { SettingsPanel } from "./SettingsPanel";
import { PropsSidebar } from "../props/PropsSidebar";
import { InstructionsPanel } from "./InstructionsPanel";
import PropInfo from "../props/PropInfo";
import PointOfInterestInfo from "../POIs/PointOfInterestInfo"; // Import the PointOfInterestInfo component
import { useSettings } from "../../context/SettingsContext";
import { useEffect } from "react";
import { Minimap } from "../caveEnvironment/Minimap";

export function Overlay({ props, playerRef, orbitControlsRef }) {
  const { settings, dispatch } = useSettings();
  const { selectedProp, selectedPOI } = settings;

  const handleClosePropInfo = () => {
    dispatch({ type: "CLEAR_SELECTED_PROP" });
  };

  const handleClosePointOfInterestInfo = () => {
    dispatch({ type: "CLEAR_SELECTED_POI" });
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
    <div style={{ ...styles.overlay, pointerEvents: selectedProp || selectedPOI ? "auto" : "none" }}>
      {/* <SettingsPanel /> */}
      <PropsSidebar props={props} playerRef={playerRef} orbitControlsRef={orbitControlsRef} />
      <InstructionsPanel />

      {/* Render PropInfo if a prop is selected */}
      {selectedProp && (
        <PropInfo
          artifactName={selectedProp.artifactName}
          metadata={selectedProp.metadata}
          detailedModelFile={selectedProp.detailedModelFile}
          size={selectedProp.size}
          onClose={handleClosePropInfo}
        />
      )}

      {/* Render PointOfInterestInfo if a POI is selected */}
      {selectedPOI && (
        <PointOfInterestInfo
          poiName={selectedPOI.poiName}
          metadata={selectedPOI.metadata}
          imageFile={selectedPOI.imageFile}
          onClose={handleClosePointOfInterestInfo}
        />
      )}

      <Minimap playerRef={playerRef} />
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