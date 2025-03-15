import { SettingsPanel } from "./SettingsPanel";
import { PropsSidebar } from "./PropsSidebar";
import { InstructionsPanel } from "./InstructionsPanel";

export function Overlay({ props, playerRef, orbitControlsRef }) {
  return (
    <div style={styles.overlay}>
      <SettingsPanel />
      <PropsSidebar props={props} playerRef={playerRef} orbitControlsRef={orbitControlsRef} />
      <InstructionsPanel />
    </div>
  );
}

// Styles (same as before)
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none", // Allow clicks to pass through to the canvas
    fontFamily: "Arial, sans-serif",
    color: "white",
  },
};