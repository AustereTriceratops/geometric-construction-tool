import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from 'three';

interface PreviewCircleProps {
   center: THREE.Vector2;
   radius: number;
}

const PreviewCircle = (props: PreviewCircleProps) => {
    const {center, radius} = props;

    const n_segments = 30

    const points = useMemo(() => {
        const result = [];

        for (let i = 0; i < n_segments + 1; i++) {
            const angle = 2*Math.PI*i/n_segments
            const x = radius * Math.cos(angle)
            const y = radius * Math.sin(angle)
            const p = new THREE.Vector2(x, y).add(center);

            result.push(p);
        }

        return result;
    }, [center, radius]);

    return (
        <Line
            dashed
            points={points}
            lineWidth={2}
            color="#888"
            dashScale={10}
        />
    )
}

export default PreviewCircle;