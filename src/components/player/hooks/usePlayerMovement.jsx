import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const usePlayerMovement = (ref, keys, camera, playerWalkSpeed, playerJumpForce, isGrounded) => {
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
            y: velocity.y, // Allow jumping only when grounded
            z: forward || backward || left || right ? direction.z : 0,
        });

        // Prevent sliding when standing still on stairs
         // Prevent sliding when standing still on stairs - only if we're actually moving
        const hasVelocity = Math.abs(velocity.x) > 0.01 || Math.abs(velocity.y) > 0.01 || Math.abs(velocity.z) > 0.01;
        console.log(hasVelocity)
        console.log(velocity)
        if (!forward && !backward && !left && !right && isGrounded && hasVelocity) {
            ref.current.setLinvel({ x: 0, y: 0.15, z: 0 });
        }

        // Wake up the RigidBody if it's sleeping
        if (ref.current.isSleeping()) {
            ref.current.wakeUp();
        }
    });
};