import { useRef, useContext, useEffect } from "react";
import { Overlay } from "./UI/Overlay";
import Content from "./Content";
import { LanguageContext } from "../context/LanguageContext";
import multilanguagePropsData from "../data/propsData.json";
import multilanguagePOIsData from "../data/POIsData.json";
import multilanguageCaveData from "../data/caveData.json";
import { GraphicsWarning } from "./UI/GraphicsWarning";
import { useHardwareAcceleration } from "../hooks/useHardwareAcceleration";
import { useChunkedModel } from "./environment/hooks/useChunkedModel";
import { CF_WORKER_URL } from "../config";
import { useSettings } from "../context/SettingsContext";
import { useGLTF } from "@react-three/drei";
import { QualityToggle } from "./UI/QualityToggle";

export default function Scene() {
  const { enabled: hwAccelEnabled, loading: gpuLoading } = useHardwareAcceleration();
  const { language } = useContext(LanguageContext);
  const { settings } = useSettings();

  const playerRef = useRef();
  const orbitControlsRef = useRef();

  const propsData = language === 'ES' ? multilanguagePropsData.ES : multilanguagePropsData.EN;
  const POIsData = language === 'ES' ? multilanguagePOIsData.ES : multilanguagePOIsData.EN;
  const caveData = language === 'ES' ? multilanguageCaveData.ES : multilanguageCaveData.EN;

  // Only fetch HD model if setting is on
  const { modelUrl: hdModelUrl, loading: hdLoading } = useChunkedModel(
    `${CF_WORKER_URL}CovaBonica_LODs/LOD_04_Chunks/`,
    settings.showHDEnvironment
  );

  // Preload the GLTF once it exists
  useEffect(() => {
    if (settings.showHDEnvironment && hdModelUrl) {
      useGLTF.preload(hdModelUrl);
    }
  }, [settings.showHDEnvironment, hdModelUrl]);

  const environmentUrl = settings.showHDEnvironment ? hdModelUrl : null;

  if (gpuLoading) return null; // Or <LoadingSpinner />

  return (
    <>
      {hwAccelEnabled && (
        <Content
          playerRef={playerRef}
          orbitControlsRef={orbitControlsRef}
          propsData={propsData}
          POIsData={POIsData}
          environmentUrl={environmentUrl}
        />
      )}

      <Overlay
        props={propsData}
        playerRef={playerRef}
        orbitControlsRef={orbitControlsRef}
        caveData={caveData}
      />

      {/* {!settings.ui.showTutorial && < QualityToggle isHDReady={environmentUrl ? true : false}/>} */}

      {!hwAccelEnabled && <GraphicsWarning />}
    </>
  );
}
