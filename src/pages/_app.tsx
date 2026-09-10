import Erase from '@/assets/eraser.svg';
import "@/pages/app.css";

import { Canvas } from "@react-three/fiber";
import {useState, useMemo, useEffect, useRef} from 'react';
import {Create, Straighten, Architecture, Undo, Delete} from '@mui/icons-material';
import { SvgIcon } from "@mui/material";

function Point() {
  return (
    <mesh>
      <circleGeometry args={[0.05, 10]}/>
      <meshStandardMaterial color='black'/>
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{position: 'relative', width: '100vw', height: '100vh'}}>
      <Canvas>
        <color attach="background" args={['#e8ddcf']}/>
        <Point/>
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
