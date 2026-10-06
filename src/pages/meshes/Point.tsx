import { useState, MouseEvent } from "react";
import * as THREE from 'three';

import { COLORS } from "../constants";

interface PointProps {
  p: THREE.Vector2;
  highlighted: Boolean;
  scale: number;
  onClick: (ev : MouseEvent<HTMLDivElement> ) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

function Point(props : PointProps) {
  const {p, highlighted, scale, onClick, onPointerEnter, onPointerLeave} = props;

  return (
    <group>
        <mesh
            visible={false}
            position={[p.x, p.y, 0]}
            onPointerMove={
              (highlighted) 
                ? () => {}
                : (ev: MouseEvent<HTMLDivElement>) => {
                  ev.stopPropagation();
                  onPointerEnter();
                }
            }
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onClick={onClick}
        >
            <circleGeometry args={[0.018*scale, 12]}/>
            <meshBasicMaterial color={COLORS.DEBUG}/>
        </mesh>
        <mesh position={[p.x, p.y, 0]}>
            <circleGeometry args={[0.01*scale, 10]}/>
            <meshBasicMaterial color={(highlighted) ? COLORS.OBJECT_HIGHLIGHT : 'black'}/>
        </mesh>
    </group>
  )
}

export default Point;