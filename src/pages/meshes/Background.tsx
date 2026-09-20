import { MouseEvent } from 'react';
import * as THREE from 'three';

interface BackgroundProps {
    color: string;
    position: [number, number, number];
    clickBackground: (ev: MouseEvent<HTMLDivElement>) => void;
}

const Background = (props: BackgroundProps) => {
    const {color, position, clickBackground} = props;

    return (
        <mesh position={position} onClick={clickBackground}>
            <boxGeometry args={[160, 160, 0]}/>
            <meshBasicMaterial color={color}/>
        </mesh>
    )
}

export default Background;