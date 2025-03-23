import { useFrame } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";

export const usePlayerPhysics = (ref, groupRef) => {
    const { world } = useRapier(); // Access the Rapier physics world

    useFrame(() => {
        // Update the group's position to match the RigidBody's position
        const { x, y, z } = ref.current.translation();
        groupRef.current.position.set(x, y, z);

        // Step the physics world to ensure updates are synchronized
        world.step();
    });
};