import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const usePlayerMovement = (ref, keys, camera, walkSpeed, jumpForce, isGrounded) => {
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();

    useFrame((_, delta) => {
        if (!ref.current) return;

        const { forward, backward, left, right, jump } = keys;
        const moving = forward || backward || left || right;
        const vel = ref.current.linvel();

        // Movement
        frontVector.set(0, 0, backward - forward);
        sideVector.set(left - right, 0, 0);
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(walkSpeed)
            .applyEuler(camera.rotation);

        if (moving) {
            ref.current.setLinvel({
                x: direction.x,
                y: jump && isGrounded ? jumpForce : vel.y,
                z: direction.z,
            });
        } else {
            // Freeze movement and gravity
            ref.current.setLinvel({ x: 0, y: 0, z: 0 });
        }

        if (ref.current.isSleeping()) {
            ref.current.wakeUp();
        }
    });
};
