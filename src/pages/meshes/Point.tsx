import { useState, MouseEvent } from "react";
import * as THREE from 'three';

interface PointProps {
  p: THREE.Vector2;
  clickPoint: (ev : MouseEvent<HTMLDivElement> ) => void;
}

function Point(props : PointProps) {
  const {p, clickPoint} = props;

  const [highlighted, setHighlighted] = useState(false);

  return (
    <group>
        <mesh
            visible={false}
            position={[p.x, p.y, 1]}
            onPointerEnter={() => setHighlighted(true)}
            onPointerLeave={() => setHighlighted(false)}
            onClick={clickPoint}
        >
            <circleGeometry args={[0.08, 12]}/>
            <meshBasicMaterial color={'#4a82bb'}/>
        </mesh>
        <mesh position={[p.x, p.y, 0]}>
            <circleGeometry args={[0.05, 10]}/>
            <meshBasicMaterial color={(highlighted) ? '#888' : 'black'}/>
        </mesh>
    </group>
  )
}

export default Point;