import {expect, test} from '@jest/globals';
import * as THREE from 'three';

import { project } from '../src/pages/utils';

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
})