import * as THREE from 'three';
import { useMemo } from 'react';

export function NavMeshVisualizer({ 
  faces, 
  navMeshGeometry,
  showFaces = true,
  showConnections = true,
  showWireframe = true,
  faceColor = 'blue',
  noNeighborColor = 'red',
  connectionColor = 'green',
  wireframeColor = 'red',
  opacity = 0.3,
  wireframeOpacity = 0.2
}) {
  const clonedMesh = useMemo(() => {
    if (!navMeshGeometry || !showWireframe) return null;
    const mesh = new THREE.Mesh(
      navMeshGeometry,
      new THREE.MeshBasicMaterial({
        color: wireframeColor,
        wireframe: true,
        transparent: true,
        opacity: wireframeOpacity
      })
    );
    return mesh;
  }, [navMeshGeometry, showWireframe, wireframeColor, wireframeOpacity]);

  if (!faces || faces.length === 0) return null;

  return (
    <group>
      {/* Original NavMesh Wireframe */}
      {clonedMesh && <primitive object={clonedMesh} />}

      {/* Face Centers */}
      {showFaces && faces.map((face, index) => (
        <mesh key={`face-${index}`} position={face.center}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial
            color={face.neighbors.length === 0 ? noNeighborColor : faceColor}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}

      {/* Connections */}
      {showConnections && faces.map((face, index) => (
        face.neighbors.map(neighborIdx => {
          if (neighborIdx > index) {
            const neighbor = faces[neighborIdx];
            const distance = face.center.distanceTo(neighbor.center);
            const direction = new THREE.Vector3()
              .subVectors(neighbor.center, face.center)
              .normalize();

            const position = new THREE.Vector3()
              .addVectors(face.center, neighbor.center)
              .multiplyScalar(0.5);

            return (
              <mesh
                key={`conn-${index}-${neighborIdx}`}
                position={position}
                quaternion={new THREE.Quaternion().setFromUnitVectors(
                  new THREE.Vector3(0, 1, 0),
                  direction
                )}
              >
                <cylinderGeometry args={[0.02, 0.02, distance, 4]} />
                <meshBasicMaterial 
                  color={connectionColor} 
                  transparent 
                  opacity={opacity} 
                />
              </mesh>
            );
          }
          return null;
        })
      ))}
    </group>
  );
}