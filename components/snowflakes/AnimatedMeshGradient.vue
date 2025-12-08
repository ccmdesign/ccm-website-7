<template>
  <TresMesh>
    <TresPlaneGeometry :args="[2, 2]" />
    <TresShaderMaterial
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
      :uniforms="uniforms"
    />
  </TresMesh>
</template>

<script setup lang="ts">
import { Vector2 } from 'three'
import { onMounted, onUnmounted } from 'vue'
import { useLoop } from '@tresjs/core'

interface Props {
  colorPrimary?: string
  colorSecondary?: string
  colorBackground?: string
  speed?: number
  enableMouseInteraction?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  colorPrimary: '#023047',
  colorSecondary: '#f3e500',
  colorBackground: '#ffffff',
  speed: 0.3,
  enableMouseInteraction: true,
})

// Convert hex to RGB (0-1 range)
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.substring(0, 2), 16) / 255,
    parseInt(clean.substring(2, 4), 16) / 255,
    parseInt(clean.substring(4, 6), 16) / 255,
  ]
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;
uniform vec3 uColorBackground;
uniform bool uEnableMouseInteraction;

// Smooth noise for organic shapes
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Soft, rounded metaball-style blob
float blob(vec2 uv, vec2 center, float size, float softness) {
  float d = length(uv - center);
  return smoothstep(size + softness, size - softness * 0.5, d);
}

void main() {
  vec2 uv = vUv;
  float aspectRatio = uResolution.x / uResolution.y;
  
  // Correct for aspect ratio
  vec2 aspectUv = uv;
  aspectUv.x *= aspectRatio;
  
  float time = uTime * uSpeed;
  
  // Mouse influence
  vec2 mouseOffset = vec2(0.0);
  if (uEnableMouseInteraction) {
    vec2 mouse = uMouse / uResolution;
    mouse.y = 1.0 - mouse.y;
    mouseOffset = (mouse - 0.5) * 0.15;
  }
  
  // === NAVY BLOB (bottom-left, larger) ===
  vec2 navyCenter = vec2(
    0.15 + sin(time * 1.2) * 0.12 + mouseOffset.x * 0.3,
    0.2 + cos(time * 1.0) * 0.1 + mouseOffset.y * 0.3
  );
  navyCenter.x *= aspectRatio;
  
  // Add organic wobble to the blob shape
  float navyWobble = noise(vec2(time * 1.5, 0.0)) * 0.06;
  float navyBlob = blob(aspectUv, navyCenter, 0.35 + navyWobble, 0.25);
  
  // Secondary navy blob (overlapping)
  vec2 navyCenter2 = vec2(
    0.3 + cos(time * 0.9) * 0.1 + mouseOffset.x * 0.2,
    0.35 + sin(time * 1.1) * 0.08 + mouseOffset.y * 0.2
  );
  navyCenter2.x *= aspectRatio;
  float navyBlob2 = blob(aspectUv, navyCenter2, 0.22 + navyWobble * 0.8, 0.18);
  
  // Combine navy blobs with soft blend
  float navyTotal = max(navyBlob, navyBlob2 * 0.9);
  navyTotal = smoothstep(0.0, 1.0, navyTotal);
  
  // === YELLOW BLOB (overlapping with navy) ===
  vec2 yellowCenter = vec2(
    0.22 + sin(time * 1.3 + 1.0) * 0.1 + mouseOffset.x * 0.25,
    0.28 + cos(time * 1.1 + 0.5) * 0.08 + mouseOffset.y * 0.25
  );
  yellowCenter.x *= aspectRatio;
  
  float yellowWobble = noise(vec2(time * 1.8, 5.0)) * 0.05;
  float yellowBlob = blob(aspectUv, yellowCenter, 0.28 + yellowWobble, 0.2);
  
  // Secondary yellow accent
  vec2 yellowCenter2 = vec2(
    0.4 + cos(time * 1.0 + 2.0) * 0.12 + mouseOffset.x * 0.15,
    0.45 + sin(time * 0.9) * 0.1 + mouseOffset.y * 0.15
  );
  yellowCenter2.x *= aspectRatio;
  float yellowBlob2 = blob(aspectUv, yellowCenter2, 0.15 + yellowWobble, 0.12);
  
  float yellowTotal = max(yellowBlob, yellowBlob2 * 0.85);
  yellowTotal = smoothstep(0.0, 1.0, yellowTotal);
  
  // === COLOR COMPOSITING ===
  vec3 color = uColorBackground;
  
  // Layer yellow (underneath)
  color = mix(color, uColorSecondary, yellowTotal * 0.95);
  
  // Layer navy (on top)
  color = mix(color, uColorPrimary, navyTotal * 0.95);
  
  // Soft blend where they overlap
  float overlap = navyTotal * yellowTotal;
  vec3 blendColor = mix(uColorPrimary, uColorSecondary, 0.5);
  color = mix(color, blendColor, overlap * 0.4);
  
  // Subtle vignette toward edges (keeps focus on bottom-left)
  float vignette = 1.0 - smoothstep(0.3, 1.5, length(aspectUv - vec2(aspectRatio * 0.3, 0.3)));
  color = mix(uColorBackground, color, 0.3 + vignette * 0.7);
  
  gl_FragColor = vec4(color, 1.0);
}
`

const [pr, pg, pb] = hexToRgb(props.colorPrimary)
const [sr, sg, sb] = hexToRgb(props.colorSecondary)
const [br, bg, bb] = hexToRgb(props.colorBackground)

const uniforms = {
  uTime: { value: 0 },
  uSpeed: { value: props.speed },
  uResolution: { value: new Vector2(1, 1) },
  uMouse: { value: new Vector2(0, 0) },
  uEnableMouseInteraction: { value: props.enableMouseInteraction },
  uColorPrimary: { value: [pr, pg, pb] },
  uColorSecondary: { value: [sr, sg, sb] },
  uColorBackground: { value: [br, bg, bb] },
}

const targetMouse = new Vector2(0, 0)

const { onRender } = useLoop()

onRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
  uniforms.uMouse.value.lerp(targetMouse, 0.03)
})

const updateMouse = (e: MouseEvent) => {
  targetMouse.set(e.clientX, e.clientY)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth
    const height = window.innerHeight
    uniforms.uResolution.value.set(width, height)
    targetMouse.set(width / 2, height / 2)
    uniforms.uMouse.value.set(width / 2, height / 2)
    
    window.addEventListener('resize', () => {
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    })
    window.addEventListener('mousemove', updateMouse)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', updateMouse)
  }
})
</script>
