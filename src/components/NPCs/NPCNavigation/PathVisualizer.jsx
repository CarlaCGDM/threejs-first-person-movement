import * as THREE from 'three';
import { useMemo } from 'react';

export function PathVisualizer({
    path,
    color = 'yellow',
    nodeSize = 0.05,
    showRawPath = true,
    showSmoothedPath = true,
    smoothness = 0.5
}) {
    const smoothedPath = useMemo(() => {
        if (!path || path.length < 2 || !showSmoothedPath) return null;
        const curve = new THREE.CatmullRomCurve3(path, false, 'centripetal', smoothness);
        return curve.getPoints(path.length * 10);
    }, [path, showSmoothedPath, smoothness]);

    if (!path || path.length < 2) return null;

    return (
        <group>
            {/* Raw Path Visualization */}
            {showRawPath && (
                <>
                    {path.map((point, index) => (
                        <mesh key={`node-${index}`} position={[point.x, point.y + 0.1, point.z]}>
                            <sphereGeometry args={[nodeSize, 16, 16]} />
                            <meshBasicMaterial
                                color={index === 0 ? 'lime' : index === path.length - 1 ? 'hotpink' : color}
                            />
                        </mesh>
                    ))}

                    <line>
                        <bufferGeometry attach="geometry">
                            <bufferAttribute
                                attach="attributes-position"
                                array={new Float32Array(path.flatMap(p => [p.x, p.y + 0.1, p.z]))}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial attach="material" color={color} linewidth={2} />
                    </line>
                </>
            )}

            {/* Smoothed Path Visualization */}
            {showSmoothedPath && smoothedPath && (
                <line>
                    <bufferGeometry
                        attach="geometry"
                        {...{
                            attributes: {
                                position: new THREE.BufferAttribute(
                                    new Float32Array(smoothedPath.flatMap(p => [p.x, p.y + 0.1, p.z])),
                                    3
                                )
                            }
                        }}
                    />
                    <lineBasicMaterial attach="material" color="lime" linewidth={2} />
                </line>
            )}
        </group>
    );
}