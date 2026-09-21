import * as THREE from 'three'
import { Line } from "@react-three/drei";
import { useMemo } from 'react';

import ArcData from "../api/ArcData";

interface ArcProps {
    arcData: ArcData;
}

const Arc = (props: ArcProps) => {
    const { arcData } = props;
    const { center, radius, startAngle, endAngle } = arcData;

    const points = useMemo(() => {
        const n_segments = 1 + Math.ceil(30 * radius * Math.abs(endAngle - startAngle) / Math.PI);
        const result = [];

        for (let i = 0; i < n_segments; i++) {
            const offset = (endAngle - startAngle) * i / n_segments;
            const x = radius * Math.cos(startAngle + offset);
            const y = radius * Math.sin(startAngle + offset);
            const p = new THREE.Vector2(x, y).add(center);

            result.push(p);
        }

        return result;
    }, [center, radius, startAngle, endAngle]);


    return (
        <Line
            points={points}
            lineWidth={2}
            color="black"
        />
    )
}

export default Arc;