import { Line } from '@react-three/drei';
import * as THREE from 'three';

import { COLORS } from '../constants';

interface PreviewLineProps {
   p_start: THREE.Vector2;
   p_end: THREE.Vector2;
}

const PreviewLine = (props : PreviewLineProps) => {
    const {p_start, p_end} = props;

    return (
        <group>
            <Line
                dashed
                points={[p_start, p_end]}
                lineWidth={2}
                color={COLORS.OBJECT_HIGHLIGHT}
                dashScale={10}
            />
            <mesh position={[p_end.x, p_end.y, 0]}>
                <circleGeometry args={[0.05, 10]}/>
                <meshBasicMaterial color={COLORS.OBJECT_HIGHLIGHT}/>
            </mesh>
            <mesh position={[p_end.x, p_end.y, 0]}>
                <circleGeometry args={[0.03, 10]}/>
                <meshBasicMaterial color={'white'}/>
            </mesh>
        </group>
    )
}

export default PreviewLine;