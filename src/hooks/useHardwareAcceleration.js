// src/hooks/useHardwareAcceleration.js
import { useState, useEffect } from 'react';
import { getGPUTier } from 'detect-gpu';

export function useHardwareAcceleration() {
  const [gpuState, setGpuState] = useState({
    enabled: true,
    loading: true,
    tier: null,
    gpuInfo: null
  });

  useEffect(() => {
    let mounted = true;

    const checkGPU = async () => {
      try {
        const gpuTier = await getGPUTier({
          failIfMajorPerformanceCaveat: true,
          desktopTiers: [0, 15, 30],
          mobileTiers: [0, 10, 20]
        });

        if (mounted) {
          setGpuState({
            enabled: gpuTier.tier > 0,
            loading: false,
            tier: gpuTier.tier,
            gpuInfo: gpuTier
          });
        }
      } catch (error) {
        console.error('GPU detection error:', error);
        if (mounted) {
          setGpuState({
            enabled: false,
            loading: false,
            tier: 0,
            gpuInfo: null
          });
        }
      }
    };

    checkGPU();

    return () => { mounted = false; };
  }, []);

  return gpuState;
}