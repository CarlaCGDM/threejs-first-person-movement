import { useEffect, useState, useRef, useCallback } from "react";
import { PathfindingLogic } from "../utils/pathfindingLogic";
import { NPCActor } from "../NPCActor/NPCActor";
import * as THREE from "three";
import { useSettings } from "../../../context/SettingsContext"; // Import settings

export default function NPCNavigation({
    color = "hotpink",
    model = "/assets/models/characters/sophie",
    propsData = [],
    poisData = [],
    playerRef,
}) {
    const [path, setPath] = useState(null);
    const [waypointsLoaded, setWaypointsLoaded] = useState(false);
    const pathfindingRef = useRef(null);
    const waypointsLoadedRef = useRef(false);
    const lastOccupiedWaypointRef = useRef(null); // Store the NPC's specific waypoint

    const { addOccupiedWaypoint, removeOccupiedWaypoint, isWaypointOccupied, settings } = useSettings(); // Get waypoint functions

    const generateNewPath = (startPosition = null) => {
        if (!pathfindingRef.current || !waypointsLoadedRef.current) {
            console.warn("Path generation prevented");
            return null;
        }

        let startPos =
            startPosition ||
            new THREE.Vector3(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);

        const endPos = new THREE.Vector3(
            Math.random() * 20 - 10,
            0,
            Math.random() * 20 - 10
        );

        console.log("Attempting path generation", startPos.toArray(), endPos.toArray());

        const newPath = pathfindingRef.current.findPath(startPos, endPos);

        if (newPath && newPath.length > 0) {
            console.log("New path generated", newPath);
            setPath(newPath);

            // Remove previously occupied waypoint (if any)
            if (lastOccupiedWaypointRef.current) {
                console.log("Removing waypoint from occupied set:", lastOccupiedWaypointRef.current);
                removeOccupiedWaypoint(lastOccupiedWaypointRef.current);
            }
            console.log("Updated occupied waypoints:", settings.npc.occupiedWaypoints);

            // Add new last waypoint and store it internally
            const lastWaypoint = newPath[newPath.length - 1];

            // Make sure new waypoint found is not already occupied
            const zoneName = Object.keys(pathfindingRef.current.zones)[0]; // Get the first zone name
            const nearestWaypoint = pathfindingRef.current.findNearestWaypoint(lastWaypoint, pathfindingRef.current.zones[zoneName].waypoints);
            const nearestWaypointIndex = nearestWaypoint ? nearestWaypoint.index : null;

            if (isWaypointOccupied(nearestWaypointIndex)) {
                console.warn("Waypoint is already occupied, finding a new one...");
                return generateNewPath(startPosition); // Try finding a different path
            }

            addOccupiedWaypoint(nearestWaypointIndex);
            lastOccupiedWaypointRef.current = nearestWaypointIndex;

            return newPath;
        } else {
            console.error("Path generation failed");
            return null;
        }
    };

    const handlePathComplete = useCallback(() => {
        console.log("Path complete, removing own waypoint and generating new path");

        console.log("Removing occupied waypoint:", lastOccupiedWaypointRef.current);
        if (lastOccupiedWaypointRef.current) {
            removeOccupiedWaypoint(lastOccupiedWaypointRef.current); // Remove the NPC's specific waypoint
            lastOccupiedWaypointRef.current = null; // Clear reference after removal
        }
        console.log("Updated occupied waypoints:", settings.npc.occupiedWaypoints);

        if (path && path.length > 0) {
            generateNewPath(path[path.length - 1]);
        } else {
            generateNewPath();
        }
    }, [path, removeOccupiedWaypoint]);

    useEffect(() => {
        let isMounted = true;
        pathfindingRef.current = new PathfindingLogic();

        const loadWaypoints = async () => {
            try {
                console.log("Loading waypoints...");
                const success = await pathfindingRef.current.loadFromJSON(
                    "/assets/models/CovaBonica_LODs/waypoints.json"
                );

                if (isMounted) {
                    console.log("Waypoint loading success:", success);
                    setWaypointsLoaded(success);
                    waypointsLoadedRef.current = success;

                    if (success) {
                        requestAnimationFrame(() => {
                            const generatedPath = generateNewPath();
                            if (!generatedPath) console.error("Failed to generate initial path");
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
            {/* {waypointsLoaded && (
            <WaypointVisualizer
                pathfinding={pathfindingRef.current}
                showWaypoints={true}
                showConnections={true}
            />
        )} */}

            {path && path.length > 1 && (
                <>
                    {/* <PathVisualizer path={path} color="yellow" /> */}
                    <NPCActor
                        path={path}
                        speed={1}
                        onPathComplete={handlePathComplete}
                        model={model}
                        propsData={propsData}
                        poisData={poisData}
                        playerRef={playerRef}
                    />
                </>
            )}
        </group>
    );
}

