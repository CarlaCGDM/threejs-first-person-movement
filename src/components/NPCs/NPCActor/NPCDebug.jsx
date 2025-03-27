import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function NPCDebug({ isPerformingActions }) {
  return (
    <>
      <arrowHelper
        args={[
          new THREE.Vector3(0, 0, -1),
          new THREE.Vector3(0, 1, 0),
          1,
          isPerformingActions ? 0xff00ff : 0xffff00,
          0.2,
          0.1
        ]}
      />
      
      {isPerformingActions && (
        <Html
          position={[0, 2, 0]}
          center
          style={{
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          ACTING
        </Html>
      )}
    </>
  );
}