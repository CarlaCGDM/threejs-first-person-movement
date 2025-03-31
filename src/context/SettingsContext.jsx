import { createContext, useReducer, useContext } from "react";

const initialSettings = {
  cameraRotationSpeed: 4.0,
  playerWalkSpeed: 1.5,
  playerJumpForce: 4,
  initialPlayerPosition: [0.91, -2.0, 8.8],
  playerPosition: [0.91, -2.0, 8.8],
  playerRef: null,
  showHDEnvironment: false,
  selectedProp: null,
  selectedPOI: null,
  devMode: false,

  ui: {
    showMinimap: true,
    showInstructions: true,
    showCredits: false,
    showNPCs: true,
    isFullscreen: false
  },

  npc: {
    occupiedWaypoints: new Set() // Store waypoint indices instead of positions
  }

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
      return { ...state, selectedProp: action.payload };
    case "CLEAR_SELECTED_PROP":
      return { ...state, selectedProp: null };
    case "SELECT_POI":
      return { ...state, selectedPOI: action.payload };
    case "CLEAR_SELECTED_POI":
      return { ...state, selectedPOI: null };
    case "TOGGLE_DEV_MODE":
      return { ...state, devMode: !state.devMode };
    case "UPDATE_PLAYER_POSITION":
      return { ...state, playerPosition: action.payload };
    case "SET_PLAYER_REF":
      return { ...state, playerRef: action.payload };
    case "TOGGLE_MINIMAP":
      return { ...state, ui: { ...state.ui, showMinimap: !state.ui.showMinimap } };
    case "TOGGLE_INSTRUCTIONS":
      return { ...state, ui: { ...state.ui, showInstructions: !state.ui.showInstructions } };
    case "TOGGLE_CREDITS":
      return { ...state, ui: { ...state.ui, showCredits: !state.ui.showCredits } };
    case "TOGGLE_NPCS":
      return { ...state, ui: { ...state.ui, showNPCs: !state.ui.showNPCs } };
    case "TOGGLE_FULLSCREEN":
      return { ...state, ui: { ...state.ui, isFullscreen: !state.ui.isFullscreen } };

    // NPC waypoint management cases
    case "ADD_OCCUPIED_WAYPOINT":
      return {
        ...state,
        npc: {
          ...state.npc,
          occupiedWaypoints: new Set([...state.npc.occupiedWaypoints, action.payload])
        }
      };

    case "REMOVE_OCCUPIED_WAYPOINT":
      const updatedWaypoints = new Set(state.npc.occupiedWaypoints);
      updatedWaypoints.delete(action.payload);
      return {
        ...state,
        npc: {
          ...state.npc,
          occupiedWaypoints: updatedWaypoints
        }
      };


    case "CLEAR_OCCUPIED_WAYPOINTS":
      return {
        ...state,
        npc: {
          ...state.npc,
          occupiedWaypoints: new Set()
        }
      };

    default:
      return state;
  }
}

export function SettingsProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

  const toggleUI = (element) => dispatch({ type: `TOGGLE_${element.toUpperCase()}` });

  // NPC waypoint management functions
  const addOccupiedWaypoint = (waypointIndex) => {
    dispatch({
      type: "ADD_OCCUPIED_WAYPOINT",
      payload: waypointIndex
    });
  };

  const removeOccupiedWaypoint = (waypointIndex) => {
    dispatch({
      type: "REMOVE_OCCUPIED_WAYPOINT",
      payload: waypointIndex
    });
  };

  const isWaypointOccupied = (waypointIndex) => {
    console.log("Checking occupied waypoints:", settings.npc.occupiedWaypoints);
    console.log("Trying to assign:", waypointIndex);
    return settings.npc.occupiedWaypoints.has(waypointIndex);
  };

  const clearAllOccupiedWaypoints = () => {
    dispatch({ type: "CLEAR_OCCUPIED_WAYPOINTS" });
  };


  return (
    <SettingsContext.Provider value={{
      settings,
      dispatch,
      toggleUI,
      // NPC functions
      addOccupiedWaypoint,
      removeOccupiedWaypoint,
      clearAllOccupiedWaypoints,
      isWaypointOccupied
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}