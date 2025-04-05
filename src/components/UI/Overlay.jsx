import { SettingsPanel } from "./SettingsPanel";
import { PropsSidebar } from "../interactables/props/PropsSidebar";
import { InstructionsPanel } from "./InstructionsPanel";
import PropInfo from "../interactables/props/PropInfo";
import PointOfInterestInfo from "../interactables/pointsofinterest/PointOfInterestInfo"; // Import the PointOfInterestInfo component
import { useSettings } from "../../context/SettingsContext";
import { useEffect } from "react";
import { Minimap } from "../environment/Minimap";
import { Navbar } from "./Navbar";
import { Tutorial } from "./tutorial/Tutorial"; // Import the Tutorial component
import { AudioManager } from "./audio/AudioManager";
import { CreditsModal } from "./CreditsModal";

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
    dispatch({ type: "TOGGLE_MINIMAP" });
    dispatch({ type: "TOGGLE_AUDIO" });
  };

  const handleToggleCredits = () => {
    dispatch({ type: "TOGGLE_CREDITS" });
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

      {settings.ui.showCredits && <CreditsModal onClose={handleToggleCredits}/>}

      {/* Other components */}
      <AudioManager />
      <Navbar />
      <PropsSidebar props={props} playerRef={playerRef} orbitControlsRef={orbitControlsRef} />
      <InstructionsPanel />

      {/* Render PropInfo if a prop is selected */}
      {selectedProp && (
        <PropInfo
          artifactName={selectedProp.artifactName}
          metadata={selectedProp.metadata}
          detailedModelFile={selectedProp.detailedModelFile}
          infoViewRotation={selectedProp.infoViewRotation}
          imageFiles={selectedProp.imageFiles}
          size={selectedProp.size}
          onClose={handleClosePropInfo}
        />
      )}

      {/* Render PointOfInterestInfo if a POI is selected */}
      {selectedPOI && (
        <PointOfInterestInfo
          poiName={selectedPOI.poiName}
          metadata={selectedPOI.metadata}
          imageFiles={selectedPOI.imageFiles}
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
