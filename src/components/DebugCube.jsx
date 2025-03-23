import * as THREE from "three";

/**
 * A component to render a debug cube.
 * @param {THREE.Vector3} position - The position of the cube.
 * @param {THREE.Vector3} size - The size of the cube.
 * @param {THREE.Color} [color="red"] - The color of the cube.
 * @param {boolean} [wireframe=true] - Whether to render the cube as a wireframe.
 * @returns {JSX.Element} - The debug cube.
 */
export const DebugCube = ({ position, size, color = "red", wireframe = true }) => {
    return (
        <mesh position={position}>
            <boxGeometry args={[size.x, size.y, size.z]} />
            <meshBasicMaterial color={color} wireframe={wireframe} />
        </mesh>
    );
};