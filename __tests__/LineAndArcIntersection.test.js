import {expect, test} from '@jest/globals';
import * as THREE from 'three';

import { vec2Equal, findLineIntersections, findIntersectionOfTwoArcs, findLineAndArcIntersection, snapCoordsToIntersection } from '../src/pages/api/utils';
import LineData from '../src/pages/api/LineData';
import ArcData from '../src/pages/api/ArcData';
import { TAU } from '@/pages/api/constants';


test('non-intersecting lines', () => {
    // let line_1 = new LineData(new THREE.Vector2(0, 0), new THREE.Vector2(1, 1));
    // let line_2 = new LineData(new THREE.Vector2(0, 2), new THREE.Vector2(1, 3));

    // let intersections = findLineIntersections([line_1, line_2]);
    // expect(intersections.length == 0).toBeTruthy();

    // line_1 = new LineData(new THREE.Vector2(-1, 3), new THREE.Vector2(-5, -1));
    // line_2 = new LineData(new THREE.Vector2(-1, 5), new THREE.Vector2(-5, 1));

    // intersections = findLineIntersections([line_1, line_2]);
    // expect(intersections.length == 0).toBeTruthy();
});


test('intersecting lines', () => {
    // const line_1 = new LineData(new THREE.Vector2(-1, 4), new THREE.Vector2(1, -4));
    // const line_2 = new LineData(new THREE.Vector2(0, 0), new THREE.Vector2(1, 3));

    // const intersection = snapCoordsToIntersection(new THREE.Vector2(0, 0), [line_1, line_2], []);
    // expect(intersection != null).toBeTruthy();
    // expect(intersection.equals(new THREE.Vector2(0, 0))).toBeTruthy();
});

test('lines not intersecting arcs', () => {
    
});

test('lines intersecting arcs', () => {
    
});

test('non-intersecting arcs', () => {
    let arc_1 = new ArcData(new THREE.Vector2(1.1, -3.9), 3, Math.PI, 1);
    let arc_2 = new ArcData(new THREE.Vector2(3.5, -1), 3, 3, 3);

    let intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 0).toBeTruthy();

    arc_1 = new ArcData(new THREE.Vector2(1.1, -3.9), 3, 0, Math.PI);
    arc_2 = new ArcData(new THREE.Vector2(3.5, -1), 3, 0, 1);

    intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 0).toBeTruthy();

    arc_1 = new ArcData(new THREE.Vector2(-3, 0), 2, 0, TAU);
    arc_2 = new ArcData(new THREE.Vector2(3, 0), 2, 0, TAU);

    intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 0).toBeTruthy();

    arc_1 = new ArcData(new THREE.Vector2(-2, 7), 4, 0, TAU);
    arc_2 = new ArcData(new THREE.Vector2(3, 0), 4, 0, TAU);

    intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 0).toBeTruthy();

    arc_1 = new ArcData(new THREE.Vector2(-1, 3), 1, 0, TAU);
    arc_2 = new ArcData(new THREE.Vector2(-5, 9), 1, 0, TAU);

    intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 0).toBeTruthy();
});

test('tangent arcs', () => {
    let arc_1 = new ArcData(new THREE.Vector2(-2, -2), 2, -1, 2);
    let arc_2 = new ArcData(new THREE.Vector2(2, -2), 2, 3, 2);
    let mp = new THREE.Vector2(0, -2)

    let intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 1).toBeTruthy();
    expect(intersections[0].equals(mp));

    let arc_3 = new ArcData(new THREE.Vector2(-2, -2), 2, 1, 2);
    let arc_4 = new ArcData(new THREE.Vector2(2, -2), 2, 4, 2);

    intersections = findIntersectionOfTwoArcs(arc_1, arc_4);
    expect(intersections.length == 0).toBeTruthy();
    intersections = findIntersectionOfTwoArcs(arc_2, arc_3);
    expect(intersections.length == 0).toBeTruthy();
    intersections = findIntersectionOfTwoArcs(arc_3, arc_4);
    expect(intersections.length == 0).toBeTruthy();
})

test('intersecting arcs', () => {
    let arc_1 = new ArcData(new THREE.Vector2(1.1, -3.9), 3, -0.1, 3);
    let arc_2 = new ArcData(new THREE.Vector2(3.5, -1), 3, 3, 3);

    let intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 2).toBeTruthy();

    let intersection = snapCoordsToIntersection(new THREE.Vector2(0, 0), [], [arc_1, arc_2]);
    expect(intersection != null).toBeTruthy();
    expect(vec2Equal(new THREE.Vector2(0.500259, -0.960559), intersection)).toBeTruthy();

    intersection = snapCoordsToIntersection(new THREE.Vector2(4, -4), [], [arc_1, arc_2]);
    expect(intersection != null).toBeTruthy();
    expect(vec2Equal(new THREE.Vector2(4.09974, -3.93944), intersection)).toBeTruthy();
    

    arc_1 = new ArcData(new THREE.Vector2(1.1, -3.9), 3, -0.1, Math.PI/4);
    arc_2 = new ArcData(new THREE.Vector2(3.5, -1), 3, 3, 3);
    
    intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 1).toBeTruthy();
    expect(vec2Equal(new THREE.Vector2(4.09974, -3.93944), intersections[0])).toBeTruthy();


    arc_1 = new ArcData(new THREE.Vector2(1.1, -3.9), 3, -0.1, Math.PI);
    arc_2 = new ArcData(new THREE.Vector2(3.5, -1), 3, 3*Math.PI/2, Math.PI/2);
    
    intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 1).toBeTruthy();
    expect(vec2Equal(new THREE.Vector2(4.09974, -3.93944), intersections[0])).toBeTruthy();

    arc_1 = new ArcData(new THREE.Vector2(1.1, -3.9), 3, Math.PI/4, Math.PI/2);
    arc_2 = new ArcData(new THREE.Vector2(3.5, -1), 3, 3, 3);
    
    intersections = findIntersectionOfTwoArcs(arc_1, arc_2);
    expect(intersections.length == 1).toBeTruthy();
    expect(vec2Equal(new THREE.Vector2(0.50026, -0.96056), intersections[0])).toBeTruthy();
    
    arc_1 = new ArcData(new THREE.Vector2(-2, 0), 4, -1.49072399, 3.01581912);
    arc_2 = new ArcData(new THREE.Vector2(2, 0), 4, -1.60495734, -2.78671046);
    intersections = findIntersectionOfTwoArcs(arc_1, arc_2)
    expect(intersections.length == 2).toBeTruthy();
});