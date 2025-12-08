<script setup lang="ts">
interface Props {
  colors?: {
    bg1?: string
    bg2?: string
    color1?: string
    color2?: string
    color3?: string
    color4?: string
    color5?: string
    interactive?: string
  }
  circleSize?: string
  blendMode?: string
  blurAmount?: number
  interactiveSize?: string
  quadrant?: 'center' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  opacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ({
    bg1: 'rgb(108, 0, 162)',
    bg2: 'rgb(0, 17, 82)',
    color1: '18, 113, 255',
    color2: '221, 74, 255',
    color3: '100, 220, 255',
    color4: '200, 50, 50',
    color5: '180, 180, 50',
    interactive: '140, 100, 255'
  }),
  circleSize: '80%',
  blendMode: 'hard-light',
  blurAmount: 40,
  interactiveSize: '20%',
  quadrant: 'center',
  opacity: 1
})

const interactiveRef = ref<HTMLDivElement | null>(null)
const g1Ref = ref<HTMLDivElement | null>(null)
const g2Ref = ref<HTMLDivElement | null>(null)
const g3Ref = ref<HTMLDivElement | null>(null)
const g4Ref = ref<HTMLDivElement | null>(null)
const g5Ref = ref<HTMLDivElement | null>(null)

// Position state
let curX = 0
let curY = 0
let tgX = 0
let tgY = 0
let animationId: number | null = null

// Attachment state
const isAttached = ref(false)

// Shadow color (inherits from nearest blob when attaching)
const shadowColor = ref(props.colors.interactive || '140, 100, 255')

// Floating position (when not attached)
let floatX = 0
let floatY = 0
let floatAngle = 0

// Track if mouse was in zone last frame (for toggle detection)
let wasInZone = false

// Find nearest blob and return its color
function getNearestBlobColor(mouseX: number, mouseY: number): string {
  const blobs = [
    { ref: g1Ref.value, color: props.colors.color1 },
    { ref: g2Ref.value, color: props.colors.color2 },
    { ref: g3Ref.value, color: props.colors.color3 },
    { ref: g4Ref.value, color: props.colors.color4 },
    { ref: g5Ref.value, color: props.colors.color5 },
  ]
  
  let nearestColor = props.colors.interactive || '140, 100, 255'
  let minDistance = Infinity
  
  for (const blob of blobs) {
    if (!blob.ref || !blob.color) continue
    const rect = blob.ref.getBoundingClientRect()
    const blobCenterX = rect.left + rect.width / 2
    const blobCenterY = rect.top + rect.height / 2
    
    const distance = Math.sqrt(
      Math.pow(mouseX - blobCenterX, 2) + 
      Math.pow(mouseY - blobCenterY, 2)
    )
    
    if (distance < minDistance) {
      minDistance = distance
      nearestColor = blob.color
    }
  }
  
  return nearestColor
}

function isMouseInBlobZone(mouseX: number, mouseY: number): boolean {
  const w = window.innerWidth
  const h = window.innerHeight
  
  // Define blob zone based on quadrant
  let zoneX = 0
  let zoneY = 0
  let zoneW = w
  let zoneH = h
  
  switch (props.quadrant) {
    case 'bottom-left':
      zoneX = 0
      zoneY = h * 0.4
      zoneW = w * 0.5
      zoneH = h * 0.6
      break
    case 'bottom-right':
      zoneX = w * 0.5
      zoneY = h * 0.4
      zoneW = w * 0.5
      zoneH = h * 0.6
      break
    case 'top-left':
      zoneX = 0
      zoneY = 0
      zoneW = w * 0.5
      zoneH = h * 0.6
      break
    case 'top-right':
      zoneX = w * 0.5
      zoneY = 0
      zoneW = w * 0.5
      zoneH = h * 0.6
      break
    case 'center':
    default:
      zoneX = w * 0.2
      zoneY = h * 0.2
      zoneW = w * 0.6
      zoneH = h * 0.6
      break
  }
  
  return mouseX >= zoneX && mouseX <= zoneX + zoneW &&
         mouseY >= zoneY && mouseY <= zoneY + zoneH
}

function move() {
  if (isAttached.value) {
    // Follow cursor with easing
    curX += (tgX - curX) / 20
    curY += (tgY - curY) / 20
  } else {
    // Float animation when not attached
    floatAngle += 0.008
    const floatRadius = 80
    const basePosX = window.innerWidth * 0.25
    const basePosY = window.innerHeight * 0.65
    
    floatX = basePosX + Math.sin(floatAngle) * floatRadius + Math.sin(floatAngle * 1.3) * 30
    floatY = basePosY + Math.cos(floatAngle * 0.7) * floatRadius * 0.8 + Math.cos(floatAngle * 1.1) * 20
    
    // Smoothly transition to float position
    curX += (floatX - curX) / 30
    curY += (floatY - curY) / 30
  }
  
  if (interactiveRef.value) {
    interactiveRef.value.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
  }
  
  animationId = requestAnimationFrame(move)
}

