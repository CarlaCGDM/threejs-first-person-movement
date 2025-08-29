import { useRef, forwardRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { CapsuleCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { useSettings } from "../../context/SettingsContext";
import { usePlayerCamera } from "./hooks/usePlayerCamera";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { usePlayerPhysics } from "./hooks/usePlayerPhysics";
import { usePlayerPosition } from "./hooks/usePlayerPosition";

export const Player = forwardRef(({ keys }, ref) => {
    const groupRef = useRef(); // Ref for grouping the player
    const { camera } = useThree(); // Access Three.js camera
    const { settings, dispatch } = useSettings();
    const { playerWalkSpeed, initialPlayerPosition, playerJumpForce } = settings;

    const [isGrounded, setIsGrounded] = useState(true); // Track if the player is grounded

    // Store player reference in settings context
    useEffect(() => {
        dispatch({ type: "SET_PLAYER_REF", payload: groupRef });
    }, [groupRef]);

    usePlayerPosition(); // Handle player positioning logic
    usePlayerMovement(ref, keys, camera, playerWalkSpeed, playerJumpForce, isGrounded); // Handle movement
    usePlayerCamera(groupRef, camera); // Attach camera to the player
    usePlayerPhysics(ref, groupRef); // Apply physics logic

    return (
        <group ref={groupRef}>
            <RigidBody
                ref={ref}
                colliders={false}
                mass={1}
                type="dynamic"
                position={initialPlayerPosition}
                enabledRotations={[false, false, false]} // Disable rotation for stability
                name="player"
                friction={0.3}
                
            >
                {/* Player's main collider */}
                <CapsuleCollider args={[0.75, 0.25]} />

                {/* Ground detection sensor */}
                <CuboidCollider
                    args={[0.5, 0.5, 0.5]}
                    position={[0, -1, 0]} // Slightly below player
                    sensor
                    onIntersectionEnter={() => setIsGrounded(true)} // Detects contact with the ground
                />
            </RigidBody>
        </group>
    );
});
