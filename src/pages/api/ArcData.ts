import * as THREE from 'three';

import { floatEqual, modulo } from './utils';
import { TAU } from './constants';

class ArcData {
    center: THREE.Vector2;
    radius: number;
    startAngle: number;
    span: number;

    constructor(center: THREE.Vector2, radius: number, startAngle: number, span: number) {
        this.center = center.clone();
        this.radius = radius;
        this.startAngle = startAngle;
        this.span = span;
    }

    clone() {
        return new ArcData(this.center, this.radius, this.startAngle, this.span);
    }

    equals(other: ArcData) {
        const equal_spans = floatEqual(this.span, other.span);
        const neg_equal_spans = floatEqual(this.span, -other.span);

        const start_eq_start = floatEqual(this.startAngle % TAU, other.startAngle % TAU);
        const start_eq_end = floatEqual(this.startAngle % TAU, (other.startAngle + other.span) % TAU);

        return (
            this.center.equals(other.center) && this.radius == other.radius &&
            ((start_eq_start && equal_spans) || (start_eq_end && neg_equal_spans))
        );
    }

    // span may be positive or negative, so 
    // normalize the start to be in [0, 2pi) and span to be in (0, 2pi]
    regularize(): ArcData {
        let start = Math.min(this.startAngle, this.startAngle + this.span);
        start = modulo(start, TAU);

        return new ArcData(this.center, this.radius, start, Math.abs(this.span))
    }

    contains(point: THREE.Vector2): Boolean {
        let result = false;

        const p = point.clone().sub(this.center);
        
        if (floatEqual(p.length(), this.radius)) {
            const angle = Math.atan2(p.y, p.x);

            const arc = this.regularize();
            const start = arc.startAngle;
            const end = arc.startAngle + arc.span;
            const bump = ((end >= TAU) && (angle <= modulo(end, TAU)) && angle < start) ? TAU : 0;

            const bumped_angle = angle + bump;

            if (
                (start <= bumped_angle && bumped_angle <= end)
            ) {
                result = true;
            }
        }

        return result;
    }
}

export default ArcData;