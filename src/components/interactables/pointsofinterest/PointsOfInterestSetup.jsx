import { useGLTF, Clone } from "@react-three/drei";
import { useRef } from "react";
import PointOfInterest from "./PointOfInterest";
import { CF_WORKER_URL } from "../../../config";

export function PointsOfInterestSetup({ POIs }) {

    // Load the low-poly environment mesh
    const occlusionMesh = useGLTF(`${CF_WORKER_URL}CovaBonica_LODs/LOD_00.glb`);

    // Ref for the occlusion mesh
    const occlusionMeshRef = useRef();

    return (
        <>
            {POIs.map((poi, index) => (
                <PointOfInterest
                    key={index}
                    position={poi.position}
                    poiName={poi.poiName}
                    metadata={poi.metadata}
                    modelFile={poi.modelFile}
                    imageFiles={poi.imageFiles}
                    occlusionMeshRef={occlusionMeshRef}
                />
            ))}

            {/* Occlusion mesh */}
            {/* <Clone ref={occlusionMeshRef} object={occlusionMesh.scene} visible={false} /> */}
        </>
    );
}