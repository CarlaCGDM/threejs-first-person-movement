import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./environment/CaveEnvironment";
import { EnvironmentColliders } from "./environment/EnvironmentColliders";
import { Player } from "./player/Player";
import { PropsSetup } from "./interactables/props/PropsSetup";
import { PointsOfInterestSetup } from "./interactables/pointsofinterest/PointsOfInterestSetup";
import { CustomOrbitControls } from "./CustomOrbitControls";
import { useCustomKeyboardControls } from "./player/hooks/useCustomKeyboardControls";
import propsData from "../data/propsData.json";
import POIsData from "../data/POIsData.json";
import { SceneWithRoomEnvironment } from "./environment/SceneWithRoomEnvironment";
import { Effects } from "./environment/Effects";
import NPCNavigation from "./NPCs/NPCNavigation/NPCNavigation";
import { useSettings } from "../context/SettingsContext";
import NPCManager from "./NPCs/NPCManager/NPCManager";
import { Suspense } from "react";
import { LoadingScreen } from "./LoadingScreen";

export default function Content({ playerRef, orbitControlsRef }) {
    const keys = useCustomKeyboardControls();
    const { settings } = useSettings();

    return (
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
            <Suspense fallback={<LoadingScreen />} >
                {/* Performance monitoring overlay */}
                <Stats />

                {/* Scene environment setup */}
                <SceneWithRoomEnvironment />
                <ambientLight intensity={0} />



                {/* NPC Management */}
                {settings.ui.showNPCs && (
                    <NPCManager>
                        {/* <NPCNavigation
                            key="leonard"
                            color="lime"
                            model="/assets/models/characters/leonard.glb"
                            propsData={propsData}
                            poisData={POIsData}
                            playerRef={playerRef}
                        /> */}
                        <NPCNavigation
                            key="sophie"
                            color="lime"
                            model="/assets/models/characters/sophie"
                            propsData={propsData}
                            poisData={POIsData}
                            playerRef={playerRef}
                        />
                        {/* <NPCNavigation
                            key="lewis"
                            color="lime"
                            model="/assets/models/characters/lewis.glb"
                            propsData={propsData}
                            poisData={POIsData}
                            playerRef={playerRef}
                        /> */}
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
            </Suspense>
        </Canvas>
    );
}
