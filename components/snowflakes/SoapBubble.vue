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
import { onMounted, onUnmounted, watch } from 'vue'
import { useLoop } from '@tresjs/core'

interface Props {
  backgroundColor?: string
  bubbleSize?: number
  wobbleIntensity?: number
  speed?: number
  iridescenceIntensity?: number
  enableMouseInteraction?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  backgroundColor: '#fafafa',
  bubbleSize: 0.35,
  wobbleIntensity: 0.5,
  speed: 0.3,
  iridescenceIntensity: 0.15,
  enableMouseInteraction: true,
})

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
uniform float uBubbleSize;
uniform float uWobbleIntensity;
uniform float uIridescenceIntensity;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uBackgroundColor;
uniform bool uEnableMouseInteraction;

// Simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Organic bubble shape with wobble
float bubbleShape(vec2 uv, vec2 center, float size, float time, float wobble) {
  vec2 diff = uv - center;
  float angle = atan(diff.y, diff.x);
  float dist = length(diff);
  
  // Multiple frequencies of wobble for organic feel
  float wobbleAmount = 0.0;
  wobbleAmount += sin(angle * 2.0 + time * 1.2) * 0.03;
  wobbleAmount += sin(angle * 3.0 - time * 0.8) * 0.02;
  wobbleAmount += sin(angle * 5.0 + time * 1.5) * 0.015;
  wobbleAmount += snoise(vec2(angle * 2.0, time * 0.5)) * 0.025;
  
  wobbleAmount *= wobble;
  
  float radius = size + wobbleAmount;
  return smoothstep(radius + 0.008, radius - 0.002, dist);
}

// Thin film iridescence (simplified)
vec3 thinFilmColor(float angle, float thickness) {
  // Simulate interference patterns - subtle warm tones
  float phase = thickness * 6.28318 + angle * 2.0;
  
  vec3 color = vec3(1.0);
  // Very subtle yellow/gold shift
  color.r += sin(phase) * 0.08;
  color.g += sin(phase + 0.5) * 0.06;
  color.b += sin(phase + 1.0) * 0.02;
  
  return color;
}

void main() {
  vec2 uv = vUv;
  float aspectRatio = uResolution.x / uResolution.y;
  
  // Center and aspect correct
  vec2 centeredUv = uv - 0.5;
  centeredUv.x *= aspectRatio;
  
  float time = uTime * uSpeed;
  
  // Bubble center with gentle floating motion
  vec2 bubbleCenter = vec2(0.0);
  bubbleCenter.x += sin(time * 0.7) * 0.05;
  bubbleCenter.y += cos(time * 0.5) * 0.04 + sin(time * 0.3) * 0.02;
  
  // Mouse interaction - bubble gently moves away
  if (uEnableMouseInteraction) {
    vec2 mouse = uMouse / uResolution;
    mouse = (mouse - 0.5);
    mouse.x *= aspectRatio;
    vec2 toMouse = bubbleCenter - mouse;
    float mouseDist = length(toMouse);
    if (mouseDist < 0.5) {
      bubbleCenter += normalize(toMouse) * (0.5 - mouseDist) * 0.1;
    }
  }
  
  // Get bubble mask
  float bubble = bubbleShape(centeredUv, bubbleCenter, uBubbleSize, time, uWobbleIntensity);
  
  // Calculate distance and angle from bubble center for effects
  vec2 toBubbleCenter = centeredUv - bubbleCenter;
  float distFromCenter = length(toBubbleCenter);
  float normalizedDist = distFromCenter / uBubbleSize;
  float angle = atan(toBubbleCenter.y, toBubbleCenter.x);
  
  // Fresnel-like edge effect (brighter at edges)
  float fresnel = pow(normalizedDist, 2.0);
  fresnel = clamp(fresnel, 0.0, 1.0);
  
  // Thin film interference - subtle iridescence
  float filmThickness = normalizedDist + time * 0.2 + snoise(toBubbleCenter * 3.0 + time * 0.3) * 0.3;
  vec3 iridescence = thinFilmColor(angle, filmThickness);
  
  // Specular highlight (main light source - top right)
  vec2 lightDir = normalize(vec2(0.5, 0.6));
  vec2 normalDir = normalize(toBubbleCenter);
  float specular = max(0.0, dot(-normalDir, lightDir));
  specular = pow(specular, 8.0) * 0.6;
  
  // Secondary softer highlight (fill light)
  vec2 lightDir2 = normalize(vec2(-0.3, 0.4));
  float specular2 = max(0.0, dot(-normalDir, lightDir2));
  specular2 = pow(specular2, 12.0) * 0.25;
  
  // Subtle yellow tint in highlights
  vec3 highlightColor = vec3(1.0, 0.98, 0.92);
  
  // Build bubble color
  vec3 bubbleColor = vec3(1.0); // Pure white base
  
  // Add very subtle iridescence
  bubbleColor = mix(bubbleColor, iridescence, uIridescenceIntensity * (1.0 - normalizedDist * 0.5));
  
  // Edge darkening (very subtle, like real soap bubble)
  float edgeDark = smoothstep(0.7, 1.0, normalizedDist) * 0.08;
  bubbleColor -= edgeDark;
  
  // Add specular highlights with warm tint
  bubbleColor += highlightColor * specular;
  bubbleColor += highlightColor * specular2;
  
  // Subtle fresnel glow at edges
  bubbleColor += vec3(1.0, 0.99, 0.95) * fresnel * 0.15 * bubble;
  
  // Very subtle inner shadow/depth
  float innerShadow = smoothstep(0.0, 0.4, normalizedDist) * 0.03;
  bubbleColor -= innerShadow;
  
  // Background
  vec3 bgColor = uBackgroundColor;
  
  // Soft shadow under bubble
  float shadowDist = length(centeredUv - bubbleCenter - vec2(0.02, -0.03));
  float shadow = smoothstep(uBubbleSize + 0.1, uBubbleSize - 0.05, shadowDist) * 0.06;
  bgColor -= shadow;
  
  // Composite
  vec3 finalColor = mix(bgColor, bubbleColor, bubble);
  
  // Very subtle grain for organic feel
  float grain = snoise(vUv * 500.0 + time) * 0.008;
  finalColor += grain;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`

const [br, bg, bb] = hexToRgb(props.backgroundColor)

const uniforms = {
  uTime: { value: 0 },
  uSpeed: { value: props.speed },
  uBubbleSize: { value: props.bubbleSize },
  uWobbleIntensity: { value: props.wobbleIntensity },
  uIridescenceIntensity: { value: props.iridescenceIntensity },
  uResolution: { value: new Vector2(1, 1) },
  uMouse: { value: new Vector2(0, 0) },
  uBackgroundColor: { value: [br, bg, bb] },
  uEnableMouseInteraction: { value: props.enableMouseInteraction },
}

watch(() => props.speed, (val) => { uniforms.uSpeed.value = val })
watch(() => props.bubbleSize, (val) => { uniforms.uBubbleSize.value = val })
watch(() => props.wobbleIntensity, (val) => { uniforms.uWobbleIntensity.value = val })
watch(() => props.iridescenceIntensity, (val) => { uniforms.uIridescenceIntensity.value = val })
watch(() => props.backgroundColor, (val) => {
  const [r, g, b] = hexToRgb(val)
  uniforms.uBackgroundColor.value = [r, g, b]
})

const targetMouse = new Vector2(0, 0)

const { onRender } = useLoop()

onRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed
  uniforms.uMouse.value.lerp(targetMouse, 0.05)
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

