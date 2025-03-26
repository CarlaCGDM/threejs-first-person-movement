import { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function usePathfinding(npcRef, pathfinding, zone) {
  const [path, setPath] = useState([]);
  const [target, setTarget] = useState(null);
  const [active, setActive] = useState(false);

  const getRandomTarget = () => {
    if (!pathfinding || !npcRef.current) return null;
  
    try {
      // Ensure we're working from a valid navmesh position
      const currentPos = npcRef.current.position.clone();
      currentPos.y = 0; // Flatten to navmesh plane
      
      const groupID = pathfinding.getGroup(zone, currentPos);
      if (groupID === null) {
        console.warn("NPC not on navmesh at:", currentPos);
        return null;
      }
  
      const randomNode = pathfinding.getRandomNode(zone, groupID);
      if (!randomNode) return null;
  
      return randomNode.centroid.clone();
    } catch (error) {
      console.error("Pathfinding error:", error);
      return null;
    }
  };

  const updatePath = () => {
    if (!target || !pathfinding || !npcRef.current) return;

    try {
      const groupID = pathfinding.getGroup(zone, npcRef.current.position);
      if (groupID === null) return;

      const newPath = pathfinding.findPath(
        npcRef.current.position,
        target,
        zone,
        groupID
      );
      setPath(newPath || []);
    } catch (error) {
      console.error("Path calculation error:", error);
    }
  };

  useEffect(() => {
    if (pathfinding && zone) {
      setActive(true);
      getRandomTarget();
    }
    return () => setActive(false);
  }, [pathfinding, zone]);

  useEffect(() => {
    if (active) updatePath();
  }, [target, active]);

  return { path, target, getRandomTarget, active };
}