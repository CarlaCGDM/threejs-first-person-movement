import * as THREE from 'three';

export function useNPCRotation() {
  const targetQuaternion = new THREE.Quaternion();
  const currentDirection = new THREE.Vector3();

  function updateRotation(smoothPath, currentIndex, lookAheadPoints) {
    if (!smoothPath || currentIndex >= smoothPath.length - 1) return;

    const lookAheadIndex = Math.min(currentIndex + lookAheadPoints, smoothPath.length - 1);
    const newDirection = new THREE.Vector3()
      .subVectors(smoothPath[lookAheadIndex], smoothPath[currentIndex])
      .normalize();

    currentDirection.copy(newDirection);
    const targetRotation = Math.atan2(-currentDirection.x, -currentDirection.z);
    targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetRotation);
  }

  return { targetQuaternion, updateRotation };
}
