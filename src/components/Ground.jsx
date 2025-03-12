import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

export function Ground() {
    const { scene } = useGLTF('/assets/ground.glb');

    return (
        <primitive object={scene} />
    );
}