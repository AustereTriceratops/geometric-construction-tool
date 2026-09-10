import Point from '@/pages/meshes/Point';
import Erase from '@/assets/eraser.svg';
import "@/pages/app.css";

import { Canvas } from "@react-three/fiber";
import { useState, useMemo, useEffect, useRef } from 'react';
import { Create, Straighten, Architecture, Undo, Delete } from '@mui/icons-material';
import { SvgIcon } from "@mui/material";

const DRAW = 'draw';
const STRAIGHTEDGE = 'straightedge';
const COMPASS = 'compass';
const ERASE = 'erase';
type InputMode = 'draw' | 'straightedge' | 'compass' | 'erase';

export default function App() {
  const [inputMode, setInputMode] = useState<InputMode>(DRAW);

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
  
  const [history, setHistory] = useState<number[][][]>([]);
  
  const undo = () => {
    const len = history.length;
    if (len == 0) return;

    const lastState = history[len - 1];

    setPoints(lastState);
    setHistory(history.slice(0, len - 1));
  }

  const clear = () => {
    setPoints([[]]);
    setHistory(history.concat([[[]]]));
  }

  console.log(points)

  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
      <Canvas>
        <color attach="background" args={['#e8ddcf']}/>

        {points.map((p, i) => (
          <Point key={i} x={p[0]} y={p[1]}/>
        ))}
      </Canvas>

      <div style={{
        position: 'absolute',
        display: 'inline-flex',
        flexDirection: 'column',
        width: '48px',
        top: '5rem',
        left: '2rem',
        gap: '1rem'
      }}>
        <div className='modeButton' onClick={() => setInputMode(DRAW)}>
          <Create fontSize='inherit'/>
        </div>
        <div className='modeButton' onClick={() => setInputMode(STRAIGHTEDGE)}>
          <Straighten fontSize='inherit'/>
        </div>
        <div className='modeButton' onClick={() => setInputMode(COMPASS)}>
          <Architecture fontSize='inherit'/>
        </div>
        <div className='modeButton' onClick={() => setInputMode(ERASE)}>
          <SvgIcon fontSize='inherit'>
            <Erase/>
          </SvgIcon>
        </div>
        <div className='modeButton'>
          <Undo fontSize='inherit' onClick={() => undo()}/>
        </div>
        <div className='modeButton' onClick={() => clear()}>
          <Delete fontSize='inherit'/>
        </div>
      </div>
    </div>
  )
}
