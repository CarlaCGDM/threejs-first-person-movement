import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Wireframe, Clone } from '@react-three/drei'
import * as THREE from 'three'

function Model({ url }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef()
  
  // Apply wireframe material to all meshes
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({ 
        color: '#cccccc',
        //wireframe: true,
        //transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      })
    }
  })

  // Rotation animation
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001
    }
  })

  return <Clone ref={modelRef} object={scene} />
}

function Model2({ url }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef()
  
  // Apply wireframe material to all meshes
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshBasicMaterial({ 
        color: 'black',
        transparent: true,
        opacity: 0.1,
        wireframe: true
      })
    }
  })

  // Rotation animation
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001
    }
  })

  return <Clone ref={modelRef} object={scene} />
}

function ScannerEffect() {
  const scannerRef = useRef()
  const [direction, setDirection] = useState(1)
  
  useFrame(() => {
    if (scannerRef.current) {
      scannerRef.current.position.y += 0.02 * direction
      
      // Reverse direction at bounds
      if (scannerRef.current.position.y > 5) setDirection(-1)
      if (scannerRef.current.position.y < -5) setDirection(1)
    }
  })

  return (
    <mesh ref={scannerRef} rotation-x={Math.PI / 2}>
      {/* <planeGeometry args={[20, 20]} /> */}
      <meshBasicMaterial color="#ffae5e" transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  )
}

export function WireframeLoader({ modelUrl }) {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
      <ambientLight intensity={0.5} />
      
     
      
      <Model url={modelUrl} />
      <Model2 url={modelUrl} />
      <ScannerEffect />
      
    </Canvas>
  )
}