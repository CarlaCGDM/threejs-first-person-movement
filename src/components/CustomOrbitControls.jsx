import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useSettings } from "../context/SettingsContext";

export const CustomOrbitControls = forwardRef((props, ref) => {
    const { camera } = useThree(); // Access the camera
    const isRotating = useRef(false); // Track rotation state
    const { settings } = useSettings();
    const { cameraRotationSpeed } = settings;

    // Store pitch (up/down) and yaw (left/right) rotation angles
    const pitch = useRef(0);
    const yaw = useRef(0);

    // Expose a method to set the camera to look at a specific point
    useImperativeHandle(ref, () => ({
        lookAt: (targetPosition) => {
            camera.lookAt(targetPosition);
            const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
            pitch.current = euler.x;
            yaw.current = euler.y;
        },
        // Expose the getCameraRotation method
        getCameraRotation: () => {
            // Convert camera's quaternion to Euler angles
            const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
            return euler; // Return Euler angles (pitch, yaw, roll)
        }
    }));

    useEffect(() => {
        const canvas = document.querySelector("canvas");

        const handleMouseDown = (event) => {
            if (event.button === 2 || event.button === 1) { // Right-click initiates rotation
                isRotating.current = true;
                canvas.requestPointerLock(); // Lock pointer for smooth movement
            }
        };

        const handleMouseUp = (event) => {
            if (event.button === 2 || event.button === 1) {
                isRotating.current = false;
                document.exitPointerLock(); // Release pointer lock
            }
        };

        const handleMouseMove = (event) => {
            if (isRotating.current) {
                yaw.current -= event.movementX * cameraRotationSpeed * 0.0001;
                pitch.current -= event.movementY * cameraRotationSpeed * 0.0001;
                pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current)); // Clamp pitch
            }
        };

        const handlePointerLockChange = () => {
            isRotating.current = document.pointerLockElement === canvas;
        };

        // Attach event listeners
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("pointerlockchange", handlePointerLockChange);

        return () => {
            // Cleanup event listeners
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("pointerlockchange", handlePointerLockChange);
        };
    }, [cameraRotationSpeed]);

    const dampingFactor = 0.1; // Controls smoothness of camera rotation

    useFrame(() => {
        if (isRotating.current) {
            // Smoothly interpolate pitch and yaw
            pitch.current = THREE.MathUtils.lerp(pitch.current, pitch.current, dampingFactor);
            yaw.current = THREE.MathUtils.lerp(yaw.current, yaw.current, dampingFactor);

            // Create quaternions for rotation
            const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch.current);
            const yawQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

            // Apply combined rotation to camera
            camera.quaternion.copy(yawQuaternion.multiply(pitchQuaternion));
        }
    });

    return null; // This component does not render anything directly
});
