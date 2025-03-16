import { useSettings } from "../../context/SettingsContext";

export function SettingsPanel() {
  const { settings, dispatch } = useSettings();

  const handleIncrement = (type, step = 0.25) => {
    const keyMap = {
      UPDATE_CAMERA_ROTATION_SPEED: "cameraRotationSpeed",
      UPDATE_PLAYER_WALK_SPEED: "playerWalkSpeed",
      UPDATE_PLAYER_JUMP_FORCE: "playerJumpForce",
    };
  
    dispatch({
      type,
      payload: settings[keyMap[type]] + step,
    });
  };
  
  const handleDecrement = (type, step = 0.25) => {
    const keyMap = {
      UPDATE_CAMERA_ROTATION_SPEED: "cameraRotationSpeed",
      UPDATE_PLAYER_WALK_SPEED: "playerWalkSpeed",
      UPDATE_PLAYER_JUMP_FORCE: "playerJumpForce",
    };
  
    dispatch({
      type,
      payload: settings[keyMap[type]] - step,
    });
  };

  return (
    <div style={{ ...styles.settingsPanel, pointerEvents: "auto" }}>
      <h2 style={styles.heading}>Settings</h2>
      <div style={styles.setting}>
        <label style={styles.label}>
          Camera Rotation Speed: {settings.cameraRotationSpeed.toFixed(2)}
        </label>
        <div style={styles.controls}>
          <button
            onClick={() => handleDecrement("UPDATE_CAMERA_ROTATION_SPEED")}
            style={styles.button}
          >
            -
          </button>
          <input
            type="range"
            min="1"
            max="10"
            step="0.25"
            value={settings.cameraRotationSpeed}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_CAMERA_ROTATION_SPEED",
                payload: parseFloat(e.target.value),
              })
            }
            style={styles.slider}
          />
          <button
            onClick={() => handleIncrement("UPDATE_CAMERA_ROTATION_SPEED")}
            style={styles.button}
          >
            +
          </button>
        </div>
      </div>
      <div style={styles.setting}>
        <label style={styles.label}>
          Player Walk Speed: {settings.playerWalkSpeed.toFixed(2)}
        </label>
        <div style={styles.controls}>
          <button
            onClick={() => handleDecrement("UPDATE_PLAYER_WALK_SPEED")}
            style={styles.button}
          >
            -
          </button>
          <input
            type="range"
            min="1"
            max="10"
            step="0.25"
            value={settings.playerWalkSpeed}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_PLAYER_WALK_SPEED",
                payload: parseFloat(e.target.value),
              })
            }
            style={styles.slider}
          />
          <button
            onClick={() => handleIncrement("UPDATE_PLAYER_WALK_SPEED")}
            style={styles.button}
          >
            +
          </button>
        </div>
      </div>
      <div style={styles.setting}>
        <label style={styles.label}>
          Player Jump Force: {settings.playerJumpForce.toFixed(2)}
        </label>
        <div style={styles.controls}>
          <button
            onClick={() => handleDecrement("UPDATE_PLAYER_JUMP_FORCE")}
            style={styles.button}
          >
            -
          </button>
          <input
            type="range"
            min="1"
            max="10"
            step="0.25"
            value={settings.playerJumpForce}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_PLAYER_JUMP_FORCE",
                payload: parseFloat(e.target.value),
              })
            }
            style={styles.slider}
          />
          <button
            onClick={() => handleIncrement("UPDATE_PLAYER_JUMP_FORCE")}
            style={styles.button}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// Styles (same as before)
const styles = {
  settingsPanel: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "10px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  },
  heading: {
    margin: "0 0 10px 0",
    fontSize: "18px",
  },
  setting: {
    margin: "10px 0",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  button: {
    padding: "5px 10px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  slider: {
    flex: 1,
    cursor: "pointer",
  },
};