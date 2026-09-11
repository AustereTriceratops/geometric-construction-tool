import Point from '@/pages/meshes/Point';
import Controls from "@/pages/components/Controls";
import "@/pages/app.css";

import { Canvas } from "@react-three/fiber";
import { useState, useMemo, useEffect, useRef, MouseEvent } from 'react';
import { InputMode, DRAW, ERASE, COMPASS, STRAIGHTEDGE } from "@/pages/constants";

const NO_SEL = 'no_sel';
const ONE_SEL = 'one_sel';
const READY = 'ready';
type SecondaryInputStep = 'no_sel' | 'one_sel' | 'ready';

export default function App() {
  const [inputMode, setInputMode] = useState<InputMode>(DRAW);

  const [secondaryInputStep, setSecondaryInputStep] = useState<SecondaryInputStep>(NO_SEL);
  const [anchorPointIndex, setAnchorPointIndex] = useState<number | null>(null);
  const [secondaryPointIndex, setSecondaryPointIndex] = useState<number | null>(null);

  const resetSecondaryInputStep = () => {
    setSecondaryInputStep(NO_SEL);
    setAnchorPointIndex(null);
    setSecondaryPointIndex(null);
  }

  const updateInputMode = (newMode: InputMode) => {
    // if we switch from straightedge to comapss or vice-versa
    // then we'd like to keep our selected points
    if (!(
      (inputMode == STRAIGHTEDGE || inputMode == COMPASS) &&
      (newMode == STRAIGHTEDGE || newMode == COMPASS)
    )) {
      console.log('resetting secondary input')
      resetSecondaryInputStep();
    }

    setInputMode(newMode);
  }

  /// ===== CANVAS =====
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);

  const aspect = useMemo(() => width/height, [width, height]);

  /// ===== CAMERA =====
  const [scale, setScale] = useState(5);

  /// ===== POINTS =====
  const [points, setPoints] = useState<number[][]>([[0, 0], [1.2, 2], [-2, -0.6]]);

   const addPoint = (x: number, y: number) => {
    const newPoint = [x, y];
    const newPoints = points.concat([newPoint]);
    const newHistory = history.concat([newPoints]);

    setPoints(newPoints);
    setHistory(newHistory);
  }

  const deletePoint = (index: number) => {
    const newPoints = points.filter((p, i) => i != index);

    setPoints(newPoints);
    setHistory(history.concat([newPoints]));
  }
  

  /// ===== HISTORY =====
  const [history, setHistory] = useState<number[][][]>([points]);
  
  const undo = () => {
    const len = history.length;
    if (len <= 1) return;

    const lastState = history[len - 2];

    setPoints(lastState);
    setHistory(history.slice(0, len - 1));
  }

  const clear = () => {
    setPoints([[]]);
    setHistory(history.concat([[[]]]));
  }


  /// ===== EVENTS =====
const [dragging, setDragging] = useState(false);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    // both in [0, 1]
    let x = event.clientX/width;
    let y = event.clientY/height;

    // transform to x in [-aspect, aspect], y in [-1, 1]
    x = aspect*(2*x - 1);
    y = 2*y - 1;

    // transform to scene space
    x = scale * x;
    y = -scale * y;

    if (inputMode == DRAW) {
      addPoint(x, y);
    }
  }

  const clickPoint = (index: number) => {
    return (ev: MouseEvent<HTMLDivElement>) => {
      if (inputMode == ERASE) {
        deletePoint(index);
      } else if (inputMode == STRAIGHTEDGE || inputMode == COMPASS) {
        if (secondaryInputStep == NO_SEL) {
          setAnchorPointIndex(index);
          setSecondaryInputStep(ONE_SEL);
          console.log('selected first point', index)
        } else if (secondaryInputStep == ONE_SEL) {
          setSecondaryPointIndex(index);
          setSecondaryInputStep(READY);
          console.log('selected second point', index)
        }
      }
    }
  }

  const onPointerDown = () => {
    setDragging(true);
  }

  const onPointerUp = () => {
    setDragging(false);
  }

  const onPointerMove = () => {
    if (dragging) {
      if (
        (inputMode == STRAIGHTEDGE || inputMode == COMPASS) &&
        secondaryInputStep == READY
      ) {
        console.log('drawing');
      } else {
        console.log('dragging');
      }
    }
  }

  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
      <Canvas
        orthographic
        camera={{zoom: 1/scale, position: [0, 0, 1], left: -aspect, right: aspect, top: 1, bottom: -1}}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
      >
        <color attach="background" args={['#e8ddcf']}/>
        {points.map((p, i) => (
          <Point key={i} x={p[0]} y={p[1]} clickPoint={clickPoint(i)}/>
        ))}
      </Canvas>

      <Controls
        setInputMode={updateInputMode}
        undo={undo}
        clear={clear}
      />
    </div>
  )
}
