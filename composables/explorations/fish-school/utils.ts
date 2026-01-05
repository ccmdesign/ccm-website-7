import type { Vector2D } from './types'

export const vec = {
  add: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x + b.x, y: a.y + b.y }),

  sub: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x - b.x, y: a.y - b.y }),

  mult: (v: Vector2D, n: number): Vector2D => ({ x: v.x * n, y: v.y * n }),

  div: (v: Vector2D, n: number): Vector2D => (n !== 0 ? { x: v.x / n, y: v.y / n } : { x: 0, y: 0 }),

  mag: (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y),

  normalize: (v: Vector2D): Vector2D => {
    const m = vec.mag(v)
    return m > 0 ? vec.div(v, m) : { x: 0, y: 0 }
  },

  limit: (v: Vector2D, max: number): Vector2D => {
    const m = vec.mag(v)
    return m > max ? vec.mult(vec.normalize(v), max) : v
  },

  dist: (a: Vector2D, b: Vector2D): number => vec.mag(vec.sub(a, b)),

  setMag: (v: Vector2D, mag: number): Vector2D => vec.mult(vec.normalize(v), mag),
}
