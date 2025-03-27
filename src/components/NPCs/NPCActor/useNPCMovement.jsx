import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNPCRotation } from './useNPCRotation';

export function useNPCMovement({ path, speed, rotationSpeed, smoothness, lookAheadPoints, onReachEnd }) {
  const groupRef = useRef();
  const smoothPathRef = useRef([]);
  const currentIndexRef = useRef(0);
  const progressRef = useRef(0);
  const segmentLengthRef = useRef(0);
  const isMovingRef = useRef(false);

  const { targetQuaternion, updateRotation } = useNPCRotation();

  useEffect(() => {
    if (!path || path.length < 2) return;

    const curve = new THREE.CatmullRomCurve3(path, false, 'centripetal', smoothness);
    smoothPathRef.current = curve.getPoints(path.length * 10);
    currentIndexRef.current = 0;
    progressRef.current = 0;
    isMovingRef.current = true;

    if (smoothPathRef.current.length > 1) {
      segmentLengthRef.current = smoothPathRef.current[0].distanceTo(smoothPathRef.current[1]);
      updateRotation(smoothPathRef.current, 0, lookAheadPoints);
    }
  }, [path, smoothness, lookAheadPoints]);

  useFrame((_, delta) => {
    if (!isMovingRef.current || !smoothPathRef.current.length) return;

    if (currentIndexRef.current >= smoothPathRef.current.length - 1) {
      isMovingRef.current = false;
      onReachEnd?.();
      return;
    }

    updateRotation(smoothPathRef.current, currentIndexRef.current, lookAheadPoints);
    groupRef.current.quaternion.rotateTowards(targetQuaternion, rotationSpeed * delta);

    const currentPos = smoothPathRef.current[currentIndexRef.current];
    const nextPos = smoothPathRef.current[currentIndexRef.current + 1];
    progressRef.current += (speed * delta) / segmentLengthRef.current;

    if (progressRef.current >= 1) {
      const remaining = (progressRef.current - 1) * (segmentLengthRef.current / speed);
      groupRef.current.position.copy(nextPos);

      if (currentIndexRef.current + 1 < smoothPathRef.current.length - 1) {
        segmentLengthRef.current = nextPos.distanceTo(smoothPathRef.current[currentIndexRef.current + 2]);
        currentIndexRef.current++;
        progressRef.current = (speed * remaining) / segmentLengthRef.current;
      } else {
        currentIndexRef.current++;
      }
    } else {
      groupRef.current.position.lerpVectors(currentPos, nextPos, progressRef.current);
    }
  });

  return { groupRef, isMoving: isMovingRef.current };
}