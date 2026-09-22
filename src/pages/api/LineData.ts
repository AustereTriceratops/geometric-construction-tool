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
}

export default LineData;
