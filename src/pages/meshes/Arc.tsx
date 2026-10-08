import * as THREE from 'three'
import { Line } from "@react-three/drei";
import { useMemo, MouseEvent } from 'react';

import ArcData from "../api/ArcData";
import { COLORS } from '../constants';

interface ArcProps {
    arcData: ArcData;
    highlighted: Boolean;
    scale: number;

    onPointerEnter: () => void;
    onPointerLeave: () => void;
    onClick: (ev: MouseEvent<HTMLDivElement>) => void;
}

const Arc = (props: ArcProps) => {
    const { arcData, highlighted, scale, onPointerEnter, onPointerLeave, onClick } = props;
    const { center, radius, startAngle, span } = arcData;

    const points = useMemo(() => {
        const n_segments = 1 + Math.ceil(30 * radius * Math.abs(span) / Math.PI);
        const result = [];

        for (let i = 0; i < n_segments; i++) {
            const offset = span * i / n_segments;
            const x = radius * Math.cos(startAngle + offset);
            const y = radius * Math.sin(startAngle + offset);
            const p = new THREE.Vector2(x, y).add(center);

            result.push(p);
        }

        return result;
    }, [center, radius, startAngle, span]);


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
                    radius - 0.02*scale, // inner radius
                    radius + 0.02*scale, // outer radius
                    3 * Math.ceil(radius * Math.abs(span)), // theta segments
                    1, // phi segments
                    Math.min(startAngle, startAngle + span),
                    Math.abs(span)
                ]}/>
                <meshBasicMaterial color={COLORS.DEBUG}/>
            </mesh>
            <Line
                points={points}
                lineWidth={2}
                color={(highlighted) ? COLORS.OBJECT_HIGHLIGHT : "black"}
            />
        </group>
    )
}

export default Arc;