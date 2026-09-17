import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface PreviewLineProps {
   p_start: THREE.Vector2;
   p_end: THREE.Vector2;
}

const PreviewLine = (props : PreviewLineProps) => {
    const {p_start, p_end} = props;

    return (
        <Line
            dashed
            points={[p_start, p_end]}
            lineWidth={2}
            color="#888"
            dashScale={10}
        />
    )
}

export default PreviewLine;