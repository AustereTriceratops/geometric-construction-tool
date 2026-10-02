import { Line, OrthographicCamera } from '@react-three/drei';
import { Canvas } from "@react-three/fiber";
import * as THREE from 'three';
import { MouseEvent, WheelEvent, useMemo } from 'react';

import { PointData, LineData, ArcData} from './api'
import { PreviewLine, PreviewCircle, Point, LineSegment, Arc, Background } from './meshes';
import { InputMode, SecondaryInputStep, COMPASS, STRAIGHTEDGE, ONE_SEL, READY } from "./constants";
import { extrapolateByMidpoint, midpoint } from './api/utils';


interface MainSceneProps {
    onPointerDown: (ev: MouseEvent<HTMLDivElement>) => void;
    onPointerUp: () => void;
    onPointerMove: (ev: MouseEvent<HTMLDivElement>) => void;
    onScroll: (ev: WheelEvent<HTMLDivElement>) => void;
    clickBackground: (ev: MouseEvent<HTMLDivElement>) => void;
    
    scale: number;
    aspect: number;
    cameraOffset: THREE.Vector2;
    
    inputMode: InputMode;
    secondaryInputStep: SecondaryInputStep;
    mouseCoords: THREE.Vector2;
    
    points: PointData[];
    anchorPointIndex: number | null;
    secondaryPoint: PointData | null;
    highlightedPoint: number | null;
    setHighlightedPoint: (index: number | null) => void;
    clickPoint: (index: number) => (ev: MouseEvent<HTMLDivElement>) => void;
    
    lines: LineData[];
    activeLine: LineData | null;
    highlightedLines: number[];
    highlightLine: (index: number) => void;
    unHighlightLine: (index: number) => void;
    clickLine: (index: number) => (ev: MouseEvent<HTMLDivElement>) => void;

    arcs: ArcData[];
    activeArc: ArcData | null;
    highlightedArcs: number[];
    highlightArc: (index: number) => void;
    unHighlightArc: (index: number) => void;
    clickArc: (index: number) => (ev: MouseEvent<HTMLDivElement>) => void;
}

const MainScene = (props: MainSceneProps) => {
    const {
        onPointerDown, onPointerUp, onPointerMove, onScroll, clickPoint, clickLine, clickBackground,
        highlightLine, unHighlightLine, scale, aspect, cameraOffset, inputMode, secondaryInputStep,
        mouseCoords, points, anchorPointIndex, secondaryPoint, activeLine, lines, arcs, activeArc,
        highlightedLines, highlightedPoint, setHighlightedPoint, highlightedArcs, highlightArc,
        unHighlightArc, clickArc
    } = props;

    const mp = useMemo<THREE.Vector2>(() => {
        if (anchorPointIndex != null && secondaryPoint != null) {
            return midpoint(points[anchorPointIndex].point, secondaryPoint.point);
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
            onContextMenu={(ev) => ev.preventDefault()}
            style={{cursor: (secondaryInputStep == READY) ? 'crosshair' : 'default'}}
        >
            <Background
                color='#e9d6bd'
                position={[cameraOffset.x, cameraOffset.x, 0]}
                clickBackground={clickBackground}
            />
            <color attach="background" args={['#000']}/>
    
            <OrthographicCamera
                makeDefault
                zoom={1/scale}
                position={[cameraOffset.x, cameraOffset.y, 10]}
                left={-aspect}
                right={aspect}
                top={1}
                bottom={-1}
            />

            <Line
                dashed
                points={[
                    new THREE.Vector3(-30, -30, 1),
                    new THREE.Vector3(-30, 30, 1),
                    new THREE.Vector3(30, 30, 1),
                    new THREE.Vector3(30, -30, 1),
                    new THREE.Vector3(-30, -30, 1)
                ]}
                lineWidth={5}
                color="#99b8ff"
                dashScale={0.5}
            />

            {lines.map((l, i) => (
                <LineSegment
                    key={i}
                    start={l.start}
                    end={l.end}
                    onClick={clickLine(i)}
                    highlighted={(highlightedLines.includes(i))}
                    onPointerEnter={() => highlightLine(i)}
                    onPointerLeave={() => unHighlightLine(i)}
                />
            ))}
            {arcs.map((a, i) => (
                <Arc
                    key={i}
                    arcData={a}
                    highlighted={(highlightedArcs.includes(i))}

                    onPointerEnter={() => highlightArc(i)}
                    onPointerLeave={() => unHighlightArc(i)}
                    onClick={clickArc(i)}
                />
            ))}
            {points.map((p, i) => (
                <Point
                    key={i}
                    p={p.point}
                    scale={scale}
                    highlighted={highlightedPoint == i}
                    onClick={clickPoint(i)}
                    onPointerEnter={() => setHighlightedPoint(i)}
                    onPointerLeave={() => setHighlightedPoint(null)}
                />
            ))}
    
            {(inputMode == STRAIGHTEDGE && secondaryInputStep == ONE_SEL && anchorPointIndex != null) 
                ?
                <PreviewLine
                    p_start={points[anchorPointIndex].point}
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
                        p_start={extrapolateByMidpoint(points[anchorPointIndex].point, mp, 10)}
                        p_end={extrapolateByMidpoint(secondaryPoint.point, mp, 10)}
                    />
                    : null
            }
            {(inputMode == COMPASS && secondaryInputStep == ONE_SEL && anchorPointIndex != null) 
                ?
                <PreviewCircle
                    center={points[anchorPointIndex].point}
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
                        center={points[anchorPointIndex].point}
                        radial={secondaryPoint.point}
                    />
                    : null
            }

            {(activeLine != null)
                ? <LineSegment
                    start={activeLine.start}
                    end={activeLine.end}
                    highlighted={false}
                    onPointerEnter={() => {}}
                    onPointerLeave={() => {}}
                    onClick={() => {}}
                />
                : null
            }
            {(activeArc != null) 
                ? <Arc
                    arcData={activeArc}
                    highlighted={false}
                    onPointerEnter={() => {}}
                    onPointerLeave={() => {}}
                    onClick={() => {}}
                /> 
                : null}
        </Canvas>
    )
}

export default MainScene;