import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useSettings } from '../../../../context/SettingsContext';

export function NPCDebug({ 
  isPerformingActions, 
  speechContent,
  groupRef
}) {
  const { settings } = useSettings();
  const [isPlayerNearby, setIsPlayerNearby] = useState(false);
  const npcPosition = useRef(new THREE.Vector3());

  useFrame(() => {
    console.log(settings.playerPosition)
    if (!groupRef.current || !settings.playerPosition) return;
    
    // Get NPC world position
    groupRef.current.getWorldPosition(npcPosition.current);
    
    // Create vector from player position
    const playerPos = new THREE.Vector3(...settings.playerPosition);
    const distance = npcPosition.current.distanceTo(playerPos);
    
    setIsPlayerNearby(distance <= 5);
  });

  if (!isPerformingActions) return null;

  return (
    <Html
      position={[0, 2, 0]}
      center
      style={{
        background: 'white',
        color: 'black',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid black',
        minWidth: '20px',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: isPlayerNearby ? 1 : 0.7
      }}
    >
      {isPlayerNearby ? speechContent : "..."}
    </Html>
  );
}