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
  }
  circleSize?: string
  blendMode?: string
  blurAmount?: number
  opacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  colors: () => ({
    bg1: 'rgb(2, 0, 36)',      // Very dark blue/black
    bg2: 'rgb(10, 10, 50)',    // Slightly lighter dark blue
    color1: '18, 113, 255',    // Bright Blue
    color2: '120, 40, 200',    // Purple
    color3: '80, 100, 255',    // Light Indigo
    color4: '40, 20, 100',     // Dark Indigo
    color5: '0, 212, 255',     // Cyan
  }),
  circleSize: '80%',
  blendMode: 'hard-light',
  blurAmount: 40,
  opacity: 1
})

const g1Ref = ref<HTMLDivElement | null>(null)
const g2Ref = ref<HTMLDivElement | null>(null)
const g3Ref = ref<HTMLDivElement | null>(null)
const g4Ref = ref<HTMLDivElement | null>(null)
const g5Ref = ref<HTMLDivElement | null>(null)
const g6Ref = ref<HTMLDivElement | null>(null)
const g7Ref = ref<HTMLDivElement | null>(null)
const g8Ref = ref<HTMLDivElement | null>(null)
const g9Ref = ref<HTMLDivElement | null>(null)
const g10Ref = ref<HTMLDivElement | null>(null)
const g11Ref = ref<HTMLDivElement | null>(null)
const g12Ref = ref<HTMLDivElement | null>(null)

const cssVars = computed(() => ({
  '--color-bg1': props.colors.bg1,
  '--color-bg2': props.colors.bg2,
  '--color1': props.colors.color1,
  '--color2': props.colors.color2,
  '--color3': props.colors.color3,
  '--color4': props.colors.color4,
  '--color5': props.colors.color5,
  '--circle-size': props.circleSize,
  '--blending': props.blendMode,
  '--blur-amount': `${props.blurAmount}px`,
  '--gradient-opacity': props.opacity
}))
</script>

<template>
  <div class="animated-gradient" :style="cssVars">
    <!-- SVG Filter for goo/morphing effect -->
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" 
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
      <div ref="g6Ref" class="g6"></div>
      <div ref="g7Ref" class="g7"></div>
      <div ref="g8Ref" class="g8"></div>
      <div ref="g9Ref" class="g9"></div>
      <div ref="g10Ref" class="g10"></div>
      <div ref="g11Ref" class="g11"></div>
      <div ref="g12Ref" class="g12"></div>
    </div>

    <!-- Content slot -->
    <div class="content-layer">
      <slot />
    </div>
  </div>
</template>

<style scoped>
@keyframes moveInCircle {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}

@keyframes moveVertical {
  0% { transform: translateY(-50%); }
  50% { transform: translateY(50%); }
  100% { transform: translateY(-50%); }
}

@keyframes moveHorizontal {
  0% { transform: translateX(-50%) translateY(-10%); }
  50% { transform: translateX(50%) translateY(10%); }
  100% { transform: translateX(-50%) translateY(-10%); }
}

@keyframes moveDiagonal {
  0% { transform: translate(-30%, -30%) rotate(0deg); }
  50% { transform: translate(30%, 30%) rotate(180deg); }
  100% { transform: translate(-30%, -30%) rotate(360deg); }
}

.animated-gradient {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
}