function handleMouseMove(event: MouseEvent) {
  const inZone = isMouseInBlobZone(event.clientX, event.clientY)
  
  // Toggle on entering the blob zone
  if (inZone && !wasInZone) {
    if (!isAttached.value) {
      // Attaching - get color from nearest blob
      shadowColor.value = getNearestBlobColor(event.clientX, event.clientY)
    }
    // Toggle attachment
    isAttached.value = !isAttached.value
  }
  
  wasInZone = inZone
  tgX = event.clientX
  tgY = event.clientY
}

function handleMouseLeave() {
  // Detach when mouse leaves the browser window
  if (isAttached.value) {
    isAttached.value = false
  }
}

onMounted(() => {
  // Initialize float position
  floatX = window.innerWidth * 0.25
  floatY = window.innerHeight * 0.65
  curX = floatX
  curY = floatY
  
  window.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
  move()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

const cssVars = computed(() => ({
  '--color-bg1': props.colors.bg1,
  '--color-bg2': props.colors.bg2,
  '--color1': props.colors.color1,
  '--color2': props.colors.color2,
  '--color3': props.colors.color3,
  '--color4': props.colors.color4,
  '--color5': props.colors.color5,
  '--color-interactive': shadowColor.value,
  '--circle-size': props.circleSize,
  '--blending': props.blendMode,
  '--blur-amount': `${props.blurAmount}px`,
  '--interactive-size': props.interactiveSize,
  '--gradient-opacity': props.opacity
}))
</script>

<template>
  <div class="morphing-gradient" :class="`quadrant-${quadrant}`" :style="cssVars">
    <!-- SVG Filter for goo/morphing effect -->
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" 
            result="goo" 
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>

    <!-- Gradient blobs container -->
    <div class="gradients-container">
      <div ref="g1Ref" class="g1"></div>
      <div ref="g2Ref" class="g2"></div>
      <div ref="g3Ref" class="g3"></div>
      <div ref="g4Ref" class="g4"></div>
      <div ref="g5Ref" class="g5"></div>
      <div ref="interactiveRef" class="interactive" :class="{ 'is-attached': isAttached }"></div>
    </div>

    <!-- Content slot -->
    <div class="content-layer">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes moveInCircle {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moveVertical {
  0% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(-50%);
  }
}

@keyframes moveHorizontal {
  0% {
    transform: translateX(-50%) translateY(-10%);
  }
  50% {
    transform: translateX(50%) translateY(10%);
  }
  100% {
    transform: translateX(-50%) translateY(-10%);
  }
}

@keyframes morphBlob {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  25% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  50% {
    border-radius: 50% 60% 30% 60% / 30% 40% 70% 50%;
  }
  75% {
    border-radius: 40% 30% 60% 50% / 70% 50% 40% 60%;
  }
}

.morphing-gradient {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
}

.morphing-gradient svg {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}

.gradients-container {
  filter: url(#goo) blur(var(--blur-amount));
  width: 100%;
  height: 100%;
  opacity: var(--gradient-opacity);
}

.g1 {
  position: absolute;
  background: radial-gradient(
    circle at center, 
    rgba(var(--color1), 0.8) 0, 
    rgba(var(--color1), 0) 50%
  ) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: center center;
  animation: moveVertical 30s ease infinite;
  opacity: 1;
}

.g2 {
  position: absolute;
  background: radial-gradient(
    circle at center, 
    rgba(var(--color2), 0.8) 0, 
    rgba(var(--color2), 0) 50%
  ) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: calc(50% - 400px);
  animation: moveInCircle 20s reverse infinite;
  opacity: 1;
}

.g3 {
  position: absolute;
  background: radial-gradient(
    circle at center, 
    rgba(var(--color3), 0.8) 0, 
    rgba(var(--color3), 0) 50%
  ) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2 + 200px);
  left: calc(50% - var(--circle-size) / 2 - 500px);
  transform-origin: calc(50% + 400px);
  animation: moveInCircle 40s linear infinite;
  opacity: 1;
}

.g4 {
  position: absolute;
  background: radial-gradient(
    circle at center, 
    rgba(var(--color4), 0.8) 0, 
    rgba(var(--color4), 0) 50%
  ) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--circle-size);
  height: var(--circle-size);
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: calc(50% - 200px);
  animation: moveHorizontal 40s ease infinite;
  opacity: 0.7;
}

.g5 {
  position: absolute;
  background: radial-gradient(
    circle at center, 
    rgba(var(--color5), 0.8) 0, 
    rgba(var(--color5), 0) 50%
  ) no-repeat;
  mix-blend-mode: var(--blending);
  width: calc(var(--circle-size) * 2);
  height: calc(var(--circle-size) * 2);
  top: calc(50% - var(--circle-size));
  left: calc(50% - var(--circle-size));
  transform-origin: calc(50% - 800px) calc(50% + 200px);
  animation: moveInCircle 20s ease infinite;
  opacity: 1;
}

.interactive {
  position: absolute;
  background: radial-gradient(
    ellipse at 40% 40%, 
    rgba(var(--color-interactive), 0.9) 0%, 
    rgba(var(--color-interactive), 0.6) 30%,
    rgba(var(--color-interactive), 0) 70%
  ) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--interactive-size);
  height: var(--interactive-size);
  top: calc(-1 * var(--interactive-size) / 2);
  left: calc(-1 * var(--interactive-size) / 2);
  opacity: 0.5;
  transition: opacity 0.4s ease;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: morphBlob 15s ease-in-out infinite;
}

