import { useEffect } from "react";

export const usePlayerCamera = (groupRef, camera) => {
    useEffect(() => {
        if (groupRef.current) {
            camera.position.set(0, 0.65, 0); // Adjust camera height relative to the player
            groupRef.current.add(camera);
        }

        // Cleanup: Detach the camera when the component unmounts
        return () => {
            if (groupRef.current) {
                groupRef.current.remove(camera);
            }
        };
    }, [camera, groupRef]);
};