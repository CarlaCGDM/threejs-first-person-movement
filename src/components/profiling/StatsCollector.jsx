// StatsCollector.js
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export function StatsCollector({ onStats }) {
  const { gl } = useThree();

  useEffect(() => {
    if (!gl || !onStats) return;

    const interval = setInterval(() => {
      onStats({
        render: { ...gl.info.render },
        memory: { ...gl.info.memory },
        programs: [...gl.info.programs]
      });
      gl.info.reset();
    }, 1000);

    return () => clearInterval(interval);
  }, [gl, onStats]);

  return null; // This is an invisible component
}