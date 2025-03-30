import { Html } from "@react-three/drei";

/**
 * A component to render a floating name above a 3D object.
 * @param {string} name - The name to display.
 * @param {THREE.Vector3} position - The position of the floating name.
 * @param {React.Ref} occlusionMeshRef - The occlusion mesh reference for hiding the name behind objects.
 * @param {number} distanceFactor - The scaling factor for the HTML overlay.
 * @returns {JSX.Element} - The floating name overlay.
 */
export const FloatingName = ({ 
    name, 
    playerDistance = Infinity, 
    position, 
    occlusionMeshRef, 
    distanceFactor 
  }) => {
    const isNearby = playerDistance <= 5;
    const showFullText = isNearby || playerDistance === undefined;
  
    return (
      <Html
        zIndex="0"
        as="div"
        center
        occlude={[occlusionMeshRef]}
        position={position}
        distanceFactor={distanceFactor}
        style={{
          transition: 'all 0.3s ease',
          pointerEvents: 'none'
        }}
      >
        <div style={{
          background: '#272626CC',
          color: '#E2E2E2',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '14px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minWidth: '24px', // Ensures consistent size for "?"
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          opacity: isNearby ? 1 : 0.8,
          transform: `scale(${isNearby ? 1 : 0.9})`,
          transition: 'all 0.3s ease'
        }}>
          {showFullText ? name : "?"}
        </div>
      </Html>
    );
  };