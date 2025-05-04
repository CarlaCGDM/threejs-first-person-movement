import React, { useState, useEffect, Children, cloneElement, useRef } from 'react';

const NPCManager = ({ children }) => {
  const [activeNPCIndices, setActiveNPCIndices] = useState([]);
  const childrenArray = Children.toArray(children);
  const [occupiedWaypoints, setOccupiedWaypoints] = useState(new Set());
  const reservedWaypoints = useRef(new Set());
  const spawnTimeoutsRef = useRef([]);
  const isSpawningRef = useRef(false);
  const pendingSpawnsRef = useRef(new Set());

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

  // Helper to handle spawning a single NPC
  const spawnNPC = (index) => {
    setActiveNPCIndices((prev) => {
      if (prev.includes(index)) return prev; // Already spawned
      return [...prev, index];
    });
    
    // Remove this NPC from pending spawns
    pendingSpawnsRef.current.delete(index);
    
    // Check if all spawning is complete
    if (pendingSpawnsRef.current.size === 0) {
      isSpawningRef.current = false;
    }
  };

  // Start the staggered spawning process
  const startSpawning = () => {
    // Clean up any existing timeouts
    clearSpawning();
    
    // Reset state
    setActiveNPCIndices([]);
    isSpawningRef.current = true;
    
    // Track which NPCs we're planning to spawn
    pendingSpawnsRef.current = new Set(childrenArray.map((_, idx) => idx));
    
    // Create new timeouts for staggered spawning
    childrenArray.forEach((_, index) => {
      const timeout = setTimeout(() => {
        spawnNPC(index);
      }, index * 800);
      
      spawnTimeoutsRef.current.push(timeout);
    });
  };

  // Clear all spawning timeouts
  const clearSpawning = () => {
    spawnTimeoutsRef.current.forEach(clearTimeout);
    spawnTimeoutsRef.current = [];
    pendingSpawnsRef.current.clear();
    isSpawningRef.current = false;
  };

  // --- Staggered Spawning ---
  useEffect(() => {
    // Restart spawning when children change
    startSpawning();
    
    return () => {
      // Clean up on unmount or when children change
      clearSpawning();
    };
  }, [childrenArray.length]);

  // Add a safety check to ensure all NPCs are spawned
  useEffect(() => {
    // If we're not actively spawning, but there are NPCs that haven't been activated,
    // and there are children to spawn, then force-spawn the remaining NPCs
    const checkTimer = setTimeout(() => {
      if (!isSpawningRef.current && 
          activeNPCIndices.length < childrenArray.length && 
          childrenArray.length > 0) {
        
        console.log("Safety check: Force-spawning remaining NPCs");
        
        // Force-spawn any NPCs that didn't get spawned
        const missingIndices = [];
        childrenArray.forEach((_, index) => {
          if (!activeNPCIndices.includes(index)) {
            missingIndices.push(index);
          }
        });
        
        if (missingIndices.length > 0) {
          setActiveNPCIndices(prev => [...prev, ...missingIndices]);
        }
      }
    }, childrenArray.length * 800 + 1000); // Wait a bit longer than the expected spawn time
    
    return () => clearTimeout(checkTimer);
  }, [activeNPCIndices, childrenArray]);

  // Monitor spawning progress
  // useEffect(() => {
  //   if (activeNPCIndices.length === childrenArray.length && childrenArray.length > 0) {
  //     console.log("All NPCs spawned successfully:", activeNPCIndices.length);
  //   }
  // }, [activeNPCIndices, childrenArray]);

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
              npcIndex: index,
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default NPCManager;