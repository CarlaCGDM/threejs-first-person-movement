import { useEffect, useState, useRef, useCallback } from "react";
import { PathfindingLogic } from "../utils/pathfindingLogic";
import { NPCActor } from "../NPCActor/NPCActor";
import * as THREE from "three";

export default function NPCNavigation({
    color = "hotpink",
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

    const generateNewPath = (startPosition = null) => {
        if (!pathfindingRef.current || !waypointsLoadedRef.current) {
            console.warn("Path generation prevented");
            return null;
        }
    
        const startPos = startPosition || new THREE.Vector3(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
        const endPos = new THREE.Vector3(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
    
        //console.log("Attempting path generation", startPos.toArray(), endPos.toArray());
    
        const newPath = pathfindingRef.current.findPath(startPos, endPos);
    
        if (newPath && newPath.length > 0) {
            const lastWaypoint = newPath[newPath.length - 1];
    
            const zoneName = Object.keys(pathfindingRef.current.zones)[0];
            const nearestWaypoint = pathfindingRef.current.findNearestWaypoint(
                lastWaypoint,
                pathfindingRef.current.zones[zoneName].waypoints
            );
    
            const nearestWaypointIndex = nearestWaypoint ? nearestWaypoint.index : null;
    
            // Step 1: Check if the waypoint is already occupied
            if (isWaypointOccupied(nearestWaypointIndex)) {
                console.warn("Waypoint is already occupied, trying again...");
                return generateNewPath(startPosition); // 🔁 Try again if occupied
            }
    
            // Step 2: Reserve the waypoint if it's free
            const reserved = reserveWaypoint(nearestWaypointIndex);
            if (!reserved) {
                console.warn("Waypoint couldn't be reserved, trying again...");
                return generateNewPath(startPosition); // 🔁 Retry logic in case it fails
            }
    
            // Step 3: Release the old waypoint, if any
            if (lastOccupiedWaypointRef.current !== null) {
                releaseWaypoint(lastOccupiedWaypointRef.current);
            }
    
            // Step 4: Commit the new waypoint
            commitWaypoint(nearestWaypointIndex);
            lastOccupiedWaypointRef.current = nearestWaypointIndex;
    
            setPath(newPath);
            //console.log("New path set:", newPath);
            return newPath;
        } else {
            console.error("Path generation failed");
            return null;
        }
    };
    
    

    const handlePathComplete = useCallback(() => {
        //console.log("Path complete, releasing waypoint:", lastOccupiedWaypointRef.current);

        if (lastOccupiedWaypointRef.current !== null) {
            releaseWaypoint(lastOccupiedWaypointRef.current);
            lastOccupiedWaypointRef.current = null;
        }

        if (path && path.length > 0) {
            generateNewPath(path[path.length - 1]);
        } else {
            generateNewPath();
        }
    }, [path, releaseWaypoint]);

    useEffect(() => {
        let isMounted = true;
        pathfindingRef.current = new PathfindingLogic();

        const loadWaypoints = async () => {
            try {
                const success = await pathfindingRef.current.loadFromJSON(
                    "/assets/models/CovaBonica_LODs/waypoints.json"
                );

                if (isMounted) {
                    setWaypointsLoaded(success);
                    waypointsLoadedRef.current = success;

                    if (success) {
                        requestAnimationFrame(() => {
                            const generatedPath = generateNewPath();
                            if (!generatedPath) console.error("Initial path failed");
                        });
                    }
                }
            } catch (error) {
                console.error("Waypoint loading error:", error);
                if (isMounted) {
                    setWaypointsLoaded(false);
                    waypointsLoadedRef.current = false;
                }
            }
        };

        loadWaypoints();

        return () => {
            isMounted = false;
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
                />
            )}
        </group>
    );
}