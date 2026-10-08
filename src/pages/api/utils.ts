import * as THREE from 'three';

import LineData from './LineData';
import ArcData from './ArcData';
import { TAU } from './constants';

export function floatEqual(a: number, b: number, cutoff: number = 1e-6): Boolean {
    return (Math.abs(a - b) < cutoff)? true : false
}

export function modulo(a: number, b: number): number {
    return ((a % b) + b) % b;
}

// midpoint between two vectors a and b
export function midpoint(a: THREE.Vector2, b: THREE.Vector2): THREE.Vector2 {
    return a.clone().add(b).divideScalar(2);
}

// given points a and b, draw a line through them such that 
// the line continues on past the original points by some factor
export function extrapolate(a: THREE.Vector2, b: THREE.Vector2, fac: number) {
    const mp = midpoint(a, b);

    const a_ = a.clone().sub(mp).multiplyScalar(fac).add(mp);
    const b_ = b.clone().sub(mp).multiplyScalar(fac).add(mp);

    return {a_, b_};
}

export function extrapolateByMidpoint(v: THREE.Vector2, mp: THREE.Vector2, fac: number): THREE.Vector2 {
    return v.clone().sub(mp).multiplyScalar(fac).add(mp);
}

export function extrapolateByMidpointFixed(v: THREE.Vector2, mp: THREE.Vector2, length: number): THREE.Vector2 {
    const vec = v.clone().sub(mp)
    const dist = vec.length()
    
    return vec.multiplyScalar(length/dist).add(mp);
}

// project vector a onto vector b
// (A \dot B) * B / |B|^2, or equivalently
// (A \dot B_unit) * B_unit
export function project(a: THREE.Vector2, b: THREE.Vector2): THREE.Vector2 {
        const a_dot_b = a.clone().dot(b);
        const b_sq = b.lengthSq();

        return b.clone().multiplyScalar(a_dot_b/b_sq);
}

// takes a point X and a line between A and B. Normalizes coordinates to X_ and B_ 
// such that point A is the origin. Then, calcualte X_ \dot (B_/|B|)
export function projectionComponent(x: THREE.Vector2, a: THREE.Vector2, b: THREE.Vector2) {
    const b_ = b.clone().sub(a);
    const x_ = x.clone().sub(a);

    const b_len = b_.length();
    const x_dot_b = x_.clone().dot(b_);
    return x_dot_b/b_len;
}

// project x onto the line defined by a (anchor point) and b (secondary point)
export function projectToLine(
    x: THREE.Vector2, a: THREE.Vector2, b: THREE.Vector2
): THREE.Vector2 {
    const b_ = b.clone().sub(a);
    const x_ = x.clone().sub(a);
    return project(x_, b_).add(a);
}

// returns the angle between vectors a and b, 
// with a positive angle meaning b is positioned counterclockwise to x
export function angleBetween(a: THREE.Vector2, b: THREE.Vector2) {
    // rotate a and b such that a becomes the positive x axis
    // this is effectively just complex division
    const a_mag = a.lengthSq();

    const b_rotated = new THREE.Vector2(a.x*b.x + a.y*b.y, a.x*b.y - a.y*b.x);
    b_rotated.divideScalar(a_mag);

    return Math.atan2(b_rotated.y, b_rotated.x);
}

export function colinear(point: THREE.Vector2, line: LineData, delta=1e-6): Boolean {
    const p_proj = projectToLine(point, line.start, line.end);
    const diff = point.clone().sub(p_proj);

    if (Math.abs(diff.x) < delta && Math.abs(diff.y) < delta) {
        return true;
    } else {
        return false;
    }
}

