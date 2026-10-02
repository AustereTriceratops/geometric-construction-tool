import * as THREE from 'three'
import { Line } from "@react-three/drei";
import { useMemo, MouseEvent } from 'react';

import ArcData from "../api/ArcData";

interface ArcProps {
    arcData: ArcData;

    highlighted: Boolean;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onClick: (ev: MouseEvent<HTMLDivElement>) => void;
}

const Arc = (props: ArcProps) => {
    const { arcData, highlighted, onPointerEnter, onPointerLeave, onClick } = props;
    const { center, radius, startAngle, dTheta } = arcData;

    const points = useMemo(() => {
        const n_segments = 1 + Math.ceil(30 * radius * Math.abs(dTheta) / Math.PI);
        const result = [];

        for (let i = 0; i < n_segments; i++) {
            const offset = dTheta * i / n_segments;
            const x = radius * Math.cos(startAngle + offset);
            const y = radius * Math.sin(startAngle + offset);
            const p = new THREE.Vector2(x, y).add(center);

            result.push(p);
        }

        return result;
    }, [center, radius, startAngle, dTheta]);


    return (
        <group>
            <mesh
                visible={false}
                position={[center.x, center.y, 1]}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onClick={onClick}
            >
                <ringGeometry args={[ // TODO: clean this up
                    radius - 0.05, // inner radius
                    radius + 0.05, // outer radius
                    3 * Math.ceil(radius * Math.abs(dTheta)), // theta segments
                    1, // phi segments
                    Math.min(startAngle, startAngle + dTheta),
                    Math.abs(dTheta)
                ]}/>
                <meshBasicMaterial color={'#4a82bb'}/>
            </mesh>
            <Line
                points={points}
                lineWidth={2}
                color={(highlighted) ? "#888" : "black"}
            />
        </group>
    )
}

export default Arc;