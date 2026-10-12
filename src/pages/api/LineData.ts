import * as THREE from "three";
import { projectionComponent, projectToLine } from './utils';

class LineData {
    start: THREE.Vector2;
    end: THREE.Vector2;

    constructor(start: THREE.Vector2, end: THREE.Vector2) {
        this.start = start.clone();
        this.end = end.clone();
    }

    clone() {
        return new LineData(this.start, this.end);
    }

    equals(line: LineData) {
        return (
            this.start.equals(line.start) && this.end.equals(line.end) ||
            this.start.equals(line.end) && this.end.equals(line.start)
        )
    }

    length() {
        return this.start.distanceTo(this.end);
    }

    colinearTo(point: THREE.Vector2, delta=1e-6): Boolean {
        const p_proj = projectToLine(point, this.start, this.end);
        const diff = point.clone().sub(p_proj);
    
        if (Math.abs(diff.x) < delta && Math.abs(diff.y) < delta) {
            return true;
        } else {
            return false;
        }
    }

    contains(point: THREE.Vector2): Boolean {
        if (!this.colinearTo(point)) return false;

        const p = projectionComponent(point, this.start, this.end);

        if (p < 0 || p > this.length()) return false;

        return true;
    }
}

export default LineData;
