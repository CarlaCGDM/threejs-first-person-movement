import { useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function NPCActor({ npcRef, pathfinding, zone, onReady }) {
  const [path, setPath] = useState([]);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [waiting, setWaiting] = useState(false); // NEW: Track if NPC is waiting before moving again
  const speed = 0.003;
  const [debugPath, setDebugPath] = useState([]);

  useEffect(() => {
    if (!npcRef.current || !pathfinding || !zone || isInitialized) return;

    const zoneData = pathfinding.zones[zone];
    const validGroups = Object.keys(zoneData.groups);

    if (validGroups.length === 0) {
      console.error('No valid navigation groups found in the navmesh.');
      return;
    }

    const groupID = validGroups[0];
    const startNode = zoneData.groups[groupID][0];

    if (!startNode) {
      console.error('No valid starting node found in navmesh group.');
      return;
    }

    npcRef.current.position.copy(startNode.centroid);
    console.log('NPC Initialized at:', npcRef.current.position);

    setIsInitialized(true);
    setCurrentNodeIndex(0); // Start at the first node in the group
    onReady?.();

    getRandomTarget(0, groupID);
  }, [npcRef.current, pathfinding, zone]);

  const getRandomTarget = (fromNodeIndex, groupID) => {
    if (!pathfinding || !zone) return;

    try {
      const groupNodes = pathfinding.zones[zone].groups[groupID];
      if (!groupNodes?.length) return;

      console.log('Selecting random target from group', groupID, 'with', groupNodes.length, 'nodes');

      const startNode = groupNodes[fromNodeIndex]; // FORCE starting from last traveled node

      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * groupNodes.length);
        const targetNode = groupNodes[randomIndex];

        const testPath = pathfinding.findPath(
          startNode.centroid, // Start from exact last node
          targetNode.centroid,
          zone,
          groupID
        );

        if (testPath?.length > 1) {
          console.log(`Valid path found from node index ${fromNodeIndex} to target ${randomIndex}`);

          setCurrentNodeIndex(fromNodeIndex); // Ensure we store correct last node
          setPath(testPath);
          setDebugPath([...testPath.map(p => p.clone())]);
          return;
        }
      }

      console.warn('Failed to find valid path within current group after 10 attempts');

    } catch (error) {
      console.error('Error finding target:', error);
    }
  };

  useFrame(() => {
    if (!isInitialized || !path?.length || !npcRef.current || waiting) return; // Stop moving if waiting

    const currentTarget = path[0];
    const direction = new THREE.Vector3()
      .copy(currentTarget)
      .sub(npcRef.current.position)
      .normalize();

    npcRef.current.position.x += direction.x * speed;
    npcRef.current.position.z += direction.z * speed;
    npcRef.current.position.y += direction.y * speed;

    if (npcRef.current.position.distanceTo(currentTarget) < 0.5) {
      if (path.length > 1) {
        setPath(path.slice(1));
        setDebugPath([...path.slice(1).map(p => p.clone())]);
      } else {
        // When the NPC reaches the final node in the path:
        const groupID = pathfinding.getGroup(zone, npcRef.current.position);
        if (groupID !== null) {
          const groupNodes = pathfinding.zones[zone].groups[groupID];
          const nearestIndex = findNearestNodeIndex(npcRef.current.position, groupNodes);

          console.log('NPC reached destination. Waiting before selecting new target from node index:', nearestIndex);
          
          // NPC will pause for 1 second before picking a new target
          setWaiting(true);
          setTimeout(() => {
            setWaiting(false);
            getRandomTarget(nearestIndex, groupID); // Use node index to start the new path
          }, 5000);
        } else {
          console.warn('Could not find valid group after path completion');
        }
      }
    }
  });

  // Finds the index of the nearest node instead of returning the node itself
  const findNearestNodeIndex = (position, nodes) => {
    let nearestIndex = 0;
    let minDistance = position.distanceTo(nodes[0].centroid);

    nodes.forEach((node, index) => {
      const distance = position.distanceTo(node.centroid);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  return (
    <>
      {debugPath.map((point, i) => (
        <mesh key={i} position={[point.x, point.y + 0.1, point.z]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={i === 0 ? 'red' : 'green'} transparent opacity={0.8} />
        </mesh>
      ))}
    </>
  );
}
