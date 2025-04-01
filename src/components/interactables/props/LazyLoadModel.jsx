import { useMemo } from "react";
import { useGLTF, Clone } from "@react-three/drei";

// Component to lazy load and display a 3D model
export function LazyLoadModel({ url, size }) {
    // Memoize the URL to prevent unnecessary reloading
    const deferred = useMemo(() => url, [url]);
    const { scene } = useGLTF(deferred);

    // Handle model loading errors
    if (!scene) {
        console.warn("Model failed to load:", { scene });
        return null;  // Prevent rendering until model is available
    }

    return (
        scene && <Clone object={scene} position={[0, -size.y * 0.5, 0]} />
    );
}
