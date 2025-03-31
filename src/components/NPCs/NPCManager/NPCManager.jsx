import { useEffect } from 'react';
import { useSettings } from '../../../context/SettingsContext';

const NPCManager = ({ children }) => {
  const { settings, clearAllOccupiedWaypoints } = useSettings();

  // Cleanup when NPCs are removed or hidden
  useEffect(() => {
    console.log("NPCManager mounted, setting up waypoints");

    // Return a cleanup function that will be called when component is unmounted
    return () => {
      console.log("NPCManager unmounted, clearing waypoints");
      clearAllOccupiedWaypoints(); // Clear waypoints when the NPCs are hidden or removed
    };
  }, []); // Empty dependency array means this effect runs only once, on mount/unmount

  return children;
};

export default NPCManager;

