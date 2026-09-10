import { useState, MouseEvent } from "react";

interface PointProps {
  x: number,
  y: number,
  clickPoint: (ev : MouseEvent<HTMLDivElement> ) => void;
}

function Point(props : PointProps) {
  const {x, y, clickPoint} = props;

  const [highlighted, setHighlighted] = useState(false);

  return (
    <group>
        <mesh
            visible={false}
            position={[x, y, 0]}
            onPointerEnter={() => setHighlighted(true)}
            onPointerLeave={() => setHighlighted(false)}
            onClick={clickPoint}
        >
            <circleGeometry args={[0.08, 10]}/>
            <meshBasicMaterial color={'#4a82bb'}/>
        </mesh>
        <mesh position={[x, y, 0]}>
            <circleGeometry args={[0.05, 10]}/>
            <meshBasicMaterial color={(highlighted) ? '#888' : 'black'}/>
        </mesh>
    </group>
  )
}

export default Point;