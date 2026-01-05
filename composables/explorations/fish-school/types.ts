export interface Vector2D {
  x: number
  y: number
}

export interface Fish {
  position: Vector2D
  velocity: Vector2D
  targetVelocity: Vector2D // Desired velocity (smoothed toward this)
  smoothedAngle: number // Smoothed rotation angle for rendering
  depth: number // 0-1, affects size/opacity for depth illusion
}

export interface FishConfig {
  fishCount: number
  maxSpeed: number
  perceptionRadius: number
  separationWeight: number
  alignmentWeight: number
  cohesionWeight: number
  fleeRadius: number
  fleeStrength: number
}

export const defaultConfig: FishConfig = {
  fishCount: 200,
  maxSpeed: 3,
  perceptionRadius: 50,
  separationWeight: 1.5,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0,
  fleeRadius: 100,
  fleeStrength: 2.5,
}
