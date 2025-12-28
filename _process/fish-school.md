# Fish School Simulation Component

A Vue/Nuxt component that simulates flocking behavior (boids algorithm) with mouse-based predator avoidance.

## Goals

- Render ~200 teardrop-shaped "fish" on a canvas
- Fish move organically using Reynolds' boids algorithm
- Mouse acts as predator—fish flee when cursor approaches
- Configurable parameters via UI sliders
- Smooth 60fps animation

---

## Technical Approach

**Rendering:** Canvas 2D API (no external dependencies)

**Architecture:**
- `FishSchool.vue` — Main component with canvas + controls
- `useFishSimulation.ts` — Composable handling all simulation logic
- `types.ts` — TypeScript interfaces

**Why this split:** The composable encapsulates the physics/animation loop, keeping the component focused on DOM and user controls. Makes testing and reuse easier.

---

## Boids Algorithm

Each fish has: `position: {x, y}`, `velocity: {x, y}`

### Core Forces (applied every frame)

| Force | Description | Effect |
|-------|-------------|--------|
| **Separation** | Steer away from nearby fish | Prevents crowding |
| **Alignment** | Match velocity of neighbors | Creates coordinated movement |
| **Cohesion** | Steer toward center of nearby fish | Keeps school together |
| **Avoidance** | Flee from mouse position | Predator response |

### Force Calculation (pseudocode)

```
for each fish:
  neighbors = fish within perceptionRadius
  
  separation = average(direction away from too-close neighbors) * separationWeight
  alignment  = average(neighbor velocities) * alignmentWeight
  cohesion   = direction toward neighbor center * cohesionWeight
  avoidance  = direction away from mouse * avoidanceWeight (if mouse within fleeRadius)
  
  fish.velocity += separation + alignment + cohesion + avoidance
  fish.velocity = clamp(fish.velocity, maxSpeed)
  fish.position += fish.velocity
```

### Edge Handling

Wrap-around (toroidal): fish exiting one edge appear on opposite side. Simple and avoids jarring wall-bounce behavior.

---

## Teardrop Rendering

Each fish drawn as a teardrop pointing in direction of velocity:

```
ctx.beginPath()
ctx.ellipse(x, y, width, height, rotation, 0, Math.PI * 2)
// Or: custom path with bezier for sharper tail
ctx.fill()
```

Rotation derived from `Math.atan2(velocity.y, velocity.x)`

Optional: slight opacity/size variation per fish for depth illusion.

---

## Configurable Parameters

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| `fishCount` | 50–300 | 200 | Number of fish |
| `maxSpeed` | 1–6 | 3 | Maximum velocity |
| `perceptionRadius` | 20–100 | 50 | How far fish "see" neighbors |
| `separationWeight` | 0–3 | 1.5 | Strength of separation force |
| `alignmentWeight` | 0–3 | 1.0 | Strength of alignment force |
| `cohesionWeight` | 0–3 | 1.0 | Strength of cohesion force |
| `fleeRadius` | 50–200 | 100 | Distance at which mouse triggers flee |
| `fleeStrength` | 0–5 | 2.5 | How aggressively fish avoid mouse |

---

## Component Structure

```vue
<template>
  <div class="fish-school">
    <canvas ref="canvasRef" />
    
    <div class="controls">
      <!-- Sliders for each parameter -->
      <label>
        Fish Count: {{ config.fishCount }}
        <input type="range" v-model="config.fishCount" min="50" max="300" />
      </label>
      <!-- ... other sliders -->
    </div>
  </div>
</template>
```

---

## File Structure

```
components/
  FishSchool/
    FishSchool.vue        # Main component
    useFishSimulation.ts  # Animation loop + boids logic
    types.ts              # Fish, Config interfaces
    utils.ts              # Vector math helpers (add, subtract, normalize, limit)
```

---

## Implementation Steps

### Phase 1: Foundation
1. Create `types.ts` with `Fish`, `Vector2D`, and `Config` interfaces
2. Create `utils.ts` with vector math functions
3. Scaffold `FishSchool.vue` with canvas + basic reactive config

### Phase 2: Simulation Core
4. Implement `useFishSimulation.ts`:
   - Initialize fish array with random positions/velocities
   - Set up `requestAnimationFrame` loop
   - Implement each boids force function
   - Apply forces and update positions each frame

### Phase 3: Rendering
5. Draw teardrop shapes with proper rotation
6. Handle canvas resize (watch container size)
7. Add subtle visual polish (size/opacity variation)

### Phase 4: Interactivity
8. Track mouse position relative to canvas
9. Implement flee force when mouse within radius
10. Wire up sliders to config (with `watch` to reinitialize if fishCount changes)

### Phase 5: Polish
11. Add touch support for mobile
12. Performance tuning (spatial hashing if needed, but likely unnecessary for 200 fish)
13. Optional: color themes, trail effects

---

## Performance Notes

- **Spatial hashing:** For 200 fish, brute-force neighbor checking (O(n²)) runs fine. If scaling to 500+, implement grid-based spatial partitioning.
- **Object pooling:** Pre-allocate fish array; avoid creating objects in the animation loop.
- **Canvas optimizations:** Single `beginPath()` per frame if all fish same color; batch draws.

---

## Example Vector Utils

```typescript
export interface Vector2D {
  x: number
  y: number
}

export const vec = {
  add: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x + b.x, y: a.y + b.y }),
  sub: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x - b.x, y: a.y - b.y }),
  mult: (v: Vector2D, n: number): Vector2D => ({ x: v.x * n, y: v.y * n }),
  div: (v: Vector2D, n: number): Vector2D => ({ x: v.x / n, y: v.y / n }),
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
}
```

---

## Open Questions / Future Ideas

- **Color:** Single color, or gradient based on velocity/depth?
- **Obstacles:** Add static shapes fish avoid?
- **Multiple predators:** Support touch points as additional flee sources?
- **Recording:** Export as video/GIF?

---

Ready for implementation. Start with Phase 1 → scaffold types and utils, then build up from there.