export function mergeLines(a: LineData, b: LineData): LineData | null {
    let result = null;

    if (!colinear(a.start, b)) return result;
    if (!colinear(a.end, b)) return result;

    const a_start_component = projectionComponent(a.start, b.start, b.end);
    const a_end_component = projectionComponent(a.end, b.start, b.end);
    
    const a_min = Math.min(a_start_component, a_end_component);
    const a_len = Math.abs(a_end_component - a_start_component);
    const b_len = b.start.distanceTo(b.end);

    if (a_min + a_len >= 0 && a_min + a_len <= b_len && a_min <= 0) {
        const pA = (a_min == a_start_component) ? a.start : a.end;
        return new LineData(pA, b.end);
    } else if (a_min + a_len >= b_len && a_min <= 0) {
        // a completely overlaps b
        return a.clone();
    } else if (a_min + a_len >= b_len && a_min >= 0 && a_min <= b_len) {
        const pA = (a_min == a_start_component) ? a.end : a.start;
        return new LineData(b.start, pA);
    } else if (a_min + a_len <= b_len && a_min >= 0) {
        //b completely overlaps a
        return b.clone();
    }

    return result;
}

export function mergeNewLine(lines: LineData[], newLine: LineData) {
    // TODO: this could be made a lot faster by abstracting lines further into
    // carrying info about the "original" segment, and just checking if lines
    // share that segment to immediately know that they are colinear
    let noMerge = true;
    const newLines: LineData[] = [];
    let updatedIndex: number | null = null;

    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];

      // see if the new line overlaps with any existing lines
      const c = mergeLines(l, newLine);

      if (c == null) {
        newLines.push(l);
      } else {
        noMerge = false;

        if (updatedIndex == null) {
          updatedIndex = i;
          newLines.push(c);
        } else {
          const d = mergeLines(newLines[updatedIndex], c);

          // this will always be true, but typechecker requires a check
          if (d != null) {
            newLines[updatedIndex] = d;
          }
        }
      }
    }

    if (noMerge) {
      newLines.push(newLine);
    }

    return newLines;
}

export function mergeArcs(a: ArcData, b: ArcData): ArcData | null {
    let result = null;

    if (!a.center.equals(b.center)) return result;
    if (a.radius != b.radius) return result;
    
    const a_reg = a.regularize();
    const b_reg = b.regularize();
    
    let a_start = a_reg.startAngle;
    let b_start = b_reg.startAngle;
    let a_end = a_start + a_reg.span;
    let b_end = b_start + b_reg.span;

    // first point must have the other arc's starting point in its span
    const b_bump = ((a_end >= TAU) && (b_start <= modulo(a_end, TAU)) && b_start < a_start) ? TAU : 0;
    const a_bump = ((b_end >= TAU) && (a_start <= modulo(b_end, TAU)) && a_start < b_start) ? TAU : 0;

    a_start = a_start + a_bump;
    a_end = a_end + a_bump;
    b_start = b_start + b_bump;
    b_end = b_end + b_bump;

    if (a_start <= b_start && a_end >= b_start && a_end <= b_end) {
        return new ArcData(a.center, a.radius, a_start, b_end - a_start);
    } else if (a_start <= b_start && a_end > b_end) {
        return a.clone();
    } else if (b_start <= a_start && b_end >= a_start && b_end <= a_end) {
        return new ArcData(b.center, b.radius, b_start, a_end - b_start);
    } else if (b_start <= a_start && b_end > a_end) {
        return b.clone()
    }

    return result;
}

export function mergeNewArc(arcs: ArcData[], newArc: ArcData) {
    let noMerge = true;
    const newArcs: ArcData[] = [];
    let updatedIndex: number | null = null;

    for (let i = 0; i < arcs.length; i++) {
      const a = arcs[i];

      // see if the new line overlaps with any existing lines
      const c = mergeArcs(a, newArc);

      if (c == null) {
        newArcs.push(a);
      } else {
        noMerge = false;

        if (updatedIndex == null) {
          updatedIndex = i;
          newArcs.push(c);
        } else {
          const d = mergeArcs(newArcs[updatedIndex], c);

          // this will always be true, but typechecker requires a check
          if (d != null) {
            newArcs[updatedIndex] = d;
          }
        }
      }
    }

    if (noMerge) {
      newArcs.push(newArc);
    }

    return newArcs;
}

