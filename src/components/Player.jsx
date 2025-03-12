import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player({ keys }) {
    const ref = useRef();
    const { camera } = useThree(); // Access the camera

    useFrame(() => {
        const { forward, backward, left, right } = keys;
        const velocity = ref.current.linvel();

        // Update camera position to follow the player
        const { x, y, z } = ref.current.translation();
        camera.position.set(x, y + 1.5, z); // Adjust y-offset for first-person view

        // Movement logic
        frontVector.set(0, 0, backward - forward);
        sideVector.set(left - right, 0, 0);
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(SPEED)
            .applyEuler(camera.rotation);

        // Apply movement velocity
        ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
    });

    return (
        <RigidBody
            ref={ref}
            colliders={false}
            mass={1}
            type="dynamic"
            position={[0, 10, 0]}
            enabledRotations={[false, false, false]}
        >
            <CapsuleCollider args={[0.75, 0.5]} />
        </RigidBody>
    );
}