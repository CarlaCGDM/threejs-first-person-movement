import Prop from "../Prop";

export function PropsSetup({ props }) {
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
        />
      ))}
    </>
  );
}