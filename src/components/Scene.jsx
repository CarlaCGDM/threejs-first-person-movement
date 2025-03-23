import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./caveEnvironment/CaveEnvironment";
import { Cave } from "./caveEnvironment/EnvironmentColliders";
import { Player } from "./Player";
import { PropsSetup } from "./props/PropsSetup";
import { PointsOfInterestSetup } from "./pois/PointsOfInterestSetup";
import { CustomOrbitControls } from "./CustomOrbitControls";
import { useCustomKeyboardControls } from "../hooks/useCustomKeyboardControls";
import { Overlay } from "./UI/Overlay";
import { Stats } from "@react-three/drei";
import propsData from "../data/propsData.json";
import POIsData from "../data/POIsData.json";
import { SceneWithRoomEnvironment } from "./caveEnvironment/SceneWithRoomEnvironment";

export default function Scene() {
    const keys = useCustomKeyboardControls(); // Use custom keyboard controls
    const playerRef = useRef(); // Create a ref for the player's RigidBody
    const orbitControlsRef = useRef();

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

                < SceneWithRoomEnvironment />

                <ambientLight intensity={2.0} />
                {/* <pointLight intensity={100} position={[0,0,0]} /> */}

                <Physics gravity={[0, -30, 0]}>
                    <Cave />
                    <Ground />
                    <Player ref={playerRef} keys={keys} />
                    <PropsSetup props={propsData} />
                    <PointsOfInterestSetup POIs={POIsData} />
                </Physics>
                <CustomOrbitControls ref={orbitControlsRef} />
            </Canvas>
            <Overlay props={propsData} playerRef={playerRef} orbitControlsRef={orbitControlsRef} /> {/* Add the overlay */}
        </>
    );
}