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


test('test colinear', () => {
    let line = new LineData(new THREE.Vector2(0, 0), new THREE.Vector2(5, 0));

    let point = new THREE.Vector2(-4, 0);
    expect(line.colinearTo(point)).toBeTruthy();

    point = new THREE.Vector2(-4, 1);
    expect(line.colinearTo(point)).toBeFalsy();

    point = new THREE.Vector2(2, -5);
    expect(line.colinearTo(point)).toBeFalsy();

    point = new THREE.Vector2(9, 0);
    expect(line.colinearTo(point)).toBeTruthy();

    line = new LineData(new THREE.Vector2(3, -3), new THREE.Vector2(0, 4));

    point = new THREE.Vector2(6, -10);
    expect(line.colinearTo(point)).toBeTruthy();

    point = new THREE.Vector2(-3, 11);
    expect(line.colinearTo(point)).toBeTruthy();

    point = new THREE.Vector2(4, 0);
    expect(line.colinearTo(point)).toBeFalsy();

    point = new THREE.Vector2(5, 5);
    expect(line.colinearTo(point)).toBeFalsy();

    line = new LineData(new THREE.Vector2(4, -3), new THREE.Vector2(1, 4));

    point = new THREE.Vector2(7, -10);
    expect(line.colinearTo(point)).toBeTruthy();

    point = new THREE.Vector2(-2, 11);
    expect(line.colinearTo(point)).toBeTruthy();

    point = new THREE.Vector2(4, 0);
    expect(line.colinearTo(point)).toBeFalsy();

    point = new THREE.Vector2(5, 5);
    expect(line.colinearTo(point)).toBeFalsy();
});

test('test line contains', () => {
    let line = new LineData(new THREE.Vector2(0, 0), new THREE.Vector2(5, 0));

    let point = new THREE.Vector2(-2, 0);
    expect(line.contains(point)).toBeFalsy();

    point = new THREE.Vector2(6, 0);
    expect(line.contains(point)).toBeFalsy();

    point = new THREE.Vector2(3, 0);
    expect(line.contains(point)).toBeTruthy();

    point = new THREE.Vector2(0, 0);
    expect(line.contains(point)).toBeTruthy();

    point = new THREE.Vector2(5, 0);
    expect(line.contains(point)).toBeTruthy();

    point = new THREE.Vector2(0, 1);
    expect(line.contains(point)).toBeFalsy();

    point = new THREE.Vector2(-1, 1);
    expect(line.contains(point)).toBeFalsy();

    point = new THREE.Vector2(1, 1);
    expect(line.contains(point)).toBeFalsy();

    point = new THREE.Vector2(1, -1);
    expect(line.contains(point)).toBeFalsy();
    
    line = new LineData(new THREE.Vector2(-1, 0), new THREE.Vector2(3, 8));
    
    point = new THREE.Vector2(-1, -0);
    expect(line.contains(point)).toBeTruthy();

    point = new THREE.Vector2(3, 8);
    expect(line.contains(point)).toBeTruthy();

    point = new THREE.Vector2(1, 4);
    expect(line.contains(point)).toBeTruthy();

    point = new THREE.Vector2(0, 2);
    expect(line.contains(point)).toBeTruthy();

    point = new THREE.Vector2(0, 2.2);
    expect(line.contains(point)).toBeFalsy();

    point = new THREE.Vector2(-1, 5);
    expect(line.contains(point)).toBeFalsy();

    point = new THREE.Vector2(3, -3);
    expect(line.contains(point)).toBeFalsy();
});
