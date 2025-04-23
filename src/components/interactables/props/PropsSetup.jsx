import { useGLTF, Clone } from "@react-three/drei";
import { useRef } from "react";
import Prop from "./Prop";
import { CF_WORKER_URL } from "../../../config";

export function PropsSetup({ props }) {

  // Load the low-poly environment mesh
  const occlusionMesh = useGLTF(`${CF_WORKER_URL}CovaBonica_LODs/LOD_00.glb`);

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
          commonName={prop.commonName}
          infoViewRotation={prop.infoViewRotation}
          metadata={prop.metadata}
          modelFile={prop.modelFile}
          detailedModelFile={prop.detailedModelFile}
          iconFolder={prop.iconFolder}
          teleportRotationAngle={prop.teleportRotationAngle}
          imageFiles={prop.imageFiles}
          occlusionMeshRef={occlusionMeshRef}
        />
      ))}

      {/* Occlusion mesh */}
      {/* <Clone ref={occlusionMeshRef} object={occlusionMesh.scene} visible={false} /> */}
    </>
  );
}