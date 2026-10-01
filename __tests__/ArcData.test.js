import {expect, test} from '@jest/globals';
import * as THREE from 'three';

import ArcData from '../src/pages/api/ArcData';

test('ArcData equality', () => {
    let a = new ArcData(new THREE.Vector2(0.2, 3), 4.3, 0.1, 2);
    let b = new ArcData(new THREE.Vector2(0.2, 3), 4.3, 0.1, 2);

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();

    a = new ArcData(new THREE.Vector2(4, 0.5), 1, 7, 8);
    b = new ArcData(new THREE.Vector2(4, 0.5), 1, 7, 8);

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();

    a = new ArcData(new THREE.Vector2(4, 0.5), 1, 7, -4);
    b = new ArcData(new THREE.Vector2(4, 0.5), 1, 3, 4);

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();

    a = new ArcData(new THREE.Vector2(-1, 0), 2, 0, 4);
    b = new ArcData(new THREE.Vector2(-1, 0), 2, 2*Math.PI, 4);

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();

    a = new ArcData(new THREE.Vector2(-1, 0), 2, 1, 4);
    b = new ArcData(new THREE.Vector2(-1, 0), 2, 1 + 4*Math.PI, 4);

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();
})