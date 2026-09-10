import Point from '@/pages/meshes/Point';
import "@/pages/app.css";

import Controls from "@/pages/components/Controls";
import { Canvas } from "@react-three/fiber";
import { useState, useMemo, useEffect, useRef, MouseEvent } from 'react';
import { InputMode, DRAW, ERASE } from "@/pages/constants";


export default function App() {
  const [inputMode, setInputMode] = useState<InputMode>(DRAW);


  /// ===== CANVAS =====
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);

  const aspect = useMemo(() => width/height, [width, height]);

  /// ===== POINTS =====
  const [points, setPoints] = useState<number[][]>([[1.2, 2], [-2, -0.6]]);

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
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    // both in [0, 1]
    let x = event.clientX/width;
    let y = event.clientY/height;

    // transform to x in [-aspect, aspect], y in [-1, 1]
    x = aspect*(2*x - 1);
    y = 2*y - 1;

    // transform to scene space
    const scl = 3.82;
    x = scl*x;
    y = -scl*y;

    if (inputMode == DRAW) {
      addPoint(x, y);
    }
  }

  const clickPoint = (index: number) => {
    return (ev: MouseEvent<HTMLDivElement>) => {
      if (inputMode == ERASE) {
        deletePoint(index);
      }
    }
  }

  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
      <Canvas onClick={onClick}>
        <color attach="background" args={['#e8ddcf']}/>

        {points.map((p, i) => (
          <Point key={i} x={p[0]} y={p[1]} clickPoint={clickPoint(i)}/>
        ))}
      </Canvas>

      <Controls
        setInputMode={setInputMode}
        undo={undo}
        clear={clear}
      />
    </div>
  )
}
