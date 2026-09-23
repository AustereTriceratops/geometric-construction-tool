import {expect, test} from '@jest/globals';
import * as THREE from 'three';

import LineData from '../src/pages/api/LineData';

test('LineData equality', () => {
    let a = new LineData(new THREE.Vector2(0, 0), new THREE.Vector2(0, 0));
    let b = new LineData(new THREE.Vector2(0, 0), new THREE.Vector2(0, 0));

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();

    a = new LineData(new THREE.Vector2(5, -2), new THREE.Vector2(7.3, 0.1));
    b = new LineData(new THREE.Vector2(5, -2), new THREE.Vector2(7.3, 0.1));

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();

    b = new LineData(new THREE.Vector2(7.3, 0.1), new THREE.Vector2(5, -2));

    expect(a.equals(b)).toBeTruthy();
    expect(b.equals(a)).toBeTruthy();
})

test('LineData inequality', () => {
    const a = new LineData(new THREE.Vector2(0, 5), new THREE.Vector2(0, 0));
    const b = new LineData(new THREE.Vector2(0, 0), new THREE.Vector2(0, 0));
    const c = new LineData(new THREE.Vector2(7, 0.4), new THREE.Vector2(7.3, 0.1));
    const d = new LineData(new THREE.Vector2(-6.2, 0.9), new THREE.Vector2(8.2, -10));

    expect(a.equals(b)).toBeFalsy();
    expect(b.equals(a)).toBeFalsy();
    expect(a.equals(c)).toBeFalsy();
    expect(a.equals(d)).toBeFalsy();
    expect(b.equals(c)).toBeFalsy();
    expect(b.equals(d)).toBeFalsy();
    expect(c.equals(d)).toBeFalsy();
})