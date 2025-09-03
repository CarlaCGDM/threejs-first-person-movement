import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useSettings } from "../context/SettingsContext";
import { useIsMobile } from "../hooks/useIsMobile";

export const CustomOrbitControls = forwardRef((props, ref) => {
  const { externalAimRef } = props; // NEW (optional)
  const { camera } = useThree();
  const isRotating = useRef(false);
  const { settings } = useSettings();
  const { cameraRotationSpeed } = settings;

  // Detect mobile devices
  const isMobile = useIsMobile();
  const speedMultiplier = 1.0;

  // Store pitch and yaw rotation angles with smoothing
  const pitch = useRef(0);
  const yaw = useRef(0);
  const targetPitch = useRef(0);
  const targetYaw = useRef(0);

  // Expose methods
  useImperativeHandle(ref, () => ({
    lookAt: (targetPosition) => {
      camera.lookAt(targetPosition);
      const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
      pitch.current = euler.x;
      yaw.current = euler.y;
      targetPitch.current = euler.x;
      targetYaw.current = euler.y;
    },
    getCameraRotation: () => {
      const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
      return euler;
    },
  }));

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const startPos = { x: 0, y: 0 };
    let lastTouch = { x: 0, y: 0 };
    let isTouching = false;

    const handleMouseDown = (event) => {
      if (event.button === 0) {
        startPos.x = event.clientX;
        startPos.y = event.clientY;
        isRotating.current = false;

        const onMouseMoveBeforeLock = (e) => {
          const dx = e.clientX - startPos.x;
          const dy = e.clientY - startPos.y;
          if (Math.hypot(dx, dy) > 4) {
            isRotating.current = true;
            canvas.requestPointerLock();
            document.removeEventListener("mousemove", onMouseMoveBeforeLock);
          }
        };

        document.addEventListener("mousemove", onMouseMoveBeforeLock);
        const clearListener = () =>
          document.removeEventListener("mousemove", onMouseMoveBeforeLock);
        canvas.addEventListener("mouseup", clearListener, { once: true });
      }
    };

    const handleMouseUp = (event) => {
      if (event.button === 0 && isRotating.current) {
        document.exitPointerLock();
      }
    };

    const handleMouseMove = (event) => {
      if (isRotating.current) {
        targetYaw.current -= event.movementX * cameraRotationSpeed * 0.0001 * speedMultiplier;
        targetPitch.current -= event.movementY * cameraRotationSpeed * 0.0001 * speedMultiplier;
        targetPitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetPitch.current));
      }
    };

    const handlePointerLockChange = () => {
      isRotating.current = document.pointerLockElement === canvas;
    };

    // Touch event handlers (keep your original; joystick is separate)
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isTouching = true;
        lastTouch.x = e.touches[0].clientX;
        lastTouch.y = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (!isTouching || e.touches.length !== 1) return;
      const touch = e.touches[0];

      const dx = touch.clientX - lastTouch.x;
      const dy = touch.clientY - lastTouch.y;

      lastTouch.x = touch.clientX;
      lastTouch.y = touch.clientY;

      targetYaw.current -= dx * cameraRotationSpeed * 0.0001 * speedMultiplier;
      targetPitch.current -= dy * cameraRotationSpeed * 0.0001 * speedMultiplier;
      targetPitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetPitch.current));
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    // Add event listeners
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    // Touch listeners
    // canvas.addEventListener("touchstart", handleTouchStart);
    // canvas.addEventListener("touchmove", handleTouchMove);
    // canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);

    //   canvas.removeEventListener("touchstart", handleTouchStart);
    //   canvas.removeEventListener("touchmove", handleTouchMove);
    //   canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [cameraRotationSpeed, speedMultiplier]);

  const dampingFactor = 0.1;

  useFrame(() => {
    // NEW: read joystick aim every frame (vx, vy in [-1,1])
    let vx = 0,
      vy = 0;
    if (externalAimRef && externalAimRef.current) {
      vx = externalAimRef.current.vx || 0;
      vy = externalAimRef.current.vy || 0;
    }

    if (vx !== 0 || vy !== 0) {
      // Scale joystick feel; tweak the factor to taste. Higher = faster turn.
      const joyFactor = cameraRotationSpeed * 0.0025 * (isMobile ? 0.75 : 1.0);
      // Horizontal: yaw (left/right)
      targetYaw.current -= vx * joyFactor;
      // Vertical: pitch (up/down); clamp pitch
      targetPitch.current -= vy * joyFactor;
      targetPitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetPitch.current));
    }

    // Smoothly interpolate toward target
    pitch.current = THREE.MathUtils.lerp(pitch.current, targetPitch.current, dampingFactor);
    yaw.current = THREE.MathUtils.lerp(yaw.current, targetYaw.current, dampingFactor);

    // Apply combined rotation to camera
    const pitchQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch.current);
    const yawQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    camera.quaternion.copy(yawQ.multiply(pitchQ));
  });

  return null;
});
