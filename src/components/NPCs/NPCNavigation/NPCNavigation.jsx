import { useEffect, useState, useRef, useCallback } from 'react';
import { PathfindingLogic } from '../utils/pathfindingLogic';
import { NPCActor } from '../NPCActor/NPCActor';
import { PathVisualizer } from './visuals/PathVisualizer';
import { WaypointVisualizer } from './visuals/WaypointVisualizer'; // New visualizer for waypoints
import * as THREE from "three";

export default function NPCNavigation({ color = 'hotpink' }) {
    const [path, setPath] = useState(null);
    const [waypointsLoaded, setWaypointsLoaded] = useState(false);
    const pathfindingRef = useRef();
    
    // Generate a new random path from a starting position
    const generateNewPath = (startPosition = null) => {
        if (!pathfindingRef.current || !waypointsLoaded) return;

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
        } else {
            console.warn('Failed to generate path');
            generateNewPath(startPosition);
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
        pathfindingRef.current = new PathfindingLogic();
        
        const loadWaypoints = async () => {
            const success = await pathfindingRef.current.loadFromJSON('/assets/models/CovaBonica_LODs/waypoints.json');
            setWaypointsLoaded(success);
            
            if (success) {
                setTimeout(() => {
                    generateNewPath();
                }, 500);
            }
        };

        loadWaypoints();

        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <group>
            {/* Replace NavMeshVisualizer with WaypointVisualizer */}
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
                        speed={0.5}
                        onPathComplete={handlePathComplete}
                        color={color}
                    />
                </>
            )}
        </group>
    );
}