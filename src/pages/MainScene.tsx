import { MouseEvent, WheelEvent } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from '@react-three/drei';

import Point from '@/pages/meshes/Point';
import PreviewLine from '@/pages/meshes/PreviewLine';
import { InputMode, SecondaryInputStep, COMPASS, STRAIGHTEDGE, ONE_SEL, READY } from "@/pages/constants";


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
    secondaryInputStep: SecondaryInputStep;
    mouseCoords: number[];

    points: number[][];
    anchorPointIndex: number | null;
    secondaryPointIndex: number | null;
}

const MainScene = (props: MainSceneProps) => {
    const {
        onClick, onPointerDown, onPointerUp, onPointerMove, onScroll, clickPoint,
        scale, aspect, cameraOffsetX, cameraOffsetY, inputMode, secondaryInputStep,
        mouseCoords, points, anchorPointIndex, secondaryPointIndex
    } = props;

    return (
        <Canvas
            onClick={onClick}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onWheel={onScroll}
            style={{cursor: (secondaryInputStep == READY) ? 'crosshair' : 'default'}}
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
    
            {((inputMode == STRAIGHTEDGE || COMPASS) && secondaryInputStep == ONE_SEL && anchorPointIndex != null) 
                ?
                <PreviewLine
                    p_start={points[anchorPointIndex]}
                    p_end={mouseCoords}
                />
                : ((inputMode == STRAIGHTEDGE || COMPASS) && secondaryInputStep == READY && anchorPointIndex != null && secondaryPointIndex != null) 
                    ?
                    <PreviewLine
                        p_start={points[anchorPointIndex]}
                        p_end={points[secondaryPointIndex]}
                    />
                    : null
            }
        </Canvas>
    )
}

export default MainScene;