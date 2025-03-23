import { useRef, forwardRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { CapsuleCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { useSettings } from "../context/SettingsContext";
import { usePlayerCamera } from "../hooks/usePlayerCamera"; // Camera hook
import { usePlayerMovement } from "../hooks/usePlayerMovement"; // Movement hook
import { usePlayerPhysics } from "../hooks/usePlayerPhysics"; // Physics hook

export const Player = forwardRef(({ keys }, ref) => {
    const groupRef = useRef(); // Ref for the Three.js Group
    const { camera } = useThree(); // Access the camera
    const { settings } = useSettings(); // Access settings
    const { playerWalkSpeed, initialPlayerPosition, playerJumpForce } = settings;

    // State to track if the player is grounded
    const [isGrounded, setIsGrounded] = useState(false);

    // Use the camera hook
    usePlayerCamera(groupRef, camera);

    // Use the movement hook
    usePlayerMovement(ref, keys, camera, playerWalkSpeed, playerJumpForce, isGrounded);

    // Use the physics hook
    usePlayerPhysics(ref, groupRef);

    useEffect(() => {
        console.log("isGrounded: " + isGrounded)
      }, [isGrounded]);

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

                {/* Ground check sensor (small sphere below the player) */}
                <CuboidCollider
                    args={[0.25, 0.1, 0.25]} // Small box (adjust size as needed)
                    position={[0, -0.66, 0]} // Positioned slightly below the player
                    sensor
                    onIntersectionEnter={() => setIsGrounded(true)} // Called when the sensor touches the ground
                    onIntersectionExit={() => setIsGrounded(false)} // Called when the sensor leaves the ground
                />
            </RigidBody>
        </group>
    );
});