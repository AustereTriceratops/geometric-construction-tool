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
    
    // dTheta may be positive or negative, so normalize the start to the "true" start
    let a_start = Math.min(a.startAngle, a.startAngle + a.dTheta);
    let b_start = Math.min(b.startAngle, b.startAngle + b.dTheta);
    
    // reduce start mod 2pi
    a_start = modulo(a_start, TAU);
    b_start = modulo(b_start, TAU);
    // a_start and b_start are now in [0, 2pi)
    
    // true endpoint
    let a_end = a_start + Math.abs(a.dTheta);
    let b_end = b_start + Math.abs(b.dTheta);

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
