import * as THREE from 'three';

interface BackgroundProps {
    color: string;
    position: [number, number];
}

const Background = (props: BackgroundProps) => {
    const {color, position} = props;

    return (
        <mesh position={[position[0], position[1], 0]}>
            <boxGeometry args={[160, 160, 0]}/>
            <meshBasicMaterial color={color}/>
        </mesh>
    )
}

export default Background;