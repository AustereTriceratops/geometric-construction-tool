import * as THREE from 'three';

class ArcData {
    center: THREE.Vector2;
    radius: number;
    startAngle: number;
    endAngle: number;

    constructor(center: THREE.Vector2, radius: number, startAngle: number, endAngle: number) {
        this.center = center.clone();
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }
}

export default ArcData;