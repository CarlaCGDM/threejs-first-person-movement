import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

export function CustomOrbitControls() {
    const { camera, size } = useThree(); // Access camera and canvas size
    const isRotating = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });
    const rotationSpeed = 0.00003; // Adjust this value to control rotation sensitivity

    // Store accumulated pitch and yaw angles
    const pitch = useRef(0); // Rotation around the X-axis (up/down)
    const yaw = useRef(0); // Rotation around the Y-axis (left/right)

    useEffect(() => {
        const handleMouseDown = (event) => {
            if (event.button === 2) { // Right mouse button
                isRotating.current = true;
                previousMousePosition.current = {
                    x: event.clientX,
                    y: event.clientY,
                };
            }
        };

        const handleMouseUp = (event) => {
            if (event.button === 2) { // Right mouse button
                isRotating.current = false;
            }
        };

        const handleMouseMove = (event) => {
            if (isRotating.current) {
                // Update previous mouse position
                previousMousePosition.current = {
                    x: event.clientX,
                    y: event.clientY,
                };
            }
        };

        // Add event listeners
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        // Cleanup
        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useFrame(() => {
        if (isRotating.current) {
            // Calculate mouse movement delta
            const deltaX = previousMousePosition.current.x - size.width / 2;
            const deltaY = previousMousePosition.current.y - size.height / 2;

            // Update pitch and yaw angles based on mouse position
            yaw.current -= deltaX * rotationSpeed; // Horizontal rotation (left/right)
            pitch.current -= deltaY * rotationSpeed; // Vertical rotation (up/down)

            // Clamp pitch to avoid flipping
            pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current));

            // Create quaternions for pitch and yaw
            const pitchQuaternion = new THREE.Quaternion();
            pitchQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch.current);

            const yawQuaternion = new THREE.Quaternion();
            yawQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

            // Combine the quaternions
            const combinedQuaternion = yawQuaternion.multiply(pitchQuaternion);

            // Apply the combined quaternion to the camera
            camera.quaternion.copy(combinedQuaternion);
        }
    });

    return null; // This component doesn't render anything
}