import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "../../../hooks/useIsMobile";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/**
 * CameraJoystick
 *
 * Props:
 *  - externalAimRef (required): a React ref object whose .current is a mutable object
 *      expected shape: { vx: number, vy: number } where vx, vy ∈ [-1, 1]
 *      vx > 0 → look right, vx < 0 → look left
 *      vy > 0 → look down,  vy < 0 → look up
 *  - position?: 'right' | 'left' (defaults 'right')
 *  - size?: number (px) outer diameter (responsive if omitted)
 *  - deadzone?: number in [0..1] of radius as a fraction of base (defaults 0.12)
 */
export default function CameraJoystick({
  externalAimRef,
  position = "right",
  size,
  deadzone: deadzoneFrac = 0.12,
}) {
  const isMobile = useIsMobile();

  // Sizing
  const baseSize = useMemo(() => {
    if (typeof size === "number") return size;
    const w = typeof window !== "undefined" ? window.innerWidth : 800;
    const h = typeof window !== "undefined" ? window.innerHeight : 600;
    const minDim = Math.min(w, h);
    return clamp(minDim / 4, 120, 180);
  }, [size]);

  const knobSize = Math.round(baseSize * 0.45);
  const deadzone = Math.round(baseSize * deadzoneFrac); // px radius
  const maxRadius = Math.round((baseSize - knobSize) / 2); // travel limit (px)

  // Refs & state
  const baseRef = useRef(null);
  const [active, setActive] = useState(false);
  const pointerIdRef = useRef(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  // Ensure the ref exists
  useEffect(() => {
    if (externalAimRef && externalAimRef.current == null) {
      externalAimRef.current = { vx: 0, vy: 0 };
    }
  }, [externalAimRef]);

  const setAim = (vx, vy) => {
    if (!externalAimRef) return;
    if (!externalAimRef.current) externalAimRef.current = { vx: 0, vy: 0 };
    externalAimRef.current.vx = vx;
    externalAimRef.current.vy = vy;
  };

  const clearAim = () => setAim(0, 0);

  // Map pointer position → normalized aim vector in [-1, 1]
  const computeAimFromDelta = (dx, dy) => {
    const dist = Math.hypot(dx, dy);
    if (dist < deadzone) return { vx: 0, vy: 0 };

    // clamp to gate
    const limited = dist > maxRadius ? maxRadius / dist : 1;
    const kx = dx * limited;
    const ky = dy * limited;

    // return visual knob pos
    setKnobPos({ x: kx, y: ky });

    // normalize to [-1..1] using maxRadius
    const vx = kx / maxRadius;     // +right / -left
    const vy = ky / maxRadius;     // +down  / -up
    return { vx, vy };
  };

  const updateFromEvent = (e) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const { vx, vy } = computeAimFromDelta(dx, dy);
    setAim(vx, vy);
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
    clearAim();
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

  // Cleanup aim on unmount
  useEffect(() => {
    return () => clearAim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMobile) return null;

  // Styles (mirror the movement joystick vibe)
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

  return (
    <div
      ref={baseRef}
      style={baseStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div style={gateStyle} />
      <div style={knobStyle}>●</div>
    </div>
  );
}
