import Prop from "../Prop";

export function PropsSetup({ propsRef }) {
    return (
        <>
            <Prop
                position={[-2, 0, -6]}
                rotation={[0, 0, 0]} // pass deg rotations
                name="medieval cart"
                description="this is a medieval cart"
                modelUrl="/assets/models/medievalCart.glb"
            />
            <Prop
                position={[-2, 0, -9]}
                rotation={[0, 90, 0]}
                name="tabby cat"
                description="this is a tabby cat"
                modelUrl="/assets/models/tabbyCat.glb"
            />
            <Prop
                position={[2, 0, -9]}
                rotation={[0, 0, 0]}
                name="treasure chest"
                description="this is a treasure chest"
                modelUrl="/assets/models/treasureChest.glb"
            />
        </>
    );
}