import * as THREE from 'three';

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
export function project(a: THREE.Vector2, b: THREE.Vector2): THREE.Vector2 {
    const a_dot_b = a.clone().dot(b);
    const b_sq = b.lengthSq();

    return b.clone().multiplyScalar(a_dot_b/b_sq);
}

// project x onto the line defined by a (anchor point) and b (secondary point)
export function projectToLine(x: THREE.Vector2, a: THREE.Vector2, b: THREE.Vector2) {
    const diff = b.clone().sub(a);
    const relativeCoords = x.clone().sub(a);
    return project(relativeCoords, diff).add(a);
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
