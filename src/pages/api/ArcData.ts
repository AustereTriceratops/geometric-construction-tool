import * as THREE from 'three';

class ArcData {
    center: THREE.Vector2;
    radius: number;
    startAngle: number;
    dTheta: number;

    constructor(center: THREE.Vector2, radius: number, startAngle: number, dTheta: number) {
        this.center = center.clone();
        this.radius = radius;
        this.startAngle = startAngle;
        this.dTheta = dTheta;
    }

    clone() {
        return new ArcData(this.center, this.radius, this.startAngle, this.dTheta);
    }
}

export default ArcData;