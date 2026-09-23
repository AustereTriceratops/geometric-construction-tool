import * as THREE from "three";

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
}

export default LineData;
