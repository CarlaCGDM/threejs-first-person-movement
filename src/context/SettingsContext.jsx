import { createContext, useReducer, useContext } from "react";

// Define initial settings
const initialSettings = {
    cameraRotationSpeed: 1.50,
    playerWalkSpeed: 2.5,
};

// Create a context for settings
const SettingsContext = createContext();

// Define a reducer to handle updates
function settingsReducer(state, action) {
    switch (action.type) {
        case "UPDATE_CAMERA_ROTATION_SPEED":
            return { ...state, cameraRotationSpeed: action.payload };
        case "UPDATE_PLAYER_WALK_SPEED":
            return { ...state, playerWalkSpeed: action.payload };
        default:
            return state;
    }
}

// Create a provider component
export function SettingsProvider({ children }) {
    const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

    return (
        <SettingsContext.Provider value={{ settings, dispatch }}>
            {children}
        </SettingsContext.Provider>
    );
}

// Custom hook to access settings
export function useSettings() {
    return useContext(SettingsContext);
}