.interactive.is-attached {
  opacity: 0.85;
  animation: morphBlob 8s ease-in-out infinite;
}

.content-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Bottom-left quadrant positioning */
.quadrant-bottom-left .g1 {
  top: calc(70% - var(--circle-size) / 2);
  left: calc(20% - var(--circle-size) / 2);
}

.quadrant-bottom-left .g2 {
  top: calc(60% - var(--circle-size) / 2);
  left: calc(30% - var(--circle-size) / 2);
  transform-origin: calc(50% - 200px);
}

.quadrant-bottom-left .g3 {
  top: calc(80% - var(--circle-size) / 2);
  left: calc(10% - var(--circle-size) / 2);
  transform-origin: calc(50% + 200px);
}

.quadrant-bottom-left .g4 {
  top: calc(65% - var(--circle-size) / 2);
  left: calc(25% - var(--circle-size) / 2);
  transform-origin: calc(50% - 100px);
}

.quadrant-bottom-left .g5 {
  top: calc(75% - var(--circle-size));
  left: calc(15% - var(--circle-size));
  transform-origin: calc(50% - 400px) calc(50% + 100px);
}

/* Bottom-right quadrant positioning */
.quadrant-bottom-right .g1 {
  top: calc(70% - var(--circle-size) / 2);
  left: calc(80% - var(--circle-size) / 2);
}

.quadrant-bottom-right .g2 {
  top: calc(60% - var(--circle-size) / 2);
  left: calc(70% - var(--circle-size) / 2);
}

.quadrant-bottom-right .g3 {
  top: calc(80% - var(--circle-size) / 2);
  left: calc(90% - var(--circle-size) / 2);
}

.quadrant-bottom-right .g4 {
  top: calc(65% - var(--circle-size) / 2);
  left: calc(75% - var(--circle-size) / 2);
}

.quadrant-bottom-right .g5 {
  top: calc(75% - var(--circle-size));
  left: calc(85% - var(--circle-size));
}

/* Top-left quadrant positioning */
.quadrant-top-left .g1 {
  top: calc(30% - var(--circle-size) / 2);
  left: calc(20% - var(--circle-size) / 2);
}

.quadrant-top-left .g2 {
  top: calc(20% - var(--circle-size) / 2);
  left: calc(30% - var(--circle-size) / 2);
}

.quadrant-top-left .g3 {
  top: calc(40% - var(--circle-size) / 2);
  left: calc(10% - var(--circle-size) / 2);
}

.quadrant-top-left .g4 {
  top: calc(25% - var(--circle-size) / 2);
  left: calc(25% - var(--circle-size) / 2);
}

.quadrant-top-left .g5 {
  top: calc(35% - var(--circle-size));
  left: calc(15% - var(--circle-size));
}

/* Top-right quadrant positioning */
.quadrant-top-right .g1 {
  top: calc(30% - var(--circle-size) / 2);
  left: calc(80% - var(--circle-size) / 2);
}

.quadrant-top-right .g2 {
  top: calc(20% - var(--circle-size) / 2);
  left: calc(70% - var(--circle-size) / 2);
}

.quadrant-top-right .g3 {
  top: calc(40% - var(--circle-size) / 2);
  left: calc(90% - var(--circle-size) / 2);
}

.quadrant-top-right .g4 {
  top: calc(25% - var(--circle-size) / 2);
  left: calc(75% - var(--circle-size) / 2);
}

.quadrant-top-right .g5 {
  top: calc(35% - var(--circle-size));
  left: calc(85% - var(--circle-size));
}
</style>

