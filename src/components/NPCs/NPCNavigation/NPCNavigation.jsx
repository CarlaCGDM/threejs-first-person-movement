import { useEffect, useState, useRef, useCallback } from 'react';
import { PathfindingLogic } from '../utils/pathfindingLogic';
import { NPCActor } from '../NPCActor/NPCActor';
import { PathVisualizer } from './visuals/PathVisualizer';
import { WaypointVisualizer } from './visuals/WaypointVisualizer';
import * as THREE from "three";

export default function NPCNavigation({ color = 'hotpink', propsData = [], poisData = [], playerRef }) {
    const [path, setPath] = useState(null);
    const [waypointsLoaded, setWaypointsLoaded] = useState(false);
    const pathfindingRef = useRef();
    
    const generateNewPath = (startPosition = null) => {
        if (!pathfindingRef.current || !waypointsLoaded) return null;

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

        const newPath = pathfindingRef.current.findPath(startPos, endPos);

        if (newPath) {
            console.log('New path generated', {
                from: startPos,
                to: endPos,
                length: newPath.length
            });
            setPath(newPath);
            return newPath;
        } else {
            console.warn('Failed to generate path');
            return generateNewPath(startPosition);
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
                const success = await pathfindingRef.current.loadFromJSON('/assets/models/CovaBonica_LODs/waypoints.json');
                
                if (isMounted) {
                    setWaypointsLoaded(success);
                    
                    if (success) {
                        // Use requestAnimationFrame for more reliable timing
                        requestAnimationFrame(() => {
                            const generatedPath = generateNewPath();
                            console.log(generatedPath)
                            if (!generatedPath) {
                                console.error('Failed to generate initial path');
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading waypoints:', error);
                if (isMounted) {
                    setWaypointsLoaded(false);
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
            {waypointsLoaded && (
                <WaypointVisualizer
                    pathfinding={pathfindingRef.current}
                    showWaypoints={true}
                    showConnections={true}
                />
            )}

            {path && path.length > 1 && (
                <>
                    <PathVisualizer path={path} color="yellow" />
                    <NPCActor
                        path={path}
                        speed={1}
                        onPathComplete={handlePathComplete}
                        color={color}
                        propsData={propsData}
                        poisData={poisData}
                        playerRef={playerRef}
                    />
                </>
            )}
        </group>
    );
}