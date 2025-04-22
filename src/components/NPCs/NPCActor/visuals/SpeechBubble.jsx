import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useSettings } from '../../../../context/SettingsContext';

export function SpeechBubble({ 
  isPerformingActions, 
  speechContent,
  groupRef,
  onDistanceChange // New callback prop
}) {
  const { settings } = useSettings();
  const [isPlayerNearby, setIsPlayerNearby] = useState(false);
  const npcPosition = useRef(new THREE.Vector3());
  const adjustedPlayerPos = useRef(new THREE.Vector3());
  const distanceRef = useRef(Infinity);

  useFrame(() => {
    if (!groupRef.current || !settings.playerPosition) return;

    // Get NPC world position
    groupRef.current.getWorldPosition(npcPosition.current);

    // Create vector from player position, but reuse existing reference
    adjustedPlayerPos.current.set(...settings.playerPosition);

    // Adjust the y-position to account for player height
    adjustedPlayerPos.current.y -= 1.8; // Half of 1.8m

    // Calculate horizontal distance (ignoring vertical difference)
    const horizontalDist = new THREE.Vector2(
      npcPosition.current.x - adjustedPlayerPos.current.x,
      npcPosition.current.z - adjustedPlayerPos.current.z
    ).length();

    // Calculate adjusted 3D distance with less weight on vertical component
    const verticalDist = Math.abs(npcPosition.current.y - adjustedPlayerPos.current.y);
    const combinedDistanceSquared = horizontalDist * horizontalDist + 
      (verticalDist * 0.5) * (verticalDist * 0.5); // Use squared distance to avoid sqrt

    // Or use horizontal distance only if that works better for your game
    const distance = horizontalDist;

    // Update local state and notify parent
    const nearby = distance <= 5;
    if (nearby !== isPlayerNearby) {
      setIsPlayerNearby(nearby);
    }

    // Notify parent component if a distance change occurs
    if (onDistanceChange) {
      onDistanceChange(distance);
    }
  });

  if (!isPerformingActions) return null;

  return (
    <>
      {!settings.selectedProp && !settings.selectedPOI && <Html
        position={[0, 2, 0]}
        center
        style={{
          background: "white",
          color: "black",
          padding: "8px 12px",
          borderRadius: "8px",
          fontSize: "14px",
          border: "1px solid black",
          minWidth: isPlayerNearby ? "250px" : "40px",
          maxWidth: "300px",
          textAlign: "center",
          pointerEvents: "none",
          opacity: isPlayerNearby ? 1 : 0.7,
          display: "inline-block",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        <div style={{ display: "inline-block", maxWidth: "100%" }}>
          {isPlayerNearby ? speechContent : "..."}
        </div>
      </Html>}
    </>
  );
}