export function projectToArc(coords: THREE.Vector2, arc: ArcData): THREE.Vector2 {
    const {center, radius} = arc;
    const diff = coords.clone().sub(center);
    const angle = Math.atan2(diff.y, diff.x);

    return new THREE.Vector2(radius * Math.cos(angle), radius * Math.sin(angle)).add(center);
}

export function closestPoint(coords: THREE.Vector2, points: THREE.Vector2[]) {
    let minDistance = Infinity;
    let closestPoint = points[0];

    for (let i = 0; i < points.length; i++) {
        const dist = coords.distanceTo(points[i]);

        if (dist < minDistance) {
            minDistance = dist;
            closestPoint = points[i].clone();
        }
    }

    return closestPoint;
}

export function findLineIntersections(arcs: ArcData[]): THREE.Vector2[] {
    if (arcs.length < 2) return [];

    return [];
}

export function findArcIntersections(arcs: ArcData[]): THREE.Vector2[] {
    if (arcs.length < 2) {
        return [];
    } else {
        return findIntersectionOfTwoArcs(arcs[0], arcs[1]);
    }
}

export function findIntersectionOfTwoArcs(arc_1: ArcData, arc_2: ArcData): THREE.Vector2[] {
    const dist = arc_1.center.distanceTo(arc_2.center);
    const combined_radii = arc_1.radius + arc_2.radius;

    if (dist > combined_radii) { // trivially no intersection
        return [];
    } else if (dist == combined_radii) { // tangent arcs`
        const mp = midpoint(arc_1.center, arc_2.center);

        if (arc_1.contains(mp) && arc_2.contains(mp)) {
            return [midpoint(arc_1.center, arc_2.center)];
        } else {
            return [];
        }
    } else {

        const c1 = arc_1.center;
        const r1 = arc_1.radius;
        const c2 = arc_2.center;
        const r2 = arc_2.radius;
    
        const r = c1.lengthSq() - c2.lengthSq() + r2*r2 - r1*r1;
        const p = c2.x - c1.x;
        const q = c2.y - c1.y;
        const s = r/(2*q) + c1.y;
        const gamma = c1.x*c1.x + s*s - r1*r1;
        const beta = 2*p*s/q - 2*c1.x;
        const alpha = 1 + p*p/(q*q);
    
        const disc = Math.sqrt(beta*beta - 4*alpha*gamma);
    
        const x1 = (disc - beta)/(2*alpha);
        const x2 = (-disc - beta)/(2*alpha);
    
        const y1 = -(p*x1/q + r/(2*q));
        const y2 = -(p*x2/q + r/(2*q));
    
        const circleIntersections = [new THREE.Vector2(x1, y1), new THREE.Vector2(x2, y2)];
        const arcIntersections = circleIntersections.filter((point) => arc_1.contains(point) && arc_2.contains(point));
    
        return arcIntersections;
    }
}

export function findLineAndArcIntersections(lines: LineData[], arcs: ArcData[]): THREE.Vector2[] {
    if (lines.length == 0 && arcs.length == 0) return [];

    return [];
}

export function snapCoordsToIntersection(coords: THREE.Vector2, lines: LineData[], arcs: ArcData[]): THREE.Vector2 | null {
    if (lines.length == 0 && arcs.length == 0) {
        return null;
    } else if (lines.length == 1 && arcs.length == 0) {
        const line = lines[0];
        return projectToLine(coords, line.start, line.end);
    } else if (lines.length == 0 && arcs.length == 1) {
        const arc = arcs[0];
        return projectToArc(coords, arc);
    } else {
        const intersections = findLineAndArcIntersections(lines, arcs);
        return closestPoint(coords, intersections);
    }

    return null;
}
