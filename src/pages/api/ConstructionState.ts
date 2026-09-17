import * as THREE from 'three';

class ConstructionState {
  points: THREE.Vector2[];
  lines: THREE.Vector2[][]

  constructor(points: THREE.Vector2[] = [], lines: THREE.Vector2[][] = []) {
    this.points = points
    this.lines = lines;
  }
}

export default ConstructionState;