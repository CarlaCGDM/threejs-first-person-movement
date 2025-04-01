import * as THREE from "three";

/**
 * A hook to calculate a teleport position relative to an object's size and rotation.
 * @param {THREE.Vector3} size - The size of the object.
 * @param {number[]} rotation - The rotation of the object in degrees.
 * @param {number} teleportRotationAngle - The additional rotation angle for the teleport position in degrees.
 * @returns {THREE.Vector3} - The calculated teleport position.
 */
export const useTeleportPosition = (size, rotation, teleportRotationAngle = 0) => {
    // Convert rotation to radians
    const totalRotation = teleportRotationAngle + (rotation ? rotation[1] : 0); // Add original prop rotation
    const teleportRotation = THREE.MathUtils.degToRad(totalRotation);

    // Calculate the offset based on the teleportRotation
    const offset = new THREE.Vector3(
        Math.sin(teleportRotation) * (size.x / 2 + 1.0), // 0.5 meters away
        0,
        Math.cos(teleportRotation) * (size.z / 2 + 1.0) // 0.5 meters away
    );

    return offset;
};