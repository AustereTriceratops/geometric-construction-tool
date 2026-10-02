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
        const equal_spans = floatEqual(this.dTheta, other.dTheta);
        const neg_equal_spans = floatEqual(this.dTheta, -other.dTheta);

        const start_eq_start = floatEqual(this.startAngle % (2*Math.PI), other.startAngle % (2*Math.PI));
        const start_eq_end = floatEqual(this.startAngle % (2*Math.PI), (other.startAngle + other.dTheta) % (2*Math.PI));

        return (
            this.center.equals(other.center) && this.radius == other.radius &&
            ((start_eq_start && equal_spans) || (start_eq_end && neg_equal_spans))
        );
    }
}

export default ArcData;