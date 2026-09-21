import * as THREE from 'three';
import LineData from './LineData';
import ArcData from './ArcData';

class ConstructionState {
  points: THREE.Vector2[];
  lines: LineData[];
  arcs: ArcData[];

  constructor(points: THREE.Vector2[] = [], lines: LineData[] = [], arcs: ArcData[] = []) {
    this.points = points;
    this.lines = lines;
    this.arcs = arcs;
  }
}

export default ConstructionState;