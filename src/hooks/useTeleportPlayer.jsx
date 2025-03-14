import * as THREE from "three";

export function useTeleportPlayer(playerRef) {
  const teleport = (prop) => {
    console.log("Teleporting to:", prop.name);

    if (!playerRef.current) {
      console.error("Player RigidBody reference is not available.");
      return;
    }

    // Ensure the RigidBody is initialized
    if (!playerRef.current.setTranslation || !playerRef.current.setRotation) {
      console.error("RigidBody methods are not available.");
      return;
    }

    // Log prop data
    console.log("Prop position:", prop.position);
    console.log("Prop size:", prop.size);
    console.log("Prop teleportRotation:", prop.teleportRotation);

    // Calculate the teleport position
    const propPosition = new THREE.Vector3(...prop.position);
    const propSize = prop.size ? new THREE.Vector3(...prop.size) : new THREE.Vector3(1, 1, 1); // Default size if not provided
    const teleportRotation = THREE.MathUtils.degToRad(prop.teleportRotation);

    // Log calculated values
    console.log("Prop position (Vector3):", propPosition);
    console.log("Prop size (Vector3):", propSize);
    console.log("Teleport rotation (radians):", teleportRotation);

    // Calculate the offset based on the teleportRotation
    const offset = new THREE.Vector3(
      Math.sin(teleportRotation) * (propSize.x / 2 + 1.0), // 0.5 meters away
      0,
      Math.cos(teleportRotation) * (propSize.z / 2 + 1.0) // 0.5 meters away
    );

    // Log the offset
    console.log("Offset:", offset);

    // Calculate the new position
    const newPosition = propPosition.clone().add(offset);

    // Log the new position
    console.log("New position:", newPosition);

    // Set the player's new position
    console.log(playerRef)
    playerRef.current.setTranslation(newPosition, true);
    console.log("Player position updated.");

    // Calculate the new rotation (facing the prop)
    const newRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0), // Rotate around the Y-axis
      teleportRotation + Math.PI // Face the prop
    );

    // Log the new rotation
    console.log("New rotation:", newRotation);

    // Set the player's new rotation
    playerRef.current.setRotation(newRotation, true);
    console.log("Player rotation updated.");
  };

  return teleport;
}