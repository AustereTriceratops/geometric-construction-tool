import {expect, test} from '@jest/globals';
import * as THREE from 'three';

import { colinear, project, mergeLines } from '../src/pages/api/utils';
import LineData from '../src/pages/api/LineData';

// TODO: property-based testing
test('test projection', () => {
    let vec = project(new THREE.Vector2(3, 0), new THREE.Vector2(1, 0));
    expect(vec.x).toEqual(3);
    expect(vec.y).toEqual(0);

    vec = project(new THREE.Vector2(3, 0), new THREE.Vector2(2, 0));
    expect(vec.x).toEqual(3);
    expect(vec.y).toEqual(0);

    vec = project(new THREE.Vector2(3, 0), new THREE.Vector2(10, 0));
    expect(vec.x).toEqual(3);
    expect(vec.y).toEqual(0);

    // perpendicular vectors
    vec = project(new THREE.Vector2(3, 0), new THREE.Vector2(0, 1));
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(0);

    vec = project(new THREE.Vector2(0, 2), new THREE.Vector2(2, 0));
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(0);

    vec = project(new THREE.Vector2(4, 5), new THREE.Vector2(-5, 4));
    expect(vec.x).toEqual(-0);
    expect(vec.y).toEqual(0);

    vec = project(new THREE.Vector2(-5, 4), new THREE.Vector2(4, 5));
    expect(vec.x).toEqual(0);
    expect(vec.y).toEqual(0);

    // hand-calculated examples
});

test('test colinear', () => {
    let line = new LineData(new THREE.Vector2(0, 0), new THREE.Vector2(5, 0));

    let point = new THREE.Vector2(-4, 0);
    expect(colinear(point, line)).toBeTruthy();

    point = new THREE.Vector2(-4, 1);
    expect(colinear(point, line)).toBeFalsy();

    point = new THREE.Vector2(2, -5);
    expect(colinear(point, line)).toBeFalsy();

    point = new THREE.Vector2(9, 0);
    expect(colinear(point, line)).toBeTruthy();


    line = new LineData(new THREE.Vector2(3, -3), new THREE.Vector2(0, 4));

    point = new THREE.Vector2(6, -10);
    expect(colinear(point, line)).toBeTruthy();

    point = new THREE.Vector2(-3, 11);
    expect(colinear(point, line)).toBeTruthy();

    point = new THREE.Vector2(4, 0);
    expect(colinear(point, line)).toBeFalsy();

    point = new THREE.Vector2(5, 5);
    expect(colinear(point, line)).toBeFalsy();

    line = new LineData(new THREE.Vector2(4, -3), new THREE.Vector2(1, 4));

    point = new THREE.Vector2(7, -10);
    expect(colinear(point, line)).toBeTruthy();

    point = new THREE.Vector2(-2, 11);
    expect(colinear(point, line)).toBeTruthy();

    point = new THREE.Vector2(4, 0);
    expect(colinear(point, line)).toBeFalsy();

    point = new THREE.Vector2(5, 5);
    expect(colinear(point, line)).toBeFalsy();
})


test('test merging overlapping lines', () => {
    p1 = new THREE.Vector2(-1, 0);
    p2 = new THREE.Vector2(1, 1);
    p3 = new THREE.Vector2(-5, -2);
    p4 = new THREE.Vector2(0, 0.5)
    const expected = new LineData(p3, p2);

    let a = new LineData(p1, p2);
    let b = new LineData(p3, p4);

    c = mergeLines(a, b);
    expect(c != null).toBeTruthy;
    expect(c.equals(expected)).toBeTruthy();

    a = new LineData(p2, p1);
    b = new LineData(p3, p4);

    c = mergeLines(a, b);
    expect(c != null).toBeTruthy;
    expect(c.equals(expected)).toBeTruthy();

    a = new LineData(p2, p1);
    b = new LineData(p4, p3);

    c = mergeLines(a, b);
    expect(c != null).toBeTruthy;
    expect(c.equals(expected)).toBeTruthy();

    a = new LineData(p1, p2);
    b = new LineData(p4, p3);

    c = mergeLines(a, b);
    expect(c != null).toBeTruthy;
    expect(c.equals(expected)).toBeTruthy();
});
