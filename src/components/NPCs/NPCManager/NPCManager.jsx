import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import NPCNavigation from '../NPCNavigation/NPCNavigation';
import { Box } from '@react-three/drei';
import NPCActor from '../NPCActor/NPCActor';

export function NPCManager() {
  const npcRef = useRef();
  const [isReady, setIsReady] = useState(false);

  return (
    <NPCNavigation navmeshUrl="/assets/models/CovaBonica_LODs/cb_navmesh.glb">
      {({ pathfinding, zone }) => (
        <>
          <group ref={npcRef}>
            <Box args={[0.5, 1.60, 0.5]} position={[0, 0.8, 0]}>
              <meshStandardMaterial color="hotpink" />
            </Box>
          </group>
          <NPCActor 
            npcRef={npcRef} 
            pathfinding={pathfinding} 
            zone={zone}
            onReady={() => setIsReady(true)}
          />
        </>
      )}
    </NPCNavigation>
  );
}