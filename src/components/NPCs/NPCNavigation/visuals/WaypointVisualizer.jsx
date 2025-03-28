import * as THREE from 'three';
import { useEffect, useMemo } from 'react';

export function WaypointVisualizer({
    pathfinding,
    showWaypoints = true,
    showConnections = true,
    waypointColor = 'blue',
    connectionColor = 'blue',
    zone = 'default'
}) {
    const waypointGroup = useMemo(() => new THREE.Group(), []);
    
    useEffect(() => {
        if (!pathfinding || !pathfinding.zones[zone]) return;
        
        const { waypoints, adjacencyList } = pathfinding.zones[zone];
        waypointGroup.clear();
        
        if (showWaypoints) {
            // Add spheres for waypoints
            waypoints.forEach(pos => {
                const sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(0.1),
                    new THREE.MeshBasicMaterial({ color: waypointColor })
                );
                sphere.position.copy(pos);
                waypointGroup.add(sphere);
            });
        }
        
        if (showConnections) {
            // Add lines for connections
            adjacencyList.forEach((neighbors, index) => {
                const origin = waypoints[index];
                neighbors.forEach(neighborIndex => {
                    const neighbor = waypoints[neighborIndex];
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([origin, neighbor]);
                    const line = new THREE.Line(
                        lineGeometry,
                        new THREE.LineBasicMaterial({ 
                            color: connectionColor,
                            linewidth: 2
                        })
                    );
                    waypointGroup.add(line);
                });
            });
        }
        
        return () => {
            waypointGroup.clear();
        };
    }, [pathfinding, showWaypoints, showConnections, waypointColor, connectionColor, zone]);
    
    return <primitive object={waypointGroup} />;
}