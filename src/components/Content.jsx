import { Canvas } from "@react-three/fiber";
import { Stats, useProgress } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./environment/CaveEnvironment";
import { EnvironmentColliders } from "./environment/EnvironmentColliders";
import { Player } from "./player/Player";
import { PropsSetup } from "./interactables/props/PropsSetup";
import { PointsOfInterestSetup } from "./interactables/pointsofinterest/PointsOfInterestSetup";
import { CustomOrbitControls } from "./CustomOrbitControls";
import { useCustomKeyboardControls } from "./player/hooks/useCustomKeyboardControls";
import { SceneWithRoomEnvironment } from "./environment/SceneWithRoomEnvironment";
import { Effects } from "./environment/Effects";
import NPCNavigation from "./NPCs/NPCNavigation/NPCNavigation";
import { useSettings } from "../context/SettingsContext";
import NPCManager from "./NPCs/NPCManager/NPCManager";
import { Suspense, useState, useEffect } from "react";
import { LoadingScreen } from "./UI/loadingScreen/LoadingScreen";
import { ProfilerOverlay } from "./profiling/ProfilerOverlay";
import { StatsCollector } from "./profiling/StatsCollector";
import { CF_WORKER_URL } from "../config";
import MobileControls from "./UI/mobileControls/MobileControls";

export default function Content({ playerRef, orbitControlsRef, propsData, POIsData, environmentUrl }) {
    const { keys, updateKey } = useCustomKeyboardControls(); // Get both keys and updateKey function
    const { settings } = useSettings();

    const [isLoaded, setIsLoaded] = useState(false);
    const { active, progress } = useProgress();

    // Check if everything is loaded
    useEffect(() => {
        if (!active && progress === 100) {
            setIsLoaded(true);
        }
    }, [active, progress]);

    const [stats, setStats] = useState(null);

    useEffect(() => {
        const canvas = document.querySelector("canvas");

        const handleTouchStart = (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const simulatedClick = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    view: window,
                });
                touch.target.dispatchEvent(simulatedClick);
            }
        };

        if (canvas) {
            canvas.addEventListener("touchstart", handleTouchStart);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener("touchstart", handleTouchStart);
            }
        };
    }, []);

    return (
        <>
            <Canvas
                frameloop="always"
                gl={{ antialias: false }}
                vsync="true"
                shadows
                camera={{ fov: 60, near: 0.01, far: 1000 }}
                onPointerDown={(e) => {
                    e.target.setPointerCapture(e.pointerId);
                    e.target.focus();
                }}
                onContextMenu={(e) => e.preventDefault()} // Disable context menu
                tabIndex={0} // Make the canvas focusable
                style={{ outline: "none", height: settings.ui.isFullscreen ? "100vh" : "95vh", position: "fixed", bottom: "0px" }}
            >
                <StatsCollector onStats={setStats} />
                <Suspense fallback={null} >

                    {!import.meta.env.PROD && <Stats />}

                    {/* Scene environment setup */}
                    <SceneWithRoomEnvironment />
                    <ambientLight intensity={0} />
                    {/* Camera controls and post-processing effects */}
                    <CustomOrbitControls ref={orbitControlsRef} />
                    <Effects />

                    {/* NPC Management */}
                    <Suspense fallback={null}>
                        {settings.ui.showNPCs && (
                            <NPCManager>
                                <NPCNavigation
                                    key="leonard"
                                    color="lime"
                                    model={`${CF_WORKER_URL}characters/lewis`}
                                    propsData={propsData}
                                    poisData={POIsData}
                                    playerRef={playerRef}
                                />
                                <NPCNavigation
                                    key="sophie"
                                    color="lime"
                                    model={`${CF_WORKER_URL}characters/sophie`}
                                    propsData={propsData}
                                    poisData={POIsData}
                                    playerRef={playerRef}
                                />
                                <NPCNavigation
                                    key="lewis"
                                    color="lime"
                                    model={`${CF_WORKER_URL}characters/leonard`}
                                    propsData={propsData}
                                    poisData={POIsData}
                                    playerRef={playerRef}
                                />
                            </NPCManager>
                        )}
                    </Suspense>

                    {/* Physics simulation with environment and player */}
                    <Suspense fallback={null}>
                        <Physics gravity={[0, -9.81, 0]}>
                            <EnvironmentColliders />
                            <Ground environmentUrl={environmentUrl} />
                            <Player ref={playerRef} keys={keys} />
                            <PropsSetup props={propsData} />
                            <PointsOfInterestSetup POIs={POIsData} />
                        </Physics>
                    </Suspense>

                </Suspense>
            </Canvas>
            
            {/* Mobile Controls - Only shows on mobile devices */}
            <MobileControls updateKey={updateKey} />
            
            {/* <ProfilerOverlay stats={stats} /> */}
            {(!isLoaded) && <LoadingScreen />}
        </>
    );
}