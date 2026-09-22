import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from 'three';

interface PreviewCircleProps {
   center: THREE.Vector2;
   radial: THREE.Vector2;
}

const PreviewCircle = (props: PreviewCircleProps) => {
    const {center, radial} = props;

    const n_segments = 64;

    const radius = useMemo(() => {
        return center.distanceTo(radial);
    }, [center, radial]);

    const angle = useMemo(() => {
        const diff = radial.clone().sub(center);
        return Math.atan2(diff.y, diff.x);
    }, [center, radial]);

    const points = useMemo(() => {
        const result = [];

        for (let i = 0; i < n_segments + 1; i++) {
            const offset = 2*Math.PI*(0.98*i/n_segments + 0.01);
            const x = radius * Math.cos(angle + offset);
            const y = radius * Math.sin(angle + offset);
            const p = new THREE.Vector2(x, y).add(center);

            result.push(p);
        }

        return result;
    }, [center, angle, radius]);

    return (
        <group>
            <Line
                dashed
                points={points}
                lineWidth={2}
                color="#888"
                dashScale={10}
            />
            <mesh position={[radial.x, radial.y, 0]}>
                <circleGeometry args={[0.05, 10]}/>
                <meshBasicMaterial color={'#888'}/>
            </mesh>
            <mesh position={[radial.x, radial.y, 0]}>
                <circleGeometry args={[0.03, 10]}/>
                <meshBasicMaterial color={'#fff'}/>
            </mesh>
        </group>
    )
}

export default PreviewCircle;