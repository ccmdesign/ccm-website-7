# Fish School Simulation - Implementation Report

## Overview

Built a boids-algorithm fish schooling simulation as an interactive Vue/Nuxt component. The simulation renders ~200 teardrop-shaped fish that move as a cohesive school, with mouse-based predator avoidance.

---

## Files Created

### Composables (`composables/explorations/fish-school/`)

| File | Purpose |
|------|---------|
| `types.ts` | TypeScript interfaces: `Vector2D`, `Fish`, `FishConfig` |
| `utils.ts` | Vector math helpers: `add`, `sub`, `mult`, `div`, `mag`, `normalize`, `limit`, `dist` |
| `useFishSimulation.ts` | Core simulation logic, animation loop, rendering |

### Component (`components/explorations/FishSchool/`)

| File | Purpose |
|------|---------|
| `FishSchool.vue` | Main component with canvas + collapsible control panel |

### Test Page (`pages/tests/`)

| File | Purpose |
|------|---------|
| `fish-school.vue` | Full-screen demo at `/tests/fish-school` |

---

## Technical Implementation

### Boids Algorithm

Each fish calculates steering forces every frame:

| Force | Description |
|-------|-------------|
| **Collision** | Buffer zone prevents fish from ever touching; smooth sideways sliding |
| **Separation** | Gentle push to maintain comfortable swimming distance |
| **Alignment** | Match velocity with neighbors for coordinated movement |
| **Cohesion** | Pull toward center of nearby fish to stay grouped |
| **Return to School** | Strong pull back when straying too far from school center |
| **Avoidance** | Flee from mouse cursor (predator response) |
| **Boundary** | Smooth turning away from canvas edges |

### Smooth Movement System

To eliminate flickering and jittery motion:

```
Forces → Target Velocity → Lerp → Actual Velocity → Position
```

**Key smoothing parameters:**
- `VELOCITY_SMOOTHING = 0.08` - How fast velocity catches up to target
- `ANGLE_SMOOTHING = 0.1` - How fast rotation interpolates
- `MAX_ACCELERATION = 0.15` - Maximum velocity change per frame

**Angle interpolation** uses proper wrapping (-π to π) to prevent spinning artifacts:

```typescript
function lerpAngle(a: number, b: number, t: number): number {
  let diff = b - a
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  return a + diff * t
}
```

### Collision Avoidance

Fish never touch each other. The system uses layered buffers:

| Zone | Distance | Behavior |
|------|----------|----------|
| Hard buffer | < 40px | Strong direct push away |
| Buffer zone | < 45px | Smooth sideways sliding |
| Preferred distance | < 55px | Gentle separation force |

**Sideways sliding** calculates a perpendicular direction to the fish's velocity, making fish flow around each other rather than bounce back.

### Depth Variation

Each fish has a random `depth` value (0-1) affecting:
- **Size**: 0.5x to 1.0x base size
- **Opacity**: 0.4 to 1.0 alpha
- **Draw order**: Sorted back-to-front for proper layering

### Fish Rendering

Teardrop shape using bezier curves:

```typescript
ctx.beginPath()
ctx.moveTo(size, 0) // Nose
ctx.bezierCurveTo(size * 0.5, size * 0.3, -size * 0.6, size * 0.3, -size, 0)
ctx.bezierCurveTo(-size * 0.6, -size * 0.3, size * 0.5, -size * 0.3, size, 0)
ctx.fill()
```

---

## Configuration

Default parameters (adjustable via control panel):

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| `fishCount` | 200 | 50-300 | Number of fish |
| `maxSpeed` | 3 | 1-6 | Maximum velocity |
| `perceptionRadius` | 50 | 20-100 | Neighbor detection range |
| `separationWeight` | 1.5 | 0-3 | Separation force strength |
| `alignmentWeight` | 1.0 | 0-3 | Alignment force strength |
| `cohesionWeight` | 1.0 | 0-3 | Cohesion force strength |
| `fleeRadius` | 100 | 50-200 | Mouse detection range |
| `fleeStrength` | 2.5 | 0-5 | Flee force strength |

---

## Key Behaviors

1. **Single cohesive school** - Fish spawn as a tight cluster and stay together
2. **Smooth constant motion** - Fish always swim at minimum 35% of max speed
3. **Mouse scattering** - Fish flee when cursor approaches, then quickly regroup
4. **No collisions** - Buffer zones and sideways sliding prevent overlapping
5. **Edge avoidance** - Fish turn smoothly away from canvas boundaries
6. **60fps animation** - Uses `requestAnimationFrame` for smooth rendering

---

## Usage

```vue
<template>
  <FishSchool
    :show-controls="true"
    :initial-config="{ fishCount: 150, maxSpeed: 4 }"
  />
</template>
```

**Props:**
- `showControls` - Show/hide the settings panel (default: true)
- `initialConfig` - Override default configuration values

---

## Performance Notes

- **O(n²) neighbor checking** - Acceptable for 200 fish; would need spatial hashing for 500+
- **Pre-allocated arrays** - Fish array created once, mutated in place
- **Single canvas context** - Reused across frames
- **Sorted rendering** - Only sorted for draw order, not physics

---

## Demo

Visit `/tests/fish-school` to see the simulation in action.

- Move mouse to scatter the fish
- Click the ⚙ button to open the control panel
- Adjust sliders to modify behavior in real-time
