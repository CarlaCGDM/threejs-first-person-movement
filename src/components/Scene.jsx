import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./environment/CaveEnvironment";
import { EnvironmentColliders } from "./environment/EnvironmentColliders";
import { Player } from "./player/Player";
import { PropsSetup } from "./interactables/props/PropsSetup";
import { PointsOfInterestSetup } from "./interactables/pointsofinterest/PointsOfInterestSetup";
import { CustomOrbitControls } from "./CustomOrbitControls";
import { useCustomKeyboardControls } from "./player/hooks/useCustomKeyboardControls";
import { Overlay } from "./UI/Overlay";
import propsData from "../data/propsData.json";
import POIsData from "../data/POIsData.json";
import { SceneWithRoomEnvironment } from "./environment/SceneWithRoomEnvironment";
import { Effects } from "./environment/Effects";
import NPCNavigation from "./NPCs/NPCNavigation/NPCNavigation";
import { useSettings } from "../context/SettingsContext";
import NPCManager from "./NPCs/NPCManager/NPCManager";

export default function Scene() {
    // Handle keyboard controls
    const keys = useCustomKeyboardControls();
    
    // References for the player and orbit controls
    const playerRef = useRef();
    const orbitControlsRef = useRef();
    
    // Access settings from context
    const { settings } = useSettings();

    return (
        <>
            <Canvas
                frameloop="always"
                gl={{ antialias: false }}
                vsync="true"
                shadows
                camera={{ fov: 60 }}
                onPointerDown={(e) => {
                    e.target.setPointerCapture(e.pointerId);
                    e.target.focus();
                }}
                onContextMenu={(e) => e.preventDefault()} // Disable context menu
                tabIndex={0} // Make the canvas focusable
                style={{ outline: "none", height: "95vh", position: "fixed", bottom: "0px" }}
            >
                {/* Performance monitoring overlay */}
                <Stats />
                
                {/* Scene environment setup */}
                <SceneWithRoomEnvironment />
                <ambientLight intensity={0} />
                
                {/* NPC Management */}
                {settings.ui.showNPCs && (
                    <NPCManager>
                        <NPCNavigation
                            key="leonard"
                            color="lime"
                            model="/assets/models/characters/leonard.glb"
                            propsData={propsData}
                            poisData={POIsData}
                            playerRef={playerRef}
                        />
                        <NPCNavigation
                            key="sophie"
                            color="lime"
                            model="/assets/models/characters/sophie.glb"
                            propsData={propsData}
                            poisData={POIsData}
                            playerRef={playerRef}
                        />
                        <NPCNavigation
                            key="lewis"
                            color="lime"
                            model="/assets/models/characters/lewis.glb"
                            propsData={propsData}
                            poisData={POIsData}
                            playerRef={playerRef}
                        />
                    </NPCManager>
                )}
                
                {/* Physics simulation with environment and player */}
                <Physics gravity={[0, -9.81, 0]}>
                    <EnvironmentColliders />
                    <Ground />
                    <Player ref={playerRef} keys={keys} />
                    <PropsSetup props={propsData} />
                    <PointsOfInterestSetup POIs={POIsData} />
                </Physics>
                
                {/* Camera controls and post-processing effects */}
                <CustomOrbitControls ref={orbitControlsRef} />
                <Effects />
            </Canvas>
            
            {/* UI overlay for additional controls and information */}
            <Overlay props={propsData} playerRef={playerRef} orbitControlsRef={orbitControlsRef} />
        </>
    );
}
