import { MouseEvent, WheelEvent } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from '@react-three/drei';

import Point from '@/pages/meshes/Point';
import PreviewLine from '@/pages/meshes/PreviewLine';
import { InputMode, COMPASS, STRAIGHTEDGE } from "@/pages/constants";


interface MainSceneProps {
    onClick: (ev: MouseEvent<HTMLDivElement>) => void;
    onPointerDown: (ev: MouseEvent<HTMLDivElement>) => void;
    onPointerUp: () => void;
    onPointerMove: (ev: MouseEvent<HTMLDivElement>) => void;
    onScroll: (ev: WheelEvent<HTMLDivElement>) => void;
    clickPoint: (index: number) => (ev: MouseEvent<HTMLDivElement>) => void;

    scale: number;
    aspect: number;
    cameraOffsetX: number;
    cameraOffsetY: number;

    inputMode: InputMode;
    mouseCoords: number[];

    points: number[][]
    anchorPointIndex: number | null
}

const MainScene = (props: MainSceneProps) => {
    const {
        onClick, onPointerDown, onPointerUp, onPointerMove, onScroll, clickPoint,
        scale, aspect, cameraOffsetX, cameraOffsetY, inputMode, mouseCoords,
        points, anchorPointIndex
    } = props;

    return (
        <Canvas
            onClick={onClick}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onWheel={onScroll}
        >
            <color attach="background" args={['#e8ddcf']}/>
    
            <OrthographicCamera
                makeDefault
                zoom={1/scale}
                position={[cameraOffsetX, cameraOffsetY, 1]}
                left={-aspect}
                right={aspect}
                top={1}
                bottom={-1}
            />
    
            {points.map((p, i) => (
                <Point key={i} x={p[0]} y={p[1]} clickPoint={clickPoint(i)}/>
            ))}
    
            {((inputMode == STRAIGHTEDGE || COMPASS) && anchorPointIndex != null) ?
                <PreviewLine
                    p_start={points[anchorPointIndex]}
                    p_end={mouseCoords}
                />
            : null}
        </Canvas>
    )
}

export default MainScene;