import { useNPCMovement } from './useNPCMovement';
import { useNPCActions } from './useNPCActions';
import { NPCDebug } from './NPCDebug';

export function NPCActor({ 
  path, 
  speed = 0.5,
  rotationSpeed = 2,
  smoothness = 0.5,
  onPathComplete,
  color = 'hotpink',
  debug = true 
}) {
  const { isPerformingActions, startActions } = useNPCActions({
    onActionComplete: onPathComplete
  });

  const { groupRef } = useNPCMovement({
    path,
    speed,
    rotationSpeed,
    smoothness,
    lookAheadPoints: 5,
    onReachEnd: () => startActions(5000) // Start actions when path ends
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[0.5, 1.6, 0.5]} />
        <meshStandardMaterial color={isPerformingActions ? 'purple' : color} />
      </mesh>

      {debug && <NPCDebug isPerformingActions={isPerformingActions} />}
    </group>
  );
}
