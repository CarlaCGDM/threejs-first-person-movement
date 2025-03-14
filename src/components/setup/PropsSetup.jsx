import Prop from "../Prop";

export function PropsSetup({ props }) {
  return (
    <>
      {props.map((prop, index) => (
        <Prop
          key={index}
          position={prop.position}
          rotation={prop.rotation}
          name={prop.name}
          description={prop.description}
          modelUrl={prop.modelUrl}
          teleportRotation={prop.teleportRotation}
        />
      ))}
    </>
  );
}