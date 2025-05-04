import React, { useState, useEffect, Children, cloneElement, useRef } from 'react';

const NPCManager = ({ children }) => {
  const [activeNPCIndices, setActiveNPCIndices] = useState([]);
  const childrenArray = Children.toArray(children);
  const [occupiedWaypoints, setOccupiedWaypoints] = useState(new Set());
  const reservedWaypoints = useRef(new Set());

  // --- Waypoint Management ---
  const isWaypointOccupied = (index) => {
    return occupiedWaypoints.has(index) || reservedWaypoints.current.has(index);
  };

  const reserveWaypoint = (index) => {
    if (isWaypointOccupied(index)) return false; // Already reserved/occupied
    reservedWaypoints.current.add(index);
    return true;
  };

  const commitWaypoint = (index) => {
    setOccupiedWaypoints((prev) => new Set([...prev, index]));
    reservedWaypoints.current.delete(index);
  };

  const releaseWaypoint = (index) => {
    setOccupiedWaypoints((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const getAvailableWaypoint = () => {
    for (let i = 0; i < 100; i++) { // Try up to 100 waypoints
      if (!isWaypointOccupied(i)) {
        return i; // Return the first available waypoint
      }
    }
    return null; // If no waypoints are available, return null
  };

  const clearAllWaypoints = () => {
    setOccupiedWaypoints(new Set());
    reservedWaypoints.current.clear();
  };

  // --- Staggered Spawning ---
  useEffect(() => {
    setActiveNPCIndices([]);
    const timeouts = [];

    childrenArray.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setActiveNPCIndices((prev) => [...prev, index]);
      }, index * 800);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [childrenArray.length]);

  return (
    <>
      {childrenArray.map((child, index) => {
        if (!activeNPCIndices.includes(index)) return null;

        return (
          <React.Fragment key={`npc-${index}-${child.key || ''}`}>
            {cloneElement(child, {
              getAvailableWaypoint,
              commitWaypoint,
              releaseWaypoint,
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};


export default NPCManager;
