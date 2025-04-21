import { useEffect, useState, useRef, useCallback } from "react";
import { PathfindingLogic } from "../utils/pathfindingLogic";
import { NPCActor } from "../NPCActor/NPCActor";
import * as THREE from "three";
import { useDebug } from "../../../context/DebugContext";

export default function NPCNavigation({
    model = "/assets/models/characters/sophie",
    propsData = [],
    poisData = [],
    playerRef,
    isWaypointOccupied,
    reserveWaypoint,
    commitWaypoint,
    releaseWaypoint,
}) {
    const [path, setPath] = useState(null);
    const [waypointsLoaded, setWaypointsLoaded] = useState(false);
    const pathfindingRef = useRef(null);
    const waypointsLoadedRef = useRef(false);
    const lastOccupiedWaypointRef = useRef(null);

    // Get debug flags from context
    const debugPathfinding = useDebug('NPCs', 'Pathfinding');
    const debugErrors = useDebug('NPCs', 'Errors');

    const debugFlags = { debugPathfinding, debugErrors };

    const generateNewPath = (startPosition = null) => {
        if (!pathfindingRef.current || !waypointsLoadedRef.current) {
            if (debugErrors) console.warn("[NPCs/Errors] Path generation prevented - system not ready");
            return null;
        }
    
        const startPos = startPosition || new THREE.Vector3(
            Math.random() * 20 - 10, 
            0, 
            Math.random() * 20 - 10
        );
        const endPos = new THREE.Vector3(
            Math.random() * 20 - 10, 
            0, 
            Math.random() * 20 - 10
        );
    
        if (debugPathfinding) {
            console.log("[NPCs/Pathfinding] Generating new path", {
                start: startPos.toArray(),
                end: endPos.toArray()
            });
        }
    
        const newPath = pathfindingRef.current.findPath(startPos, endPos, debugFlags);
    
        if (newPath && newPath.length > 0) {
            const lastWaypoint = newPath[newPath.length - 1];
            const zoneName = Object.keys(pathfindingRef.current.zones)[0];
            const nearestWaypoint = pathfindingRef.current.findNearestWaypoint(
                lastWaypoint,
                pathfindingRef.current.zones[zoneName].waypoints
            );
    
            const nearestWaypointIndex = nearestWaypoint?.index ?? null;
    
            if (isWaypointOccupied(nearestWaypointIndex)) {
                if (debugPathfinding) console.warn("[NPCs/Pathfinding] Waypoint occupied, retrying...");
                return generateNewPath(startPosition);
            }
    
            const reserved = reserveWaypoint(nearestWaypointIndex);
            if (!reserved) {
                if (debugPathfinding) console.warn("[NPCs/Pathfinding] Waypoint reservation failed, retrying...");
                return generateNewPath(startPosition);
            }
    
            if (lastOccupiedWaypointRef.current !== null) {
                if (debugPathfinding) console.log("[NPCs/Pathfinding] Releasing previous waypoint:", lastOccupiedWaypointRef.current);
                releaseWaypoint(lastOccupiedWaypointRef.current);
            }
    
            commitWaypoint(nearestWaypointIndex);
            lastOccupiedWaypointRef.current = nearestWaypointIndex;
    
            setPath(newPath);
            if (debugPathfinding) {
                console.log("[NPCs/Pathfinding] New path set", {
                    length: newPath.length,
                    waypoints: newPath.map(p => p.toArray())
                });
            }
            return newPath;
        } else {
            if (debugErrors) console.error("[NPCs/Errors] Path generation failed");
            return null;
        }
    };
    
    const handlePathComplete = useCallback(() => {
        if (debugPathfinding) {
            console.log("[NPCs/Pathfinding] Path complete, releasing waypoint:", 
                lastOccupiedWaypointRef.current
            );
        }

        if (lastOccupiedWaypointRef.current !== null) {
            releaseWaypoint(lastOccupiedWaypointRef.current);
            lastOccupiedWaypointRef.current = null;
        }

        if (path && path.length > 0) {
            if (debugPathfinding) console.log("[NPCs/Pathfinding] Generating continuation path");
            generateNewPath(path[path.length - 1]);
        } else {
            if (debugPathfinding) console.log("[NPCs/Pathfinding] Generating new random path");
            generateNewPath();
        }
    }, [path, releaseWaypoint, debugPathfinding]);

    useEffect(() => {
        let isMounted = true;
        pathfindingRef.current = new PathfindingLogic();

        const loadWaypoints = async () => {
            try {
                if (debugPathfinding) console.log("[NPCs/Pathfinding] Loading waypoints...");
                
                const success = await pathfindingRef.current.loadFromJSON(
                    "/assets/models/CovaBonica_LODs/waypoints.json",
                    debugFlags
                );

                if (isMounted) {
                    setWaypointsLoaded(success);
                    waypointsLoadedRef.current = success;

                    if (success) {
                        if (debugPathfinding) console.log("[NPCs/Pathfinding] Waypoints loaded successfully");
                        requestAnimationFrame(() => {
                            const generatedPath = generateNewPath();
                            if (!generatedPath && debugErrors) {
                                console.error("[NPCs/Errors] Initial path generation failed");
                            }
                        });
                    }
                }
            } catch (error) {
                if (debugErrors) console.error("[NPCs/Errors] Waypoint loading error:", error);
                if (isMounted) {
                    setWaypointsLoaded(false);
                    waypointsLoadedRef.current = false;
                }
            }
        };

        loadWaypoints();

        return () => {
            isMounted = false;
            if (lastOccupiedWaypointRef.current !== null) {
                releaseWaypoint(lastOccupiedWaypointRef.current);
            }
        };
    }, []);

    return (
        <group>
            {path && path.length > 1 && (
                <NPCActor
                    path={path}
                    speed={1}
                    onPathComplete={handlePathComplete}
                    model={model}
                    propsData={propsData}
                    poisData={poisData}
                    playerRef={playerRef}
                    debugFlags={debugFlags} // Pass debug flags to NPCActor if needed
                />
            )}
        </group>
    );
}