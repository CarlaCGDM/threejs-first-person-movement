import { SettingsPanel } from "./SettingsPanel";
import { PropsSidebar } from "../props/PropsSidebar";
import { InstructionsPanel } from "./InstructionsPanel";
import PropInfo from "../props/PropInfo";
import PointOfInterestInfo from "../pois/PointOfInterestInfo"; // Import the PointOfInterestInfo component
import { useSettings } from "../../context/SettingsContext";
import { useEffect } from "react";
import { Minimap } from "../caveEnvironment/Minimap";
import { Navbar } from "./Navbar";
import { Tutorial } from "./Tutorial"; // Import the Tutorial component

export function Overlay({ props, playerRef, orbitControlsRef }) {
  const { settings, dispatch } = useSettings();
  const { selectedProp, selectedPOI } = settings;

  const handleClosePropInfo = () => {
    dispatch({ type: "CLEAR_SELECTED_PROP" });
  };

  const handleClosePointOfInterestInfo = () => {
    dispatch({ type: "CLEAR_SELECTED_POI" });
  };

  const handleToggleTutorial = () => {
    dispatch({ type: "TOGGLE_TUTORIAL" });
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
    <div
      style={{
        ...styles.overlay,
        pointerEvents: selectedProp || selectedPOI ? "auto" : "none", // Allow interaction based on selection
      }}
    >
      {/* Add the tutorial here, only when showTutorial is true */}
      {settings.ui.showTutorial && <Tutorial onClose={handleToggleTutorial} />}

      {/* Other components */}
      <Navbar />
      <PropsSidebar props={props} playerRef={playerRef} orbitControlsRef={orbitControlsRef} />

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
          imageFiles={[selectedPOI.imageFile]}
          onClose={handleClosePointOfInterestInfo}
        />
      )}

      {settings.ui.showMinimap && <Minimap playerRef={playerRef} />}
    </div>
  );
}

// Styles for Overlay component
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    fontFamily: "Arial, sans-serif",
    color: "white",
    zIndex: 1000, // Ensure overlay is on top
  },
};
