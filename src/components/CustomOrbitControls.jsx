import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useSettings } from "../context/SettingsContext";

export const CustomOrbitControls = forwardRef((props, ref) => {
    const { camera, size } = useThree(); // Access camera and canvas size
    const isRotating = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });

    const { settings } = useSettings(); // Access settings
    const { cameraRotationSpeed } = settings;

    const scaledRotationSpeed = cameraRotationSpeed * 0.00001; // Adjust scaling factor as needed

    // Store accumulated pitch and yaw angles
    const pitch = useRef(0); // Rotation around the X-axis (up/down)
    const yaw = useRef(0); // Rotation around the Y-axis (left/right)

    // Expose a method to look at a specific point
    useImperativeHandle(ref, () => ({
        lookAt: (targetPosition) => {
            // Update the camera's rotation to look at the target
            camera.lookAt(targetPosition);

            // Calculate the new pitch and yaw based on the camera's quaternion
            const euler = new THREE.Euler().setFromQuaternion(camera.quaternion);
            pitch.current = euler.x;
            yaw.current = euler.y;

            // Reset previousMousePosition to avoid snapping back to the old rotation
            previousMousePosition.current = { x: 0, y: 0 };
        },
    }));

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
            yaw.current -= deltaX * scaledRotationSpeed; // Horizontal rotation (left/right)
            pitch.current -= deltaY * scaledRotationSpeed; // Vertical rotation (up/down)

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
});