.animated-gradient svg {
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

div[class^="g"] {
  position: absolute;
  mix-blend-mode: var(--blending);
  opacity: 1;
}

.g1 {
  width: var(--circle-size);
  height: var(--circle-size);
  background: radial-gradient(circle at center, rgba(var(--color1), 0.8) 0, rgba(var(--color1), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  animation: moveVertical 30s ease infinite;
}

.g2 {
  width: var(--circle-size);
  height: var(--circle-size);
  background: radial-gradient(circle at center, rgba(var(--color2), 0.8) 0, rgba(var(--color2), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: calc(50% - 400px);
  animation: moveInCircle 20s reverse infinite;
}

.g3 {
  width: var(--circle-size);
  height: var(--circle-size);
  background: radial-gradient(circle at center, rgba(var(--color3), 0.8) 0, rgba(var(--color3), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) / 2 + 200px);
  left: calc(50% - var(--circle-size) / 2 - 500px);
  transform-origin: calc(50% + 400px);
  animation: moveInCircle 40s linear infinite;
}

.g4 {
  width: var(--circle-size);
  height: var(--circle-size);
  background: radial-gradient(circle at center, rgba(var(--color4), 0.8) 0, rgba(var(--color4), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) / 2);
  left: calc(50% - var(--circle-size) / 2);
  transform-origin: calc(50% - 200px);
  animation: moveHorizontal 40s ease infinite;
  opacity: 0.7;
}

.g5 {
  width: calc(var(--circle-size) * 2);
  height: calc(var(--circle-size) * 2);
  background: radial-gradient(circle at center, rgba(var(--color5), 0.8) 0, rgba(var(--color5), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size));
  left: calc(50% - var(--circle-size));
  transform-origin: calc(50% - 800px) calc(50% + 200px);
  animation: moveInCircle 20s ease infinite;
}

/* New Blobs */
.g6 {
  width: calc(var(--circle-size) * 1.2);
  height: calc(var(--circle-size) * 1.2);
  background: radial-gradient(circle at center, rgba(var(--color1), 0.8) 0, rgba(var(--color1), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) * 0.6);
  left: calc(50% - var(--circle-size) * 0.6);
  transform-origin: calc(50% + 500px) calc(50% + 200px);
  animation: moveInCircle 35s reverse infinite; /* Different speed/direction */
}

.g7 {
  width: calc(var(--circle-size) * 0.8);
  height: calc(var(--circle-size) * 0.8);
  background: radial-gradient(circle at center, rgba(var(--color2), 0.8) 0, rgba(var(--color2), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) * 0.4);
  left: calc(50% - var(--circle-size) * 0.4);
  transform-origin: calc(50% - 300px) calc(50% - 300px);
  animation: moveDiagonal 25s linear infinite; /* New animation type */
}

.g8 {
  width: var(--circle-size);
  height: var(--circle-size);
  background: radial-gradient(circle at center, rgba(var(--color3), 0.8) 0, rgba(var(--color3), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) / 2 + 100px);
  left: calc(50% - var(--circle-size) / 2 - 200px);
  transform-origin: calc(50% - 300px);
  animation: moveInCircle 45s ease-in-out infinite; 
}

.g9 {
  width: calc(var(--circle-size) * 0.6);
  height: calc(var(--circle-size) * 0.6);
  background: radial-gradient(circle at center, rgba(var(--color4), 0.8) 0, rgba(var(--color4), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) * 0.3);
  left: calc(50% - var(--circle-size) * 0.3);
  transform-origin: calc(50% + 600px);
  animation: moveHorizontal 28s ease infinite reverse;
}

.g10 {
  width: calc(var(--circle-size) * 1.5);
  height: calc(var(--circle-size) * 1.5);
  background: radial-gradient(circle at center, rgba(var(--color5), 0.8) 0, rgba(var(--color5), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) * 0.75);
  left: calc(50% - var(--circle-size) * 0.75);
  transform-origin: calc(50% - 200px) calc(50% - 400px);
  animation: moveInCircle 22s ease-out infinite;
}

.g11 {
  width: calc(var(--circle-size) * 0.9);
  height: calc(var(--circle-size) * 0.9);
  background: radial-gradient(circle at center, rgba(var(--color1), 0.6) 0, rgba(var(--color1), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) * 0.45);
  left: calc(50% - var(--circle-size) * 0.45);
  transform-origin: center center;
  animation: moveVertical 18s ease-in-out infinite alternate;
}

.g12 {
  width: calc(var(--circle-size) * 1.1);
  height: calc(var(--circle-size) * 1.1);
  background: radial-gradient(circle at center, rgba(var(--color4), 0.9) 0, rgba(var(--color4), 0) 50%) no-repeat;
  top: calc(50% - var(--circle-size) * 0.55);
  left: calc(50% - var(--circle-size) * 0.55);
  transform-origin: calc(50% + 100px) calc(50% - 500px);
  animation: moveInCircle 26s linear infinite reverse;
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
</style>
