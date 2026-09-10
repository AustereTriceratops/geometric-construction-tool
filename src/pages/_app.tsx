import Point from '@/pages/meshes/Point';
import Erase from '@/assets/eraser.svg';
import "@/pages/app.css";

import { Canvas } from "@react-three/fiber";
import { useState, useMemo, useEffect, useRef } from 'react';
import { Create, Straighten, Architecture, Undo, Delete } from '@mui/icons-material';
import { SvgIcon } from "@mui/material";


export default function App() {
  const [points, setPoints] = useState([[1.2, 2], [-2, -0.6]])

  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
      <Canvas>
        <color attach="background" args={['#e8ddcf']}/>

        {points.map((p) => (
          <Point x={p[0]} y={p[1]}/>
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
        <div className='modeButton'>
          <Create fontSize='inherit'/>
        </div>
        <div className='modeButton'>
          <Straighten fontSize='inherit'/>
        </div>
        <div className='modeButton'>
          <Architecture fontSize='inherit'/>
        </div>
        <div className='modeButton'>
          <SvgIcon fontSize='inherit'>
            <Erase/>
          </SvgIcon>
        </div>
        <div className='modeButton'>
          <Undo fontSize='inherit'/>
        </div>
        <div className='modeButton'>
          <Delete fontSize='inherit'/>
        </div>
      </div>
    </div>
  )
}
