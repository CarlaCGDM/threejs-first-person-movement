import { useRef, forwardRef } from "react";
import { useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useSettings } from "../context/SettingsContext";
import { usePlayerCamera } from "../hooks/usePlayerCamera"; // Camera hook
import { usePlayerMovement } from "../hooks/usePlayerMovement"; // Movement hook
import { usePlayerPhysics } from "../hooks/usePlayerPhysics"; // Physics hook

export const Player = forwardRef(({ keys }, ref) => {
    const groupRef = useRef(); // Ref for the Three.js Group
    const { camera } = useThree(); // Access the camera
    const { settings } = useSettings(); // Access settings
    const { playerWalkSpeed, initialPlayerPosition, playerJumpForce } = settings;

    // Use the camera hook
    usePlayerCamera(groupRef, camera);

    // Use the movement hook
    usePlayerMovement(ref, keys, camera, playerWalkSpeed, playerJumpForce);

    // Use the physics hook
    usePlayerPhysics(ref, groupRef);

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