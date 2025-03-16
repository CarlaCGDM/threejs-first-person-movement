import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function GalaxySky() {
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float time;
    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float dist = length(uv);
      float stars = smoothstep(0.99, 1.0, fract(dist * 100.0 + time * 0.1));
      gl_FragColor = vec4(vec3(stars), 1.0);
    }
  `;

  const uniforms = {
    time: { value: 0 },
  };

  useFrame((state) => {
    uniforms.time.value = state.clock.getElapsedTime();
  });

  return (
    <mesh>
      <sphereGeometry args={[500, 32, 32]} /> {/* Large sphere for the sky */}
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
