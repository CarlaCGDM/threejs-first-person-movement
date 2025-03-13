import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";

const SPEED = 3;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player({ keys }) {
    const groupRef = useRef(); // Ref for the Three.js Group
    const rigidBodyRef = useRef(); // Ref for the RigidBody
    const { camera } = useThree(); // Access the camera
    const { world } = useRapier(); // Access the Rapier physics world

    // Smoothing variables
    const targetPosition = useRef(new THREE.Vector3());
    const currentPosition = useRef(new THREE.Vector3());

    // Attach the camera to the player
    useEffect(() => {
        if (groupRef.current) {
            camera.position.set(0, 1.5, 0); // Adjust camera height relative to the player
            groupRef.current.add(camera);
        }

        // Cleanup: Detach the camera when the component unmounts
        return () => {
            if (groupRef.current) {
                groupRef.current.remove(camera);
            }
        };
    }, [camera]);

    useFrame((state, delta) => {
        const { forward, backward, left, right } = keys;
        const velocity = rigidBodyRef.current.linvel();

        // Movement logic
        frontVector.set(0, 0, backward - forward);
        sideVector.set(left - right, 0, 0);
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED)
            .applyEuler(camera.rotation);

        // Apply movement velocity
        rigidBodyRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });

        // Wake up the RigidBody if it's sleeping
        if (rigidBodyRef.current.isSleeping()) {
            rigidBodyRef.current.wakeUp();
        }

        // Update the target position
        const { x, y, z } = rigidBodyRef.current.translation();
        targetPosition.current.set(x, y, z);

        // Smoothly interpolate the camera's position
        currentPosition.current.lerp(targetPosition.current, 0.1); // Adjust the lerp factor for smoother movement
        groupRef.current.position.copy(currentPosition.current);

        // Step the physics world to ensure updates are synchronized
        world.step();
    });

    return (
        <group ref={groupRef}>
            <RigidBody
                ref={rigidBodyRef}
                colliders={false}
                mass={1}
                type="dynamic"
                position={[0, 10, 0]}
                enabledRotations={[false, false, false]}
            >
                <CapsuleCollider args={[0.75, 0.5]} />
            </RigidBody>
        </group>
    );
}