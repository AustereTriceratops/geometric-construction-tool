import {expect, test} from '@jest/globals';
import * as THREE from 'three';

import ArcData from '../src/pages/api/ArcData';
import { TAU } from '../src/pages/api/constants';

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
    b = new ArcData(new THREE.Vector2(-1, 0), 2, TAU, 4);

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();

    a = new ArcData(new THREE.Vector2(-1, 0), 2, 1, 4);
    b = new ArcData(new THREE.Vector2(-1, 0), 2, 1 + 2*TAU, 4);

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();
});

test('point within arc', () => {
    let p1 = new THREE.Vector2(3.076614, -1.643233);
    let c1 = new THREE.Vector2(1.1, -3.9);

    let arc1 = new ArcData(c1, 3, 0, Math.PI/2);
    let arc2 = new ArcData(c1, 3, Math.PI/2, Math.PI/2);
    let arc3 = new ArcData(c1, 3, Math.PI/2, TAU);

    expect(arc1.contains(p1)).toBeTruthy();
    expect(arc2.contains(p1)).toBeFalsy();
    expect(arc3.contains(p1)).toBeTruthy();
    
    p1 = new THREE.Vector2(1, 0);
    c1 = new THREE.Vector2(0, 0);
    
    arc1 = new ArcData(c1, 1, 0, 0.1);
    expect(arc1.contains(p1)).toBeTruthy();

    arc1 = new ArcData(c1, 1, Math.PI, Math.PI);
    expect(arc1.contains(p1)).toBeTruthy();

    arc1 = new ArcData(c1, 1, TAU - 0.1, TAU);
    expect(arc1.contains(p1)).toBeTruthy();

    arc1 = new ArcData(c1, 1, 5*TAU - 0.1, 0.2);
    expect(arc1.contains(p1)).toBeTruthy();

    // the span is set to 0.1, the test fails from floating point error
    arc1 = new ArcData(c1, 1, 5*TAU - 0.1, 0.101);
    expect(arc1.contains(p1)).toBeTruthy();

    arc1 = new ArcData(new THREE.Vector2(1.1, -3.9), 3, -0.1, 3);
    arc2 = new ArcData(new THREE.Vector2(3.5, -1), 3, 3, 3);
    p1 = new THREE.Vector2(4.099740728602468, -3.9394406029813522);
    let p2 = new THREE.Vector2(0.5002592713975326, -0.9605593970186473);

    expect(arc1.contains(p1)).toBeTruthy();
    expect(arc1.contains(p2)).toBeTruthy();
    expect(arc2.contains(p1)).toBeTruthy();
    expect(arc2.contains(p2)).toBeTruthy();

    arc1 = new ArcData(new THREE.Vector2(-2, -2), 2, -1, 2);
    arc2 = new ArcData(new THREE.Vector2(2, -2), 2, 4, 2);
    p1 = new THREE.Vector2(0, -2)

    expect(arc1.contains(p1)).toBeTruthy();
    expect(arc2.contains(p1)).toBeFalsy();
})
