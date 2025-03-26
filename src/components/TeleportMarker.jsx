import * as THREE from "three";

/**
 * A component to render a teleport position marker.
 * @param {THREE.Vector3} position - The position of the marker.
 * @param {THREE.Color} [color="red"] - The color of the marker.
 * @returns {JSX.Element} - The teleport marker.
 */
export const TeleportMarker = ({ position, color = "red" }) => {
    return (
        <mesh position={position}>
            <boxGeometry args={[0.25, 0.25, 0.25]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );
};