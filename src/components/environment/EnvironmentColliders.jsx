import { useGLTF } from "@react-three/drei";
import { RigidBody, TrimeshCollider } from "@react-three/rapier";

export function Cave() {
    const { scene } = useGLTF("/assets/models/CovaBonica_LODs/cb_trimeshcollider.glb");

    // Log the scene to inspect its structure
    // console.log("GLTF Scene:", scene);

    // Extract the geometry from the mesh
    const geometry = scene.children[0].geometry;

    return (
        <RigidBody type="fixed" colliders={false}>
            <TrimeshCollider args={[geometry.attributes.position.array, geometry.index.array]} />
            {/* Debug wireframe */}
            {/* <mesh geometry={geometry}>
                <meshBasicMaterial color="red" wireframe />
            </mesh> */}
        </RigidBody>
    );
}