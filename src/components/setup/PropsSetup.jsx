import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import Prop from "../Prop";

export function PropsSetup({ props }) {

  // Load the low-poly environment mesh
  const occlusionMesh = useGLTF("/assets/models/CovaBonica_LODs/LOD_00.glb");

  // Ref for the occlusion mesh
  const occlusionMeshRef = useRef();

  return (
    <>
      {props.map((prop, index) => (
        <Prop
          key={index}
          position={prop.position}
          rotation={prop.rotation}
          artifactName={prop.artifactName}
          metadata={prop.metadata}
          modelFile={prop.modelFile}
          detailedModelFile={prop.detailedModelFile}
          teleportRotationAngle={prop.teleportRotationAngle}
          occlusionMeshRef={occlusionMeshRef}
        />
      ))}

      {/* Occlusion mesh */}
      <primitive ref={occlusionMeshRef} object={occlusionMesh.scene} visible={false} />
    </>
  );
}