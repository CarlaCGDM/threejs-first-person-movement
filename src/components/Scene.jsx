import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Sky, Environment, useTexture } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./environment/CaveModel";
import { Cave } from "./EnvironmentColliders";
import { Player } from "./Player";
import { PropsSetup } from "./setup/PropsSetup";
import { CustomOrbitControls } from "./CustomOrbitControls";
import { useCustomKeyboardControls } from "../hooks/useCustomKeyboardControls";
import { Overlay } from "./UI/Overlay";
import { Stats } from "@react-three/drei";
import propsData from "../data/propsData.json";
import { GalaxySky } from "./environment/GalaxySky";

export default function Scene() {
    const keys = useCustomKeyboardControls(); // Use custom keyboard controls
    const playerRef = useRef(); // Create a ref for the player's RigidBody
    const orbitControlsRef = useRef();

    //console.log("Player ref in Scene:", playerRef.current); // Debug log

    function StarrySky() {
        const starTexture = useTexture("/assets/textures/stars_02.jpg"); // Load a starry texture

        // Adjust the texture's repeat property
        starTexture.wrapS = THREE.RepeatWrapping;
        starTexture.wrapT = THREE.RepeatWrapping;
        starTexture.repeat.set(4, 4); // Repeat the texture 4 times along U and V axes

        return (
            <mesh>
                <sphereGeometry args={[500, 32, 32]} /> {/* Large sphere for the sky */}
                <meshBasicMaterial map={starTexture} side={THREE.BackSide} transparent opacity={0.9} /> {/* Apply the texture */}
            </mesh>
        );
    }

    return (
        <>
            <Canvas
                frameloop="always"
                gl={{ antialias: false }}
                vsync="true"
                shadows
                camera={{ fov: 60 }}
                onPointerDown={(e) => {
                    // Ensure the canvas retains focus after mouse interactions
                    e.target.setPointerCapture(e.pointerId);
                    e.target.focus();
                }}
                onContextMenu={(e) => {
                    // Prevent the default context menu
                    e.preventDefault();
                }}
                tabIndex={0} // Make the canvas focusable
                style={{ outline: "none" }} // Remove outline when focused
            >
                <Stats /> {/* Add this to monitor performance */}
                
                <Sky
                    sunPosition={[0, -1, 0]} // Sun below the horizon (nighttime)
                    turbidity={1} // Lower turbidity for a clearer sky
                    rayleigh={0.1} // Lower rayleigh scattering for a darker sky
                    mieCoefficient={0.005} // Lower mie coefficient for less atmospheric haze
                    mieDirectionalG={0.8} // Adjust for a softer glow
                    inclination={0.5} // Adjust the angle of the sky
                    azimuth={0.25} // Adjust the rotation of the sky
                    distance={450000} // Distance to the sky (keep this large)
                />
                <Environment preset="night" />
                <ambientLight intensity={0.3} />
                <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
                <Physics gravity={[0, -30, 0]}>
                    <Cave />
                    <Ground />
                    <Player ref={playerRef} keys={keys} />
                    <PropsSetup props={propsData} />
                </Physics>
                <CustomOrbitControls ref={orbitControlsRef} />
            </Canvas>
            <Overlay props={propsData} playerRef={playerRef} orbitControlsRef={orbitControlsRef} /> {/* Add the overlay */}
        </>
    );
}