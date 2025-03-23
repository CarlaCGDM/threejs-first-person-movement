import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const usePlayerMovement = (ref, keys, camera, playerWalkSpeed, playerJumpForce) => {
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    useFrame(() => {
        const { forward, backward, left, right, jump } = keys;
        const velocity = ref.current.linvel();

        // Calculate movement direction
        frontVector.set(0, 0, backward - forward);
        sideVector.set(left - right, 0, 0);
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(playerWalkSpeed)
            .applyEuler(camera.rotation);

        // Apply movement
        ref.current.setLinvel({
            x: forward || backward || left || right ? direction.x : 0,
            y: jump ? playerJumpForce : velocity.y,
            z: forward || backward || left || right ? direction.z : 0,
        });

        // Wake up the RigidBody if it's sleeping
        if (ref.current.isSleeping()) {
            ref.current.wakeUp();
        }
    });
};