import { useMemo } from "react";
import { useGLTF, Clone } from "@react-three/drei";

export function LazyLoadModel({ url, size }) {
    const deferred = useMemo(() => url, [url]); // Ensure URL only updates when it changes
    const { scene } = useGLTF(deferred)

    // Ensure models are loaded
    if (!scene) {
        console.warn("Model failed to load:", { scene });
        return null;  // Prevent rendering until models are available
    }

    return (
        <>
            {scene && <Clone object={scene} position={[0, - size.y * 0.5, 0]} />}
        </>
    );
}