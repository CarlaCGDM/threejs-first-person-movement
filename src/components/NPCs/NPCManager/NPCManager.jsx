import { useEffect, useState, useRef } from 'react';
import { useSettings } from '../../../context/SettingsContext';

const NPCManager = ({ children }) => {
  const { settings, clearAllOccupiedWaypoints } = useSettings();
  const renderCountRef = useRef(0);
  
  // This useEffect runs once on mount
  useEffect(() => {
    console.log("NPCManager mounted, clearing waypoints");
    clearAllOccupiedWaypoints();
  }, []);
  
  // This useEffect runs when waypoints change
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(
      `Waypoints updated (render #${renderCountRef.current}):`, 
      settings.npc.occupiedWaypoints
    );
  }, [settings.npc.occupiedWaypoints]);

  return children;
};

export default NPCManager;