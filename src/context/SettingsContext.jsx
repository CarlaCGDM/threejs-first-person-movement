import { createContext, useReducer, useContext } from "react";

const initialSettings = {
  cameraRotationSpeed: 4.0,
  playerWalkSpeed: 1.5,
  playerJumpForce: 4,
  initialPlayerPosition: [0.91, -2.0, 8.8],
  playerPosition: [0.91, -2.0, 8.8], // Add this line
  playerRef: null, // And this line
  showHDEnvironment: false,
  selectedProp: null, // State for the selected prop
  selectedPOI: null, // New state for the selected POI
  devMode: false,
};

const SettingsContext = createContext();

function settingsReducer(state, action) {
  switch (action.type) {
    case "UPDATE_CAMERA_ROTATION_SPEED":
      return { ...state, cameraRotationSpeed: action.payload };
    case "UPDATE_PLAYER_WALK_SPEED":
      return { ...state, playerWalkSpeed: action.payload };
    case "UPDATE_PLAYER_JUMP_FORCE":
      return { ...state, playerJumpForce: action.payload };
    case "TOGGLE_HD_ENVIRONMENT":
      return { ...state, showHDEnvironment: !state.showHDEnvironment };
    case "SELECT_PROP":
      return { ...state, selectedProp: action.payload }; // Update selected prop
    case "CLEAR_SELECTED_PROP":
      return { ...state, selectedProp: null }; // Clear selected prop
    case "SELECT_POI":
      return { ...state, selectedPOI: action.payload }; // Update selected POI
    case "CLEAR_SELECTED_POI":
      return { ...state, selectedPOI: null }; // Clear selected POI
    case "TOGGLE_DEV_MODE":
      return { ...state, devMode: !state.devMode }; // Toggle devMode
    case "UPDATE_PLAYER_POSITION":
      return { ...state, playerPosition: action.payload };
    case "SET_PLAYER_REF":
      return { ...state, playerRef: action.payload };
    default:
      return state;
  }
}

export function SettingsProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}