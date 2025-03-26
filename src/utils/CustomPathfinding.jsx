import * as THREE from "three";
import { weldVertices } from './vertexWelder';

export class CustomPathfinding {
  constructor() {
    this.epsilon = 0.0001; // For floating-point comparisons
    this.zones = {}; // Add zones storage
    this.defaultZone = 'default'; // Add default zone name
  }

  processNavMesh(geometry) {
    // First weld the vertices
    const weldedGeometry = weldVertices(geometry, this.epsilon);
    const positions = weldedGeometry.attributes.position.array;
    const indices = weldedGeometry.index.array;
    const faces = [];
    const edges = new Map();

    // First pass: create all faces
    const createFace = (a, b, c) => {
      const v1 = this.getVector(a, positions);
      const v2 = this.getVector(b, positions);
      const v3 = this.getVector(c, positions);
      
      const center = new THREE.Vector3()
        .add(v1).add(v2).add(v3)
        .divideScalar(3);

      return {
        vertices: [a, b, c],
        vectors: [v1, v2, v3],
        center,
        neighbors: []
      };
    };

    // Process all faces
    if (indices.length > 0) {
      for (let i = 0; i < indices.length; i += 3) {
        faces.push(createFace(indices[i], indices[i + 1], indices[i + 2]));
      }
    } else {
      for (let i = 0; i < positions.length / 3; i += 3) {
        faces.push(createFace(i, i + 1, i + 2));
      }
    }

    // Second pass: find connections by geometric comparison
    const findNeighbors = (face, idx) => {
      const connections = [];
      
      for (let otherIdx = 0; otherIdx < faces.length; otherIdx++) {
        if (otherIdx === idx) continue;
        
        const otherFace = faces[otherIdx];
        const sharedVertices = this.countSharedVertices(face, otherFace, positions);
        
        if (sharedVertices >= 2) {
          connections.push(otherIdx);
        }
      }
      
      return connections;
    };

    // Find neighbors for each face
    faces.forEach((face, idx) => {
      face.neighbors = findNeighbors(face, idx);
    });

    // Store the processed data in the default zone
    this.zones[this.defaultZone] = { faces };

    return this.zones[this.defaultZone];
  }

  getVector(index, positions) {
    return new THREE.Vector3(
      positions[index * 3],
      positions[index * 3 + 1],
      positions[index * 3 + 2]
    );
  }

  countSharedVertices(face1, face2, positions) {
    const uniqueVerts = new Set([...face1.vertices, ...face2.vertices]);
    return face1.vertices.length + face2.vertices.length - uniqueVerts.size;
  }

  countSharedVerticesGeometric(face1, face2) {
    let count = 0;
    for (const v1 of face1.vectors) {
      for (const v2 of face2.vectors) {
        if (v1.distanceTo(v2) < this.epsilon) {
          count++;
          break;
        }
      }
    }
    return count;
  }

  findPath(startPos, endPos, zone = this.defaultZone) {
    const zoneData = this.zones[zone];
    if (!zoneData) {
      console.error(`Zone ${zone} not found`);
      return null;
    }

    const { faces } = zoneData;
    
    // Find nearest faces
    const startFace = this.findNearestFace(startPos, faces);
    const endFace = this.findNearestFace(endPos, faces);
    
    if (!startFace || !endFace) {
      console.error('Could not find start/end faces');
      return null;
    }

    // A* implementation
    const openSet = new Set([startFace.index]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    faces.forEach((_, index) => {
      gScore.set(index, Infinity);
      fScore.set(index, Infinity);
    });
    
    gScore.set(startFace.index, 0);
    fScore.set(startFace.index, this.heuristic(startFace, endFace));

    while (openSet.size > 0) {
      const current = this.getLowestFScore(openSet, fScore);
      
      if (current === endFace.index) {
        return this.reconstructPath(cameFrom, current, faces);
      }

      openSet.delete(current);
      
      for (const neighbor of faces[current].neighbors) {
        const tentativeGScore = gScore.get(current) + 
          faces[current].center.distanceTo(faces[neighbor].center);
        
        if (tentativeGScore < gScore.get(neighbor)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentativeGScore);
          fScore.set(neighbor, tentativeGScore + 
            this.heuristic(faces[neighbor], endFace));
          
          if (!openSet.has(neighbor)) {
            openSet.add(neighbor);
          }
        }
      }
    }

    console.error('No path found');
    return null;
  }

  heuristic(a, b) {
    return a.center.distanceTo(b.center);
  }

  findNearestFace(position, faces) {
    let nearest = null;
    let minDistance = Infinity;
    
    faces.forEach((face, index) => {
      const distance = position.distanceTo(face.center);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { ...face, index };
      }
    });
    
    return nearest;
  }

  getLowestFScore(openSet, fScore) {
    let lowest = null;
    let lowestScore = Infinity;
    
    openSet.forEach(index => {
      const score = fScore.get(index);
      if (score < lowestScore) {
        lowestScore = score;
        lowest = index;
      }
    });
    
    return lowest;
  }

  reconstructPath(cameFrom, current, faces) {
    const path = [faces[current].center.clone()];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(faces[current].center.clone());
    }
    return path;
  }
}