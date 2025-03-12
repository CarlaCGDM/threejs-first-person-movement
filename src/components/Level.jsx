import { useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';

export function Level() {
    const { scene } = useGLTF('/assets/meshcollider.glb');
    const [colliders, setColliders] = useState([]);
    const [slopeColliders, setSlopeColliders] = useState([]);

    useEffect(() => {
        const tempColliders = [];
        const tempSlopeColliders = [];

        scene.traverse((child) => {
            if (child.isMesh && child.name.startsWith('CubeCollider')) {
                // Store the original rotation
                const originalRotation = child.rotation.clone();

                // Reset rotation to calculate size
                child.rotation.set(0, 0, 0);
                child.updateMatrixWorld(); // Update the world matrix

                // Compute bounding box for collider dimensions
                const box = new THREE.Box3().setFromObject(child);
                const size = new THREE.Vector3();
                box.getSize(size);

                const position = new THREE.Vector3();
                box.getCenter(position);

                // Reapply the original rotation
                child.rotation.copy(originalRotation);

                tempColliders.push({
                    type: 'cuboid',
                    position: position.clone(),
                    size: [size.x / 2, size.y / 2, size.z / 2], // Rapier expects half extents
                    rotation: originalRotation.toArray(),
                });

                child.visible = false;
            }

            else if (child.isMesh && child.name.startsWith('Slope')) {
                // Store the original rotation
                const originalRotation = child.rotation.clone();

                // Reset rotation to calculate size
                child.rotation.set(0, 0, 0);
                child.updateMatrixWorld(); // Update the world matrix

                // Compute bounding box for collider dimensions
                const box = new THREE.Box3().setFromObject(child);
                const size = new THREE.Vector3();
                box.getSize(size);

                const position = new THREE.Vector3();
                box.getCenter(position);

                // Reapply the original rotation
                child.rotation.copy(originalRotation);

                tempSlopeColliders.push({
                    type: 'cuboid',
                    position: position.clone(),
                    size: [size.x / 2, size.y / 2, size.z / 2], // Rapier expects half extents
                    rotation: originalRotation.toArray(),
                });

                child.visible = false;
            }
        });

        setColliders(tempColliders);
        setSlopeColliders(tempSlopeColliders);
    }, [scene]);

    return (
        <group>
            {/* Render the visual model */}
            <primitive object={scene} />

            {/* Render cube colliders */}
            {colliders.map((col, idx) => (
                <group key={idx}>
                    <RigidBody type="fixed">
                        <CuboidCollider
                            args={col.size}
                            position={[col.position.x, col.position.y, col.position.z]}
                            rotation={col.rotation}
                        />
                    </RigidBody>
                    {/* Wireframe for debugging */}
                    <mesh
                        position={[col.position.x, col.position.y, col.position.z]}
                        rotation={col.rotation}
                    >
                        <boxGeometry args={[col.size[0] * 2, col.size[1] * 2, col.size[2] * 2]} />
                        <meshBasicMaterial color="red" wireframe />
                    </mesh>
                </group>

            ))}

            {/* Render slope colliders as rotated cubes */}
            {slopeColliders.map((col, idx) => (
                <group key={idx}>
                    <RigidBody type="fixed">
                        <CuboidCollider
                            args={col.size}
                            position={[col.position.x, col.position.y, col.position.z]}
                            rotation={col.rotation}
                        />
                    </RigidBody>
                    {/* Wireframe for debugging */}
                    <mesh
                        position={[col.position.x, col.position.y, col.position.z]}
                        rotation={col.rotation}
                    >
                        <boxGeometry args={[col.size[0] * 2, col.size[1] * 2, col.size[2] * 2]} />
                        <meshBasicMaterial color="blue" wireframe />
                    </mesh>
                </group>
            ))}
        </group>
    );
}