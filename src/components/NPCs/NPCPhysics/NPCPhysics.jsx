// NPCPhysics.jsx
import { useEffect } from 'react';
import { useRapier } from '@react-three/rapier';

export default function NPCPhysics({ npcRef, sensorConfig }) {
  const { world } = useRapier();

  useEffect(() => {
    const body = world.getRigidBody(npcRef.current);
    const sensor = world.createCollider(
      RAPIER.ColliderDesc.ball(sensorConfig.radius)
        .setSensor(true)
        .setCollisionGroups(0x00010001) // Custom group filter
    );
    body.addChild(sensor);

    return () => world.removeCollider(sensor);
  }, []);

  return null; // No rendering needed
}