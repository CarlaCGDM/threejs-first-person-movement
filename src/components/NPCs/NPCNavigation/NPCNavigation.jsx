import { useEffect, useState, useRef, useCallback } from 'react';
import { PathfindingLogic } from '../utils/pathfindingLogic';
import { NPCActor } from '../NPCActor/NPCActor';
import { PathVisualizer } from './visuals/PathVisualizer';
import { NavMeshVisualizer } from './visuals/NavMeshVisualizer';
import { useNavMeshLoader } from './hooks/useNavMeshLoader'; // New import

export default function NPCNavigation({ color = 'hotpink' }) {
    const [navData, setNavData] = useState({ faces: [] });
    const [path, setPath] = useState(null);
    const pathfindingRef = useRef();
    
    // Replaced GLTF loading with our hook
    const navMesh = useNavMeshLoader('/assets/models/CovaBonica_LODs/cb_navmesh.glb');

    // Generate a new random path from a starting position
    const generateNewPath = (startPosition = null) => {
        if (!navData.faces.length) return;

        let startFace = startPosition
            ? pathfindingRef.current.findNearestFace(startPosition, navData.faces)
            : navData.faces[Math.floor(Math.random() * navData.faces.length)];

        let endFace;
        do {
            endFace = navData.faces[Math.floor(Math.random() * navData.faces.length)];
        } while (endFace === startFace);

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

    // Initialize pathfinding - now depends on navMesh from hook
    useEffect(() => {
        if (!navMesh) return; // Wait until navMesh is loaded

        pathfindingRef.current = new PathfindingLogic();
        const data = pathfindingRef.current.processNavMesh(navMesh.geometry);
        setNavData(data);

        console.log('Navigation graph created:', {
            faces: data.faces.length,
            connections: data.faces.reduce((sum, face) => sum + face.neighbors.length, 0)
        });

        setTimeout(() => {
            generateNewPath();
        }, 500);

    }, [navMesh]); // Changed dependency from gltf to navMesh

    return (
        <group>
            <NavMeshVisualizer
                faces={navData.faces}
                navMeshGeometry={navMesh?.geometry} // Now using navMesh from hook
                showFaces={true}
                showConnections={true}
                showWireframe={true}
                wireframeColor="red"
                wireframeOpacity={0.2}
            />

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