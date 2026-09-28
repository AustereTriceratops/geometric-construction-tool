import { useMemo, useState } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

import { midpoint } from '../api/utils';

interface LineSegmentProps {
    start: THREE.Vector2;
    end: THREE.Vector2;
}

const LineSegment = (props: LineSegmentProps) => {
    const {start, end} = props;

    const [highlighted, setHighlighted] = useState(false);

    const mp = useMemo(() => {
        return midpoint(start, end);
    }, [start, end]);

    const len = useMemo(() => {
        return start.distanceTo(end);
    }, [start, end]);

    const angle = useMemo(() => {
        const d = end.clone().sub(start);
        const angle = Math.atan2(d.y, d.x);

        return new THREE.Euler(0, 0, angle);
    }, [start, end])

    return (
        <group>
            <mesh
                visible={false}
                position={[mp.x, mp.y, 1]}
                rotation={angle}
                onPointerEnter={() => setHighlighted(true)}
                onPointerLeave={() => setHighlighted(false)}
                onClick={(ev) => {
                    ev.stopPropagation();
                    console.log(mp);
                }}
            >
                <planeGeometry args={[len, 0.1]}/>
                <meshBasicMaterial color={'#4a82bb'}/>
            </mesh>
            <Line
                points={[start, end]}
                lineWidth={2}
                color={(highlighted) ? "#888" : "#666"}
            />

        </group>
    )
}

export default LineSegment;