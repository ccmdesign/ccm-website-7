import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'
import type { Fish, FishConfig, Vector2D } from './types'
import { vec } from './utils'

export function useFishSimulation(
  canvasRef: Ref<HTMLCanvasElement | null>,
  config: Ref<FishConfig>,
  mousePos: Ref<Vector2D | null>
) {
  const fish = ref<Fish[]>([])
  let animationId: number | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let resizeObserver: ResizeObserver | null = null

  // School center for regrouping
  let schoolCenter: Vector2D = { x: 0, y: 0 }

  // Smoothing constants
  const VELOCITY_SMOOTHING = 0.08 // How fast velocity catches up to target (lower = smoother)
  const ANGLE_SMOOTHING = 0.1 // How fast rotation catches up (lower = smoother)
  const MAX_ACCELERATION = 0.15 // Maximum velocity change per frame

  // Lerp helper for smooth interpolation
  function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  // Lerp angle with wrapping (handles -PI to PI correctly)
  function lerpAngle(a: number, b: number, t: number): number {
    let diff = b - a
    // Wrap difference to -PI to PI
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2
    return a + diff * t
  }

  // Initialize fish as a tight cluster
  function initializeFish(count: number, width: number, height: number) {
    const newFish: Fish[] = []
    const centerX = width / 2
    const centerY = height / 2
    const clusterRadius = 100

    // Set initial school direction
    const angle = Math.random() * Math.PI * 2
    const schoolDir = { x: Math.cos(angle), y: Math.sin(angle) }

    for (let i = 0; i < count; i++) {
      const spawnAngle = Math.random() * Math.PI * 2
      const spawnRadius = Math.random() * clusterRadius
      const baseSpeed = 1.5
      const initialVel = {
        x: schoolDir.x * baseSpeed + (Math.random() - 0.5) * 0.3,
        y: schoolDir.y * baseSpeed + (Math.random() - 0.5) * 0.3,
      }

      newFish.push({
        position: {
          x: centerX + Math.cos(spawnAngle) * spawnRadius,
          y: centerY + Math.sin(spawnAngle) * spawnRadius,
        },
        velocity: { ...initialVel },
        targetVelocity: { ...initialVel },
        smoothedAngle: Math.atan2(initialVel.y, initialVel.x),
        depth: Math.random(),
      })
    }
    fish.value = newFish
    schoolCenter = { x: centerX, y: centerY }
  }

  function getNeighbors(currentFish: Fish, allFish: Fish[], radius: number): Fish[] {
    return allFish.filter((other) => {
      if (other === currentFish) return false
      return vec.dist(currentFish.position, other.position) < radius
    })
  }

  // Buffer zone collision - smooth sideways push
  function collision(currentFish: Fish, allFish: Fish[]): Vector2D {
    const fishRadius = 20
    const bufferZone = 45
    const hardBuffer = fishRadius * 2
    let steer: Vector2D = { x: 0, y: 0 }

    for (const other of allFish) {
      if (other === currentFish) continue
      const d = vec.dist(currentFish.position, other.position)

      if (d < bufferZone && d > 0) {
        const away = vec.normalize(vec.sub(currentFish.position, other.position))
        const speed = vec.mag(currentFish.velocity)
        const currentDir = speed > 0.01 ? vec.normalize(currentFish.velocity) : away

        // Perpendicular direction for smooth sliding
        const perpendicular: Vector2D = { x: -currentDir.y, y: currentDir.x }
        const cross = away.x * currentDir.y - away.y * currentDir.x
        const sideDir = cross > 0 ? perpendicular : vec.mult(perpendicular, -1)

        const proximityFactor = 1 - (d / bufferZone)

        if (d < hardBuffer) {
          // Emergency push - but still smooth
          const strength = ((hardBuffer - d) / hardBuffer) * 0.8
          steer = vec.add(steer, vec.mult(away, strength))
        } else {
          // Gentle sideways slide
          const blendedDir = vec.add(
            vec.mult(away, 0.3),
            vec.mult(sideDir, 0.7)
          )
          const normalized = vec.normalize(blendedDir)
          const strength = proximityFactor * proximityFactor * 0.4
          steer = vec.add(steer, vec.mult(normalized, strength))
        }
      }
    }
    return steer
  }

  // Soft separation
  function separation(currentFish: Fish, neighbors: Fish[]): Vector2D {
    if (neighbors.length === 0) return { x: 0, y: 0 }

    const preferredDistance = 55
    let steer: Vector2D = { x: 0, y: 0 }
    let count = 0

    for (const other of neighbors) {
      const d = vec.dist(currentFish.position, other.position)
      if (d < preferredDistance && d > 0) {
        const diff = vec.sub(currentFish.position, other.position)
        const normalized = vec.normalize(diff)
        const t = (preferredDistance - d) / preferredDistance
        const strength = t * t * 0.3
        steer = vec.add(steer, vec.mult(normalized, strength))
        count++
      }
    }

    if (count > 0) {
      steer = vec.div(steer, count)
    }
    return steer
  }

  // Alignment - match velocity with neighbors
  function alignment(currentFish: Fish, neighbors: Fish[]): Vector2D {
    if (neighbors.length === 0) return { x: 0, y: 0 }

    let avgVelocity: Vector2D = { x: 0, y: 0 }
    for (const other of neighbors) {
      avgVelocity = vec.add(avgVelocity, other.velocity)
    }
    avgVelocity = vec.div(avgVelocity, neighbors.length)

    const steer = vec.sub(avgVelocity, currentFish.velocity)
    return vec.limit(steer, 0.06)
  }

  // Cohesion - pull toward neighbors
  function cohesion(currentFish: Fish, neighbors: Fish[]): Vector2D {
    if (neighbors.length === 0) return { x: 0, y: 0 }

    let centerOfMass: Vector2D = { x: 0, y: 0 }
    for (const other of neighbors) {
      centerOfMass = vec.add(centerOfMass, other.position)
    }
    centerOfMass = vec.div(centerOfMass, neighbors.length)

    const direction = vec.sub(centerOfMass, currentFish.position)
    const distance = vec.mag(direction)

    if (distance < 1) return { x: 0, y: 0 }

    const strength = Math.min(distance / 80, 1) * 0.08
    return vec.mult(vec.normalize(direction), strength)
  }

  // Return to school center
  function returnToSchool(currentFish: Fish): Vector2D {
    const distToCenter = vec.dist(currentFish.position, schoolCenter)
    const maxSchoolRadius = 180

    if (distToCenter < maxSchoolRadius) return { x: 0, y: 0 }

    const direction = vec.sub(schoolCenter, currentFish.position)
    const strength = ((distToCenter - maxSchoolRadius) / maxSchoolRadius) * 0.15
    return vec.mult(vec.normalize(direction), Math.min(strength, 0.3))
  }

  // Mouse avoidance
  function avoidance(currentFish: Fish, mouse: Vector2D | null, fleeRadius: number): Vector2D {
    if (!mouse) return { x: 0, y: 0 }

    const distance = vec.dist(currentFish.position, mouse)
    if (distance > fleeRadius) return { x: 0, y: 0 }

    const fleeDirection = vec.sub(currentFish.position, mouse)
    const normalized = vec.normalize(fleeDirection)
    const t = (fleeRadius - distance) / fleeRadius
    const strength = t * t * 1.5
    return vec.mult(normalized, strength)
  }

  // Boundary steering
  function boundarySteer(currentFish: Fish, width: number, height: number): Vector2D {
    const margin = 120
    let steer: Vector2D = { x: 0, y: 0 }
    const turnForce = 0.08

    if (currentFish.position.x < margin) {
      const t = 1 - currentFish.position.x / margin
      steer.x = turnForce * t * t
    } else if (currentFish.position.x > width - margin) {
      const t = 1 - (width - currentFish.position.x) / margin
      steer.x = -turnForce * t * t
    }

    if (currentFish.position.y < margin) {
      const t = 1 - currentFish.position.y / margin
      steer.y = turnForce * t * t
    } else if (currentFish.position.y > height - margin) {
      const t = 1 - (height - currentFish.position.y) / margin
      steer.y = -turnForce * t * t
    }

    return steer
  }

  function update() {
    const canvas = canvasRef.value
    if (!canvas || !ctx) return

    const { width, height } = canvas
    const cfg = config.value

    // Calculate school center (smoothed)
    let totalPos: Vector2D = { x: 0, y: 0 }
    for (const f of fish.value) {
      totalPos = vec.add(totalPos, f.position)
    }
    const newCenter = vec.div(totalPos, fish.value.length)
    schoolCenter = {
      x: lerp(schoolCenter.x, newCenter.x, 0.1),
      y: lerp(schoolCenter.y, newCenter.y, 0.1),
    }

    // Update each fish
    for (const f of fish.value) {
      const neighbors = getNeighbors(f, fish.value, cfg.perceptionRadius)

      // Calculate all forces
      const col = vec.mult(collision(f, fish.value), 1.5)
      const sep = vec.mult(separation(f, neighbors), cfg.separationWeight)
      const ali = vec.mult(alignment(f, neighbors), cfg.alignmentWeight * 1.2)
      const coh = vec.mult(cohesion(f, neighbors), cfg.cohesionWeight * 1.5)
      const regroup = returnToSchool(f)
      const avoid = vec.mult(avoidance(f, mousePos.value, cfg.fleeRadius), cfg.fleeStrength)
      const boundary = boundarySteer(f, width, height)

      // Sum all forces into acceleration
      let acceleration: Vector2D = { x: 0, y: 0 }
      acceleration = vec.add(acceleration, col)
      acceleration = vec.add(acceleration, sep)
      acceleration = vec.add(acceleration, ali)
      acceleration = vec.add(acceleration, coh)
      acceleration = vec.add(acceleration, regroup)
      acceleration = vec.add(acceleration, avoid)
      acceleration = vec.add(acceleration, boundary)

      // Limit acceleration for smooth movement
      acceleration = vec.limit(acceleration, MAX_ACCELERATION)

      // Calculate target velocity
      f.targetVelocity = vec.add(f.velocity, acceleration)

      // Enforce speed limits on target
      const targetSpeed = vec.mag(f.targetVelocity)
      const minSpeed = cfg.maxSpeed * 0.35
      if (targetSpeed < minSpeed && targetSpeed > 0) {
        f.targetVelocity = vec.mult(vec.normalize(f.targetVelocity), minSpeed)
      }
      f.targetVelocity = vec.limit(f.targetVelocity, cfg.maxSpeed)

      // Smoothly interpolate velocity toward target
      f.velocity = {
        x: lerp(f.velocity.x, f.targetVelocity.x, VELOCITY_SMOOTHING),
        y: lerp(f.velocity.y, f.targetVelocity.y, VELOCITY_SMOOTHING),
      }

      // Update position
      f.position = vec.add(f.position, f.velocity)

      // Smooth angle for rendering
      const targetAngle = Math.atan2(f.velocity.y, f.velocity.x)
      f.smoothedAngle = lerpAngle(f.smoothedAngle, targetAngle, ANGLE_SMOOTHING)

      // Soft boundary clamp
      f.position.x = Math.max(10, Math.min(width - 10, f.position.x))
      f.position.y = Math.max(10, Math.min(height - 10, f.position.y))
    }
  }

  function drawFish(f: Fish) {
    if (!ctx) return

    const baseSize = 16
    const sizeMultiplier = 0.5 + f.depth * 0.5
    const size = baseSize * sizeMultiplier
    const opacity = 0.4 + f.depth * 0.6

    ctx.save()
    ctx.translate(f.position.x, f.position.y)
    ctx.rotate(f.smoothedAngle) // Use smoothed angle

    // Teardrop shape
    ctx.beginPath()
    ctx.moveTo(size, 0)
    ctx.bezierCurveTo(size * 0.5, size * 0.3, -size * 0.6, size * 0.3, -size, 0)
    ctx.bezierCurveTo(-size * 0.6, -size * 0.3, size * 0.5, -size * 0.3, size, 0)

    ctx.fillStyle = `rgba(100, 150, 200, ${opacity})`
    ctx.fill()
    ctx.restore()
  }

  function render() {
    const canvas = canvasRef.value
    if (!canvas || !ctx) return

    ctx.fillStyle = '#0a1628'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const sortedFish = [...fish.value].sort((a, b) => a.depth - b.depth)

    for (const f of sortedFish) {
      drawFish(f)
    }
  }

  function animate() {
    update()
    render()
    animationId = requestAnimationFrame(animate)
  }

  function start() {
    const canvas = canvasRef.value
    if (!canvas) return

    ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    initializeFish(config.value.fishCount, canvas.width, canvas.height)
    animate()
  }

  function stop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  function resize() {
    const canvas = canvasRef.value
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }

  watch(
    () => config.value.fishCount,
    (newCount) => {
      const canvas = canvasRef.value
      if (canvas) {
        initializeFish(newCount, canvas.width, canvas.height)
      }
    }
  )

  onMounted(() => {
    // Delay start to ensure CSS layout is complete
    // Using double-rAF to wait for both layout and paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        start()

        // Set up ResizeObserver for reliable size tracking
        const canvas = canvasRef.value
        if (canvas) {
          resizeObserver = new ResizeObserver(() => {
            resize()
          })
          resizeObserver.observe(canvas)
        }
      })
    })
  })

  onUnmounted(() => {
    stop()
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  })

  return {
    fish,
    start,
    stop,
    resize,
  }
}
