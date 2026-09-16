import { MouseEvent, WheelEvent, useMemo } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

import Point from '@/pages/meshes/Point';
import PreviewLine from '@/pages/meshes/PreviewLine';
import { InputMode, SecondaryInputStep, COMPASS, STRAIGHTEDGE, ONE_SEL, READY } from "@/pages/constants";
import { extrapolateByMidpoint, midpoint } from './utils';


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
    mouseCoords: THREE.Vector2;

    points: THREE.Vector2[];
    anchorPointIndex: number | null;
    secondaryPointIndex: number | null;
}

const MainScene = (props: MainSceneProps) => {
    const {
        onClick, onPointerDown, onPointerUp, onPointerMove, onScroll, clickPoint,
        scale, aspect, cameraOffsetX, cameraOffsetY, inputMode, secondaryInputStep,
        mouseCoords, points, anchorPointIndex, secondaryPointIndex
    } = props;

    const mp = useMemo<THREE.Vector2>(() => {
        if (anchorPointIndex != null && secondaryPointIndex != null) {
            return midpoint(points[anchorPointIndex], points[secondaryPointIndex]);
        }

        return new THREE.Vector2();
    }, [points, anchorPointIndex, secondaryPointIndex])

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
                <Point key={i} p={p} clickPoint={clickPoint(i)}/>
            ))}
    
            {((inputMode == STRAIGHTEDGE || COMPASS) && secondaryInputStep == ONE_SEL && anchorPointIndex != null) 
                ?
                <PreviewLine
                    p_start={points[anchorPointIndex]}
                    p_end={mouseCoords}
                />
                : (
                    (inputMode == STRAIGHTEDGE || inputMode == COMPASS) &&
                    secondaryInputStep == READY &&
                    anchorPointIndex != null &&
                    secondaryPointIndex != null
                ) 
                    ?
                    <PreviewLine
                        p_start={extrapolateByMidpoint(points[anchorPointIndex], mp, 10)}
                        p_end={extrapolateByMidpoint(points[secondaryPointIndex], mp, 10)}
                    />
                    : null
            }
        </Canvas>
    )
}

export default MainScene;