import { Line, OrthographicCamera } from '@react-three/drei';
import { Canvas } from "@react-three/fiber";
import * as THREE from 'three';
import { MouseEvent, WheelEvent, useMemo } from 'react';

import Point from '@/pages/meshes/Point';
import PreviewLine from '@/pages/meshes/PreviewLine';
import PreviewCircle from '@/pages/meshes/PreviewCircle';
import Arc from '@/pages/meshes/Arc';
import { InputMode, SecondaryInputStep, COMPASS, STRAIGHTEDGE, ONE_SEL, READY } from "@/pages/constants";
import { extrapolateByMidpoint, midpoint } from './utils';
import LineData from './api/LineData';
import ArcData from './api/ArcData';
import Background from './meshes/Background';


interface MainSceneProps {
    onPointerDown: (ev: MouseEvent<HTMLDivElement>) => void;
    onPointerUp: () => void;
    onPointerMove: (ev: MouseEvent<HTMLDivElement>) => void;
    onScroll: (ev: WheelEvent<HTMLDivElement>) => void;
    clickPoint: (index: number) => (ev: MouseEvent<HTMLDivElement>) => void;
    clickBackground: (ev: MouseEvent<HTMLDivElement>) => void;

    scale: number;
    aspect: number;
    cameraOffsetX: number;
    cameraOffsetY: number;

    inputMode: InputMode;
    secondaryInputStep: SecondaryInputStep;
    mouseCoords: THREE.Vector2;

    points: THREE.Vector2[];
    anchorPointIndex: number | null;
    secondaryPoint: THREE.Vector2 | null;

    lines: LineData[];
    activeLine: LineData | null;
    arcs: ArcData[];
    activeArc: ArcData | null;
}

const MainScene = (props: MainSceneProps) => {
    const {
        onPointerDown, onPointerUp, onPointerMove, onScroll, clickPoint, clickBackground,
        scale, aspect, cameraOffsetX, cameraOffsetY, inputMode, secondaryInputStep,
        mouseCoords, points, anchorPointIndex, secondaryPoint, activeLine, lines, arcs, activeArc
    } = props;

    const mp = useMemo<THREE.Vector2>(() => {
        if (anchorPointIndex != null && secondaryPoint != null) {
            return midpoint(points[anchorPointIndex], secondaryPoint);
        }

        return new THREE.Vector2();
    }, [points, anchorPointIndex, secondaryPoint]);

    // TODO: the preview line/circle logic needs some cleanup
    return (
        <Canvas
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerMove={onPointerMove}
            onWheel={onScroll}
            style={{cursor: (secondaryInputStep == READY) ? 'crosshair' : 'default'}}
        >
            <Background
                color='#e9d6bd'
                position={[cameraOffsetX, cameraOffsetY, 0]}
                clickBackground={clickBackground}
            />
            <color attach="background" args={['#000']}/>
    
            <OrthographicCamera
                makeDefault
                zoom={1/scale}
                position={[cameraOffsetX, cameraOffsetY, 10]}
                left={-aspect}
                right={aspect}
                top={1}
                bottom={-1}
            />

            <Line
                dashed
                points={[
                    new THREE.Vector3(-30, -30, 1), new THREE.Vector3(-30, 30, 1), new THREE.Vector3(30, 30, 1),
                    new THREE.Vector3(30, -30, 1), new THREE.Vector3(-30, -30, 1)
                ]}
                lineWidth={5}
                color="#99b8ff"
                dashScale={0.5}
            />

            {lines.map((l, i) => (
                <Line
                    key={i}
                    points={[l.start, l.end]}
                    lineWidth={2}
                    color="black"
                />
            ))}
            {arcs.map((a, i) => (
                <Arc
                    key={i}
                    arcData={a}
                />
            ))}
            {points.map((p, i) => (
                <Point key={i} p={p} clickPoint={clickPoint(i)}/>
            ))}
    
            {(inputMode == STRAIGHTEDGE && secondaryInputStep == ONE_SEL && anchorPointIndex != null) 
                ?
                <PreviewLine
                    p_start={points[anchorPointIndex]}
                    p_end={mouseCoords}
                />
                : (
                    inputMode == STRAIGHTEDGE &&
                    secondaryInputStep == READY &&
                    anchorPointIndex != null &&
                    secondaryPoint != null
                ) 
                    ?
                    <PreviewLine
                        p_start={extrapolateByMidpoint(points[anchorPointIndex], mp, 10)}
                        p_end={extrapolateByMidpoint(secondaryPoint, mp, 10)}
                    />
                    : null
            }
            {(inputMode == COMPASS && secondaryInputStep == ONE_SEL && anchorPointIndex != null) 
                ?
                <PreviewCircle
                    center={points[anchorPointIndex]}
                    radial={mouseCoords}
                />
                : (
                    inputMode == COMPASS &&
                    secondaryInputStep == READY &&
                    anchorPointIndex != null &&
                    secondaryPoint != null
                ) 
                    ?
                    <PreviewCircle
                        center={points[anchorPointIndex]}
                        radial={secondaryPoint}
                    />
                    : null
            }

            {(activeLine != null)
                ?
                <Line
                    points={[activeLine.start, activeLine.end]}
                    lineWidth={2}
                    color="#666"
                />
                :
                null
            } 
        </Canvas>
    )
}

export default MainScene;