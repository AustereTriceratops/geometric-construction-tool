import * as THREE from 'three';

class PointData {
    point: THREE.Vector2;
    isArbitrary: Boolean;

    constructor(point: THREE.Vector2, isArbitrary: Boolean = false) {
        this.point = point.clone();
        this.isArbitrary = isArbitrary;
    }

    clone() {
        return new PointData(this.point, this.isArbitrary);
    }
}

export default PointData;