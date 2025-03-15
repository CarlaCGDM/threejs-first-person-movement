import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

export function Ground() {
    //const { scene } = useGLTF('/assets/ground.glb');
    const { scene } = useGLTF('/assets/models/CovaBonica_LODs/LOD_02.glb');

    return (
        <primitive object={scene} />
    );
}