// src/utils/vertexWelder.js
import * as THREE from 'three';

export function weldVertices(geometry, tolerance = 0.0001) {
  const positions = geometry.attributes.position.array;
  const indices = geometry.index?.array;
  const vertexMap = {};
  const newIndices = [];
  const newPositions = [];
  let nextIndex = 0;

  // Create a new index buffer with welded vertices
  if (indices) {
    for (let i = 0; i < indices.length; i++) {
      const vertexIndex = indices[i];
      const x = positions[vertexIndex * 3];
      const y = positions[vertexIndex * 3 + 1];
      const z = positions[vertexIndex * 3 + 2];
      
      const key = `${x.toFixed(4)}_${y.toFixed(4)}_${z.toFixed(4)}`;
      
      if (!vertexMap[key]) {
        vertexMap[key] = nextIndex;
        newPositions.push(x, y, z);
        nextIndex++;
      }
      newIndices.push(vertexMap[key]);
    }
  } else {
    // For non-indexed geometry
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      const key = `${x.toFixed(4)}_${y.toFixed(4)}_${z.toFixed(4)}`;
      
      if (!vertexMap[key]) {
        vertexMap[key] = nextIndex;
        newPositions.push(x, y, z);
        nextIndex++;
      }
      newIndices.push(vertexMap[key]);
    }
  }

  // Create new geometry with welded vertices
  const weldedGeometry = new THREE.BufferGeometry();
  weldedGeometry.setIndex(newIndices);
  weldedGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(newPositions, 3)
  );

  return weldedGeometry;
}