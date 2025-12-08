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
  interactiveSize: '100%',
  quadrant: 'center',
  opacity: 1
})

const interactiveRef = ref<HTMLDivElement | null>(null)
let curX = 0
let curY = 0
let tgX = 0
let tgY = 0
let animationId: number | null = null

function move() {
  curX += (tgX - curX) / 20
  curY += (tgY - curY) / 20
  
  if (interactiveRef.value) {
    interactiveRef.value.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
  }
  
  animationId = requestAnimationFrame(move)
}

function handleMouseMove(event: MouseEvent) {
  tgX = event.clientX
  tgY = event.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  move()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
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
  '--color-interactive': props.colors.interactive,
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
      <div class="g1"></div>
      <div class="g2"></div>
      <div class="g3"></div>
      <div class="g4"></div>
      <div class="g5"></div>
      <div ref="interactiveRef" class="interactive"></div>
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
    circle at center, 
    rgba(var(--color-interactive), 0.8) 0, 
    rgba(var(--color-interactive), 0) 50%
  ) no-repeat;
  mix-blend-mode: var(--blending);
  width: var(--interactive-size);
  height: var(--interactive-size);
  top: calc(-1 * var(--interactive-size) / 2);
  left: calc(-1 * var(--interactive-size) / 2);
  opacity: 0.7;
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

