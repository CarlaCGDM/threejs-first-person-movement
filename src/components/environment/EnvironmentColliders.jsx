import { useGLTF } from "@react-three/drei";
import { RigidBody, TrimeshCollider } from "@react-three/rapier";
import { CF_WORKER_URL } from "../../config";

export function EnvironmentColliders() {
    const { scene } = useGLTF(`${CF_WORKER_URL}CovaBonica_LODs/cb_trimeshcollider.glb`);

    // Log the scene to inspect its structure
    // console.log("GLTF Scene:", scene);

    // Extract the geometry from the mesh
    const geometry = scene.children[0].geometry;

    return (
        <RigidBody type="fixed" name="ground collider" colliders={false} friction={0}>
            <TrimeshCollider args={[geometry.attributes.position.array, geometry.index.array]} />
            {/* Debug wireframe */}
            {/* <mesh geometry={geometry}>
                <meshBasicMaterial color="red" wireframe />
            </mesh> */}
        </RigidBody>
    );
}