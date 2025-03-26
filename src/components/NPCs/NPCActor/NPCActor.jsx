import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function NPCActor({ 
  path, 
  speed = 0.5,
  rotationSpeed = 2,
  smoothness = 0.5,
  onPathComplete,
  color = 'hotpink',
  debug = true 
}) {
  const groupRef = useRef();
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isPerformingActions, setIsPerformingActions] = useState(false);
  const [currentSegmentProgress, setCurrentSegmentProgress] = useState(0);
  const currentSegmentLengthRef = useRef(0);
  const targetQuaternion = useRef(new THREE.Quaternion());
  const currentDirection = useRef(new THREE.Vector3());
  const smoothPathRef = useRef([]);
  const lookAheadPoints = 5;

  useEffect(() => {
    if (!path || path.length < 2) return;

    const curve = new THREE.CatmullRomCurve3(path, false, 'centripetal', smoothness);
    smoothPathRef.current = curve.getPoints(path.length * 10);
    
    setCurrentPathIndex(0);
    setCurrentSegmentProgress(0);
    setIsMoving(true);
    setIsPerformingActions(false);
    
    if (smoothPathRef.current.length > 1) {
      currentSegmentLengthRef.current = smoothPathRef.current[0].distanceTo(smoothPathRef.current[1]);
      updateRotation();
    }

    return () => {
      // Cleanup if needed
    };
  }, [path, smoothness]);

  const updateRotation = () => {
    if (!smoothPathRef.current || currentPathIndex >= smoothPathRef.current.length - 1) return;
    
    const lookAheadIndex = Math.min(
      currentPathIndex + lookAheadPoints,
      smoothPathRef.current.length - 1
    );
    
    const newDirection = new THREE.Vector3()
      .subVectors(
        smoothPathRef.current[lookAheadIndex],
        smoothPathRef.current[currentPathIndex]
      )
      .normalize();
    
    currentDirection.current.copy(newDirection);
    const targetRotation = Math.atan2(-currentDirection.current.x, -currentDirection.current.z);
    targetQuaternion.current.setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation);
  };

  useFrame((_, delta) => {
    if (isPerformingActions || !isMoving || !smoothPathRef.current) return;

    if (currentPathIndex >= smoothPathRef.current.length - 1) {
      setIsMoving(false);
      setIsPerformingActions(true);
      onPathComplete?.();
      return;
    }

    updateRotation();
    groupRef.current.quaternion.rotateTowards(targetQuaternion.current, rotationSpeed * delta);

    const currentPosition = smoothPathRef.current[currentPathIndex];
    const nextPosition = smoothPathRef.current[currentPathIndex + 1];
    const newProgress = currentSegmentProgress + (speed * delta) / currentSegmentLengthRef.current;
    
    if (newProgress >= 1) {
      const remainingTime = (newProgress - 1) * (currentSegmentLengthRef.current / speed);
      groupRef.current.position.copy(nextPosition);
      
      if (currentPathIndex + 1 < smoothPathRef.current.length - 1) {
        const nextSegmentLength = nextPosition.distanceTo(smoothPathRef.current[currentPathIndex + 2]);
        currentSegmentLengthRef.current = nextSegmentLength;
        setCurrentPathIndex(prev => prev + 1);
        setCurrentSegmentProgress((speed * remainingTime) / nextSegmentLength);
      } else {
        setCurrentPathIndex(prev => prev + 1);
      }
    } else {
      groupRef.current.position.lerpVectors(currentPosition, nextPosition, newProgress);
      setCurrentSegmentProgress(newProgress);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[0.5, 1.6, 0.5]} />
        <meshStandardMaterial color={isPerformingActions ? 'purple' : color} />
      </mesh>

      {debug && (
        <>
          <arrowHelper
            args={[
              new THREE.Vector3(0, 0, -1),
              new THREE.Vector3(0, 1, 0),
              1,
              isPerformingActions ? 0xff00ff : 0xffff00,
              0.2,
              0.1
            ]}
          />
          
          {isPerformingActions && (
            <Html
              position={[0, 2, 0]}
              center
              style={{
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              ACTING
            </Html>
          )}
        </>
      )}
    </group>
  );
}