interface PointProps {
  x: number,
  y: number
}

function Point(props : PointProps) {
  const {x, y} = props;

  return (
    <mesh position={[x, y, 0]}>
      <circleGeometry args={[0.05, 10]}/>
      <meshStandardMaterial color='black'/>
    </mesh>
  )
}

export default Point;