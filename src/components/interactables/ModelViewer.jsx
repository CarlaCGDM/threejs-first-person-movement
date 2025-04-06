import { Suspense, useRef, useEffect, useState } from "react";
import { OrbitControls, Html, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { LazyLoadModel } from "./props/LazyLoadModel";

function SmartModel({ url, size, viewerSize}) {
    const groupRef = useRef();
    const [initialScale, setInitialScale] = useState(1);

    useEffect(() => {
        if (!size || viewerSize.width === 0) return;

        const targetScreenHeight = viewerSize.height * 0.7;
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = (targetScreenHeight / viewerSize.height) * 5 / maxDimension;

        setInitialScale(scale);
    }, [size, viewerSize]);

    return (
        <group ref={groupRef} scale={[initialScale, initialScale, initialScale]}>
            <LazyLoadModel url={url} size={size} />
        </group>
    );
}

export function ModelViewer({ 
    modelFiles, 
    size, 
    rotation, 
    showHighestRes, 
    containerStyle,
    debug = false
}) {
    const [viewerSize, setViewerSize] = useState({ width: 0, height: 0 });
    const viewerRef = useRef(null);

    useEffect(() => {
        const updateSize = () => {
            if (viewerRef.current) {
                const rect = viewerRef.current.getBoundingClientRect();
                setViewerSize({
                    width: rect.width,
                    height: rect.height
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const getModelToShow = () => {
        const modelPath = showHighestRes ? "/LOD_04.glb" : "/LOD_02.glb";
        return (
            <Suspense fallback={<Html center><span>Loading...</span></Html>}>
                <SmartModel
                    url={`${modelFiles}${modelPath}`}
                    size={size}
                    viewerSize={viewerSize}
                    debug={debug}
                />
            </Suspense>
        );
    };

    return (
        <div ref={viewerRef} style={containerStyle}>
            <Canvas
                camera={{
                    fov: 45,
                    near: 0.01,
                    far: 1000,
                }}
                style={{ width: '100%', height: '100%' }}
            >
                <ambientLight intensity={4.5} />
                {/* <Environment preset="city" /> */}
                <group rotation={rotation}>
                    {getModelToShow()}
                </group>
                <OrbitControls 
                    enablePan={true} 
                    enableZoom={true} 
                />
                {debug && (
                    <gridHelper args={[10, 10]} />
                )}
            </Canvas>
        </div>
    );
}
