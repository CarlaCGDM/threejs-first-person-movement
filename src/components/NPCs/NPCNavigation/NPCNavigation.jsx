import { useEffect, useState, useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { PathfindingLogic } from '../utils/pathfindingLogic';
import { NPCActor } from '../NPCActor/NPCActor';
import { PathVisualizer } from './PathVisualizer';
import { NavMeshVisualizer } from './NavMeshVisualizer';

export default function NPCNavigation({ color = 'hotpink' }) {
    const [navData, setNavData] = useState({ faces: [] });
    const [navMesh, setNavMesh] = useState(null);
    const [path, setPath] = useState(null);
    const pathfindingRef = useRef();
    const gltf = useLoader(GLTFLoader, '/assets/models/CovaBonica_LODs/cb_navmesh.glb');
    const actionTimeoutRef = useRef();

    // Generate a new random path from a starting position
    const generateNewPath = (startPosition = null) => {
        if (!navData.faces.length) return;

        // If startPosition provided, find nearest face to it
        let startFace = startPosition
            ? pathfindingRef.current.findNearestFace(startPosition, navData.faces)
            : navData.faces[Math.floor(Math.random() * navData.faces.length)];

        // Pick a random destination face (different from start)
        let endFace;
        do {
            endFace = navData.faces[Math.floor(Math.random() * navData.faces.length)];
        } while (endFace === startFace);

        // Calculate path
        const newPath = pathfindingRef.current.findPath(startFace.center, endFace.center);

        if (newPath) {
            console.log('New path generated', {
                from: startFace.center,
                to: endFace.center,
                length: newPath.length
            });
            setPath(newPath);
        } else {
            console.warn('Failed to generate path');
            generateNewPath(startPosition); // Retry
        }
    };

    // Handle path completion (start action phase then generate new path)
    const handlePathComplete = () => {
        console.log("Starting 5-second action phase");

        actionTimeoutRef.current = setTimeout(() => {
            console.log("Action phase complete - generating new path from end position");
            if (path && path.length > 0) {
                generateNewPath(path[path.length - 1]); // Start from end of previous path
            } else {
                generateNewPath(); // Fallback
            }
        }, 15000);
    };

    // Initialize pathfinding and generate first path
    useEffect(() => {
        if (!gltf) return;

        // Find the navmesh
        let foundNavMesh = null;
        gltf.scene.traverse((node) => {
            if (node.isMesh) foundNavMesh = node;
        });

        if (!foundNavMesh) {
            console.error('No mesh found in navmesh GLTF');
            return;
        }

        setNavMesh(foundNavMesh);

        // Process the navmesh
        pathfindingRef.current = new PathfindingLogic();
        const data = pathfindingRef.current.processNavMesh(foundNavMesh.geometry);
        setNavData(data);

        console.log('Navigation graph created:', {
            faces: data.faces.length,
            connections: data.faces.reduce((sum, face) => sum + face.neighbors.length, 0)
        });

        // Generate first path after short delay
        setTimeout(() => {
            generateNewPath();
        }, 500);

        return () => {
            if (actionTimeoutRef.current) {
                clearTimeout(actionTimeoutRef.current);
            }
        };
    }, [gltf]);

    return (
        <group>

            <NavMeshVisualizer
                faces={navData.faces}
                navMeshGeometry={navMesh?.geometry}
                showFaces={true}
                showConnections={true}
                showWireframe={true}
                wireframeColor="red"
                wireframeOpacity={0.2}
            />

            {/* Path and NPC */}
            {path && path.length > 1 && (
                <>
                    {/* Path visualization */}
                    <PathVisualizer path={path} color="yellow" />

                    {/* NPC Actor */}
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