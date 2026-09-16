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
