import { Canvas } from "@react-three/fiber";
import {useRef} from "react";
import { Sky, Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./Ground";
import { Cave } from "./Cave";
import { Player } from "./Player";
import { PropsSetup } from "./setup/PropsSetup";
import { CustomOrbitControls } from "./CustomOrbitControls";
import { useCustomKeyboardControls } from "../hooks/useCustomKeyboardControls";
import { Overlay } from "./UI/Overlay";
import { Stats } from "@react-three/drei";
import propsData from "../data/propsData.json";

export default function Scene() {
    const keys = useCustomKeyboardControls(); // Use custom keyboard controls
    const playerRef = useRef(); // Create a ref for the player's RigidBody
    const orbitControlsRef = useRef();

    //console.log("Player ref in Scene:", playerRef.current); // Debug log

    return (
        <>
            <Canvas
                shadows
                camera={{ fov: 45 }}
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
                <Sky sunPosition={[100, 20, 100]} />
                <Environment preset="forest" />
                <ambientLight intensity={0.3} />
                <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
                <Physics gravity={[0, -30, 0]}>
                    <Cave />
                    <Ground />
                    <Player ref={playerRef} keys={keys} />
                    <PropsSetup props={propsData} />
                </Physics>
                <CustomOrbitControls ref={orbitControlsRef}/> 
            </Canvas>
            <Overlay props={propsData} playerRef={playerRef} orbitControlsRef={orbitControlsRef} /> {/* Add the overlay */}
        </>
    );
}