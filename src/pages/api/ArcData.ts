import * as THREE from 'three';

import { floatEqual } from './utils';

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

    equals(other: ArcData) {
        return (
            this.center.equals(other.center) && this.radius == other.radius &&
            (
                (this.startAngle % (2*Math.PI) == other.startAngle % (2*Math.PI) && floatEqual(this.dTheta, other.dTheta)) ||
                (this.startAngle % (2*Math.PI) == (other.startAngle + other.dTheta) % (2*Math.PI) && floatEqual(this.dTheta, -other.dTheta))
            )
        );
    }
}

export default ArcData;