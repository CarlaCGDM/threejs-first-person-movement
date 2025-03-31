import { useEffect, useState, useRef, useCallback } from 'react';
import { PathfindingLogic } from '../utils/pathfindingLogic';
import { NPCActor } from '../NPCActor/NPCActor';
import { PathVisualizer } from './visuals/PathVisualizer';
import { WaypointVisualizer } from './visuals/WaypointVisualizer';
import * as THREE from "three";

export default function NPCNavigation({ color = 'hotpink', model = "/assets/models/characters/leonard.glb", propsData = [], poisData = [], playerRef }) {
    const [path, setPath] = useState(null);
    const [waypointsLoaded, setWaypointsLoaded] = useState(false);
    const pathfindingRef = useRef(null);
    const waypointsLoadedRef = useRef(false);
    
    const generateNewPath = (startPosition = null) => {
        // Use refs for more reliable checking
        if (!pathfindingRef.current || !waypointsLoadedRef.current) {
            console.warn('Path generation prevented', {
                pathfindingRef: !!pathfindingRef.current,
                waypointsLoaded: waypointsLoadedRef.current
            });
            return null;
        }

        let startPos = startPosition || new THREE.Vector3(
            Math.random() * 20 - 10,
            0,
            Math.random() * 20 - 10
        );

        const endPos = new THREE.Vector3(
            Math.random() * 20 - 10,
            0,
            Math.random() * 20 - 10
        );

        console.log('Attempting path generation', {
            startPos: startPos.toArray(),
            endPos: endPos.toArray()
        });

        const newPath = pathfindingRef.current.findPath(startPos, endPos);

        if (newPath) {
            console.log('New path generated', {
                from: startPos.toArray(),
                to: endPos.toArray(),
                length: newPath.length
            });
            setPath(newPath);
            return newPath;
        } else {
            console.error('Path generation completely failed', {
                startPos: startPos.toArray(),
                endPos: endPos.toArray()
            });
            return null;
        }
    };

    const handlePathComplete = useCallback(() => {
        console.log("Generating new path from last position");
        if (path && path.length > 0) {
            generateNewPath(path[path.length - 1]);
        } else {
            generateNewPath();
        }
    }, [path]);

    // Initialize pathfinding with JSON data
    useEffect(() => {
        let isMounted = true;
        pathfindingRef.current = new PathfindingLogic();
        
        const loadWaypoints = async () => {
            try {
                console.log('Starting waypoint loading');
                const success = await pathfindingRef.current.loadFromJSON('/assets/models/CovaBonica_LODs/waypoints.json');
                
                if (isMounted) {
                    console.log('Waypoint loading result:', success);
                    
                    // Update both state and ref
                    setWaypointsLoaded(success);
                    waypointsLoadedRef.current = success;
                    
                    if (success) {
                        // Debugging: log zone information
                        const zoneInfo = pathfindingRef.current.zones[pathfindingRef.current.defaultZone];
                        console.log('Zone Information', {
                            waypointsCount: zoneInfo.waypoints.length,
                            connectionsCount: Array.from(zoneInfo.adjacencyList.values())
                                .reduce((sum, connections) => sum + connections.size, 0)
                        });

                        // Use requestAnimationFrame for more reliable timing
                        requestAnimationFrame(() => {
                            const generatedPath = generateNewPath();
                            if (!generatedPath) {
                                console.error('Failed to generate initial path');
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Comprehensive waypoint loading error:', error);
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