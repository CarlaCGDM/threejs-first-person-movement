import { Html } from "@react-three/drei";

/**
 * A component to render a floating name above a 3D object.
 * @param {string} name - The name to display.
 * @param {THREE.Vector3} position - The position of the floating name.
 * @param {React.Ref} occlusionMeshRef - The occlusion mesh reference for hiding the name behind objects.
 * @param {number} distanceFactor - The scaling factor for the HTML overlay.
 * @returns {JSX.Element} - The floating name overlay.
 */
export const FloatingName = ({ name, position, occlusionMeshRef, distanceFactor }) => {
    return (
        <Html
            as="div"
            center
            occlude={[occlusionMeshRef]}
            position={position}
            distanceFactor={distanceFactor}
        >
            <p style={{
                display: "inline-block",  // Ensures it fits the text width
                whiteSpace: "nowrap",  // Prevents word wrapping
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: "5px",
                borderRadius: "5px"
            }}>
                {name}
            </p>
        </Html>
    );
};