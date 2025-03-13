import { Canvas } from "@react-three/fiber";
import { Sky, Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./Ground";
import { Level } from "./Level";
import { Player } from "./Player";
import { PropsSetup } from "./setup/PropsSetup";
import { CustomOrbitControls } from "./CustomOrbitControls";
import { useCustomKeyboardControls } from "../hooks/useCustomKeyboardControls";

export default function Scene() {
    const keys = useCustomKeyboardControls(); // Use custom keyboard controls

    return (
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
            <Sky sunPosition={[100, 20, 100]} />
            <Environment preset="forest" />
            <ambientLight intensity={0.3} />
            <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
            <Physics
                gravity={[0, -30, 0]}
                timeStep="vary" // Use a fixed time step for physics updates
            >
                <Level />
                <Ground />
                <Player keys={keys} /> {/* Pass keys to Player */}
                <PropsSetup />
            </Physics>
            <CustomOrbitControls /> {/* Add custom orbit controls here */}
        </Canvas>
    );
}