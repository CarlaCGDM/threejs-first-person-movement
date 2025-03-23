import * as THREE from "three";

/**
 * Converts degrees to radians.
 * @param {number|number[]} degrees - The angle in degrees or an array of angles.
 * @returns {number|number[]} - The angle in radians or an array of angles.
 */
export const degreesToRadians = (degrees) => {
    if (Array.isArray(degrees)) {
        return degrees.map(THREE.MathUtils.degToRad);
    }
    return THREE.MathUtils.degToRad(degrees);
};