// src/components/Scene.js
import { useRef, useContext } from "react";
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

export default function Scene() {
  // GPU detection via custom hook
  const { enabled: hwAccelEnabled, loading: gpuLoading } = useHardwareAcceleration();

  // Language settings
  const { language } = useContext(LanguageContext);

  // Refs
  const playerRef = useRef();
  const orbitControlsRef = useRef();

  // Data selection
  const propsData = language === 'ES' ? multilanguagePropsData.ES : multilanguagePropsData.EN;
  const POIsData = language === 'ES' ? multilanguagePOIsData.ES : multilanguagePOIsData.EN;
  const caveData = language === 'ES' ? multilanguageCaveData.ES : multilanguageCaveData.EN;

  // Environment model
  const { modelUrl } = useChunkedModel(`${CF_WORKER_URL}CovaBonica_LODs/LOD_04_Chunks/`);

  if (gpuLoading) return null; // Or <LoadingSpinner />

  return (
    <>
      {hwAccelEnabled && (
        <Content
          playerRef={playerRef}
          orbitControlsRef={orbitControlsRef}
          propsData={propsData}
          POIsData={POIsData}
          environmentUrl={modelUrl}
        />
      )}

      <Overlay
        props={propsData}
        playerRef={playerRef}
        orbitControlsRef={orbitControlsRef}
        caveData={caveData}
      />

      {!hwAccelEnabled && <GraphicsWarning />}
    </>
  );
}