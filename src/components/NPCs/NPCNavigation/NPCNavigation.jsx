import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Pathfinding } from 'three-pathfinding';
import * as THREE from 'three';
import { weldVertices } from '../../../utils/vertexWelder';

export default function NPCNavigation({ navmeshUrl, children }) {
  const { scene } = useThree();
  const [pathfinding, setPathfinding] = useState(null);
  const [zone] = useState('level1');
  const gltf = useLoader(GLTFLoader, navmeshUrl); 

  useEffect(() => {
    if (!gltf) return;

    let navmesh;
    gltf.scene.traverse((node) => {
      if (node.isMesh) navmesh = node;
    });

    if (!navmesh) {
      console.error('No mesh found in navmesh GLTF');
      return;
    }

    console.log("Initializing pathfinding with navmesh:", navmesh);
    const weldedGeometry = weldVertices(navmesh.geometry, 0.0001);

    const pf = new Pathfinding();
    const zoneData = Pathfinding.createZone(weldedGeometry);
    
    // Verify zone data before setting
    if (!zoneData || !zoneData.groups) {
      console.error('Invalid zone data created', zoneData);
      return;
    }

    console.log("Zone data nodes:", zoneData.groups.length);
    pf.setZoneData(zone, zoneData);
    setPathfinding(pf);

    // Debug visualization - navmesh
    const debugNavmesh = navmesh.clone();
    debugNavmesh.material = new THREE.MeshBasicMaterial({ 
      color: 'red', 
      wireframe: true,
      transparent: true,
      opacity: 1
    });
    scene.add(debugNavmesh);

    // Debug visualization - nodes
    const nodes = [];
    zoneData.groups.forEach((group, groupID) => {
      group.forEach(node => {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.05),
          new THREE.MeshBasicMaterial({ color: 'blue', transparent: "true", opacity: 0.5 })
        );
        sphere.position.copy(node.centroid);
        scene.add(sphere);
        nodes.push(sphere);
      });
    });

    return () => {
      scene.remove(debugNavmesh);
      nodes.forEach(node => scene.remove(node));
    };
  }, [gltf, scene]);

  //Only render children when pathfinding is fully initialized
  if (!pathfinding || !zone) {
    return null;
  }

  return children({ pathfinding, zone });
}