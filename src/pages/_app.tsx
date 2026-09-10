import "@/styles/globals.css";
import { Canvas } from "@react-three/fiber";
import {useState, useMemo, useEffect, useRef} from 'react';

export default function App() {
  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Canvas>
        <color attach="background" args={['#e8ddcf']}/>
      </Canvas>
    </div>
  )
}
