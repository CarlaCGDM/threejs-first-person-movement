import * as THREE from "three";
import { useRef, forwardRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useSettings } from "../context/SettingsContext";

const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export const Player = forwardRef(({ keys }, ref) => {
    const groupRef = useRef(); // Ref for the Three.js Group
    const { camera } = useThree(); // Access the camera
    const { world } = useRapier(); // Access the Rapier physics world
    const { settings } = useSettings(); // Access settings
    const { playerWalkSpeed, initialPlayerPosition, playerJumpForce } = settings;

    // Attach the camera to the player
    useEffect(() => {
        if (groupRef.current) {
            camera.position.set(0, 1.0, 0); // Adjust camera height relative to the player
            groupRef.current.add(camera);
        }

        // Cleanup: Detach the camera when the component unmounts
        return () => {
            if (groupRef.current) {
                groupRef.current.remove(camera);
            }
        };
    }, [camera]);

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

        // Update the group's position to match the RigidBody's position
        const { x, y, z } = ref.current.translation();
        groupRef.current.position.set(x, y, z);

        // Step the physics world to ensure updates are synchronized
        world.step();
    });

    return (
        <group ref={groupRef}>
            <RigidBody
                ref={ref} // Internal ref for player logic
                colliders={false}
                mass={1}
                type="dynamic"
                position={initialPlayerPosition}
                enabledRotations={[false, false, false]}
            >
                <CapsuleCollider args={[0.25, 0.5]} />
            </RigidBody>
        </group>
    );
});