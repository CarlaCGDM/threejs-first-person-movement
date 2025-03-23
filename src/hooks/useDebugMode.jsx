import * as THREE from "three";

/**
 * A hook to handle debug mode visuals for 3D objects.
 * @param {boolean} devMode - Whether debug mode is enabled.
 * @param {THREE.Vector3} size - The size of the object.
 * @param {THREE.Vector3} offset - The teleport position offset.
 * @returns {JSX.Element[]} - An array of debug visuals (bounding box and teleport marker).
 */
export const useDebugMode = (devMode, size, offset) => {
    if (!devMode) return [];

    return [
        // Bounding box for debugging
        <mesh key="bounding-box" position={[0, 0, 0]}>
            <boxGeometry args={[size.x, size.y, size.z]} />
            <meshBasicMaterial color="red" wireframe />
        </mesh>,

        // Teleport position marker for debugging
        <mesh key="teleport-marker" position={offset}>
            <boxGeometry args={[0.25, 0.25, 0.25]} />
            <meshBasicMaterial color="red" />
        </mesh>,
    ];
};