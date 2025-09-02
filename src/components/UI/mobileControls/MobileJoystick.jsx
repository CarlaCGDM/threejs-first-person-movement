import React, { useEffect, useMemo, useRef, useState } from "react";

/** Detect mobile/touch in an effect so we don't access window during render */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      "ontouchstart" in window ||
      window.innerWidth <= 768;

    const onResize = () => setIsMobile(checkMobile());
    onResize(); // initial
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

/** Track viewport size via state (SSR/browser-safe) */
const useViewport = () => {
  const [vp, setVp] = useState({ w: 800, h: 600 }); // safe defaults
  useEffect(() => {
    const onResize = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return vp;
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/**
 * MobileJoystick
 * Props:
 *  - updateKey: (key: 'forward'|'backward'|'left'|'right'|'jump', pressed: boolean) => void
 *  - position?: 'left' | 'right' (default 'left')
 *  - size?: number (px) – outer diameter of joystick base (responsive if omitted)
 */
export default function MobileJoystick({ updateKey, position = "left", size }) {
  // ✅ Hooks are always called in the same order
  const isMobile = useIsMobile();
  const { w, h } = useViewport();

  // Sizing (pure from state, no direct window reads)
  const baseSize = useMemo(() => {
    if (typeof size === "number") return size;
    const minDim = Math.min(w, h);
    return clamp(minDim / 4, 120, 180);
  }, [size, w, h]);

  const knobSize = Math.round(baseSize * 0.45);
  const deadzone = Math.round(baseSize * 0.12); // px radius where no input
  const maxRadius = Math.round((baseSize - knobSize) / 2); // travel limit

  // Refs & state
  const baseRef = useRef(null);
  const [active, setActive] = useState(false);
  const pointerIdRef = useRef(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const lastDirsRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Helpers
  const setDirs = (dirs) => {
    const last = lastDirsRef.current;
    if (
      dirs.forward !== last.forward ||
      dirs.backward !== last.backward ||
      dirs.left !== last.left ||
      dirs.right !== last.right
    ) {
      lastDirsRef.current = dirs;
      updateKey("forward", dirs.forward);
      updateKey("backward", dirs.backward);
      updateKey("left", dirs.left);
      updateKey("right", dirs.right);
    }
  };

  const resetDirs = () => {
    setDirs({ forward: false, backward: false, left: false, right: false });
  };

  const computeDirs = (dx, dy) => {
    const dist = Math.hypot(dx, dy);
    if (dist < deadzone)
      return { forward: false, backward: false, left: false, right: false };

    // Normalize to unit circle
    const nx = dx / dist;
    const ny = dy / dist;

    // Thresholds to decide when a direction is "pressed".
    const axisThreshold = 0.35;
    return {
      right: nx > axisThreshold,
      left: nx < -axisThreshold,
      // screen y increases downward → invert for forward/backward
      forward: ny < -axisThreshold,
      backward: ny > axisThreshold,
    };
  };

  const updateFromEvent = (e) => {
    if (!baseRef.current) return;

    const rect = baseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Clamp knob travel
    const dist = Math.hypot(dx, dy);
    const scale = dist > maxRadius ? maxRadius / dist : 1;
    const kx = dx * scale;
    const ky = dy * scale;

    setKnobPos({ x: kx, y: ky });
    setDirs(computeDirs(dx, dy));
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (pointerIdRef.current !== null) return;
    pointerIdRef.current = e.pointerId;
    setActive(true);
    baseRef.current?.setPointerCapture(e.pointerId);
    updateFromEvent(e);
  };

  const handlePointerMove = (e) => {
    if (!active || e.pointerId !== pointerIdRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    updateFromEvent(e);
  };

  const release = () => {
    pointerIdRef.current = null;
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    resetDirs();
  };

  const handlePointerUp = (e) => {
    if (e.pointerId !== pointerIdRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    try {
      baseRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    release();
  };

  const handlePointerCancel = (e) => {
    if (e.pointerId !== pointerIdRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    release();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => resetDirs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Styles
  const baseStyle = {
    position: "fixed",
    bottom: 20,
    [position === "left" ? "left" : "right"]: 20,
    width: baseSize,
    height: baseSize,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.25) inset, 0 2px 8px rgba(0,0,0,0.25)",
    touchAction: "none",
    userSelect: "none",
    zIndex: 1000,
  };

  const gateStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    width: baseSize * 0.9,
    height: baseSize * 0.9,
    borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.2)",
  };

  const knobStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: `translate(calc(-50% + ${knobPos.x}px), calc(-50% + ${knobPos.y}px))`,
    width: knobSize,
    height: knobSize,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.5)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
    transition: active ? "none" : "transform 120ms ease-out",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    color: "rgba(0,0,0,0.6)",
  };

  const jumpSize = Math.round(baseSize * 0.55);
  const jumpButtonStyle = {
    position: "fixed",
    bottom: 20 + baseSize * 0.25,
    right: 20, // keep jump on the right side
    width: jumpSize,
    height: jumpSize,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    fontSize: Math.round(jumpSize * 0.28),
    fontWeight: "bold",
    border: "none",
    touchAction: "manipulation",
    userSelect: "none",
    zIndex: 1000,
  };

  // Decide what to render *after* all hooks are called
  if (!isMobile) return null;

  return (
    <>
      <div
        ref={baseRef}
        style={baseStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div style={gateStyle} />
        {/* Optional deadzone visual:
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: deadzone * 2,
            height: deadzone * 2,
            borderRadius: "50%",
            border: "1px dashed rgba(255,255,255,0.25)",
          }}
        /> */}
        <div style={knobStyle}>●</div>
      </div>

      {/* Jump button */}
      <button
        aria-label="Jump"
        style={jumpButtonStyle}
        onPointerDown={(e) => {
          e.preventDefault();
          updateKey("jump", true);
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          updateKey("jump", false);
        }}
        onPointerCancel={(e) => {
          e.preventDefault();
          updateKey("jump", false);
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        ⤒
      </button>
    </>
  );
}
