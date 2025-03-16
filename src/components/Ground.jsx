import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

export function Ground() {
    //const { scene } = useGLTF('/assets/ground.glb');
    const environment = useGLTF('/assets/models/CovaBonica_LODs/LOD_02.glb');
    const path = useGLTF('/assets/models/CovaBonica_LODs/visible_path.glb');

    return (
        <>
            <primitive object={environment.scene} />
            <primitive object={path.scene} />
        </>
    );
}