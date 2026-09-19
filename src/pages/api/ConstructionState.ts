import * as THREE from 'three';
import LineData from './LineData';

class ConstructionState {
  points: THREE.Vector2[];
  lines: LineData[]

  constructor(points: THREE.Vector2[] = [], lines: LineData[] = []) {
    this.points = points
    this.lines = lines;
  }
}

export default ConstructionState;