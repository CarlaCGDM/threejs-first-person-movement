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

    // Store accumulated pitch and yaw angles
    const pitch = useRef(0); // Rotation around the X-axis (up/down)
    const yaw = useRef(0); // Rotation around the Y-axis (left/right)

    // Expose a method to look at a specific point
    useImperativeHandle(ref, () => ({
        lookAt: (targetPosition) => {
            // Update the camera's rotation to look at the target
            camera.lookAt(targetPosition);

            // Calculate the new pitch and yaw based on the camera's quaternion
            const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
            pitch.current = euler.x;
            yaw.current = euler.y;
        },
    }));

    useEffect(() => {
        const canvas = document.querySelector("canvas"); // Get the canvas element

        const handleMouseDown = (event) => {
            if (event.button === 2) { // Right mouse button
                isRotating.current = true;
                previousMousePosition.current = {
                    x: event.clientX,
                    y: event.clientY,
                };

                // Request pointer lock when right mouse button is pressed
                canvas.requestPointerLock();
            }
        };

        const handleMouseUp = (event) => {
            if (event.button === 2) { // Right mouse button
                isRotating.current = false;

                // Exit pointer lock when right mouse button is released
                document.exitPointerLock();
            }
        };

        const handleMouseMove = (event) => {
            if (isRotating.current) {
                // Calculate mouse movement delta
                const deltaX = event.movementX || 0; // Use movementX for pointer lock
                const deltaY = event.movementY || 0; // Use movementY for pointer lock

                // Update pitch and yaw angles based on mouse movement
                yaw.current -= deltaX * cameraRotationSpeed * 0.0001; // Horizontal rotation (left/right)
                pitch.current -= deltaY * cameraRotationSpeed * 0.0001; // Vertical rotation (up/down)

                // Clamp pitch to avoid flipping
                pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current));
            }
        };

        const handlePointerLockChange = () => {
            if (document.pointerLockElement === canvas) {
                isRotating.current = true;
            } else {
                isRotating.current = false;
            }
        };

        // Add event listeners
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("pointerlockchange", handlePointerLockChange);

        // Cleanup
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("pointerlockchange", handlePointerLockChange);
        };
    }, [cameraRotationSpeed]);

    const dampingFactor = 0.1; // Adjust for smoother rotation

useFrame((state, delta) => {
    if (isRotating.current) {
        // Smoothly interpolate pitch and yaw
        const targetPitch = pitch.current;
        const targetYaw = yaw.current;

        pitch.current = THREE.MathUtils.lerp(pitch.current, targetPitch, dampingFactor);
        yaw.current = THREE.MathUtils.lerp(yaw.current, targetYaw, dampingFactor);

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