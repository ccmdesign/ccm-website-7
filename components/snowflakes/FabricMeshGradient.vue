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
import { Vector2, Vector3 } from 'three'
import { onMounted, onUnmounted, watch } from 'vue'
import { useLoop } from '@tresjs/core'

interface Props {
  colorPrimary?: string
  colorSecondary?: string
  colorAccent?: string
  speed?: number
  meshIntensity?: number
  lightIntensity?: number
  lightPosition?: { x: number; y: number; z: number }
  enableMouseInteraction?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  colorPrimary: '#1a1a2e',
  colorSecondary: '#16213e',
  colorAccent: '#e94560',
  speed: 0.4,
  meshIntensity: 1.0,
  lightIntensity: 1.2,
  lightPosition: () => ({ x: 0.5, y: 0.5, z: 1.0 }),
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
uniform float uMeshIntensity;
uniform float uLightIntensity;
uniform vec3 uLightPosition;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;
uniform vec3 uColorAccent;
uniform bool uEnableMouseInteraction;

// Simplex-like noise for smooth fabric folds
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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

// Fractal brownian motion for layered fabric texture
float fbm(vec2 p, float time) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  // Layer 1: Large flowing waves (silk-like)
  value += amplitude * snoise(p * frequency + time * 0.3);
  amplitude *= 0.5;
  frequency *= 2.0;
  
  // Layer 2: Medium folds
  value += amplitude * snoise(p * frequency - time * 0.2);
  amplitude *= 0.5;
  frequency *= 2.0;
  
  // Layer 3: Fine wrinkles
  value += amplitude * snoise(p * frequency + time * 0.15);
  amplitude *= 0.5;
  frequency *= 2.0;
  
  // Layer 4: Micro texture
  value += amplitude * snoise(p * frequency - time * 0.1);
  
  return value;
}

// Calculate surface normal from height map
vec3 calculateNormal(vec2 uv, float time, float intensity) {
  float eps = 0.005;
  
  float h = fbm(uv * 3.0, time) * intensity;
  float hx = fbm((uv + vec2(eps, 0.0)) * 3.0, time) * intensity;
  float hy = fbm((uv + vec2(0.0, eps)) * 3.0, time) * intensity;
  
  vec3 normal = normalize(vec3(
    (h - hx) / eps,
    (h - hy) / eps,
    1.0
  ));
  
  return normal;
}

void main() {
  vec2 uv = vUv;
  float aspectRatio = uResolution.x / uResolution.y;
  
  vec2 aspectUv = uv;
  aspectUv.x *= aspectRatio;
  
  float time = uTime * uSpeed;
  
  // Mouse influence on light position
  vec3 lightPos = uLightPosition;
  if (uEnableMouseInteraction) {
    vec2 mouse = uMouse / uResolution;
    mouse.y = 1.0 - mouse.y;
    lightPos.x = mix(lightPos.x, mouse.x, 0.5);
    lightPos.y = mix(lightPos.y, mouse.y, 0.5);
  }
  
  // Generate fabric height and normal
  float height = fbm(aspectUv * 3.0, time) * uMeshIntensity;
  vec3 normal = calculateNormal(aspectUv, time, uMeshIntensity);
  
  // Light direction (from light position to surface)
  vec3 lightDir = normalize(vec3(lightPos.x - uv.x, lightPos.y - uv.y, lightPos.z));
  
  // Diffuse lighting
  float diffuse = max(dot(normal, lightDir), 0.0);
  diffuse = pow(diffuse, 0.8); // Soften the falloff
  
  // Specular highlight (silk sheen)
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float specular = pow(max(dot(normal, halfDir), 0.0), 32.0);
  
  // Ambient occlusion from folds
  float ao = smoothstep(-0.5, 0.5, height) * 0.3 + 0.7;
  
  // Base color gradient using height
  float colorMix = smoothstep(-0.3, 0.3, height);
  vec3 baseColor = mix(uColorPrimary, uColorSecondary, colorMix);
  
  // Add accent color in highlighted areas
  float accentMask = smoothstep(0.6, 0.9, diffuse) * smoothstep(0.2, 0.5, height);
  baseColor = mix(baseColor, uColorAccent, accentMask * 0.4);
  
  // Apply lighting
  vec3 ambient = baseColor * 0.3;
  vec3 diffuseColor = baseColor * diffuse * uLightIntensity;
  vec3 specularColor = vec3(1.0) * specular * 0.5;
  
  vec3 finalColor = (ambient + diffuseColor) * ao + specularColor;
  
  // Subtle subsurface scattering effect
  float sss = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
  finalColor += uColorAccent * sss * 0.15;
  
  // Vignette
  float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.5);
  finalColor *= 0.7 + vignette * 0.3;
  
  // Slight color grading
  finalColor = pow(finalColor, vec3(0.95));
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`

const [pr, pg, pb] = hexToRgb(props.colorPrimary)
const [sr, sg, sb] = hexToRgb(props.colorSecondary)
const [ar, ag, ab] = hexToRgb(props.colorAccent)

const uniforms = {
  uTime: { value: 0 },
  uSpeed: { value: props.speed },
  uMeshIntensity: { value: props.meshIntensity },
  uLightIntensity: { value: props.lightIntensity },
  uLightPosition: { value: new Vector3(props.lightPosition.x, props.lightPosition.y, props.lightPosition.z) },
  uResolution: { value: new Vector2(1, 1) },
  uMouse: { value: new Vector2(0, 0) },
  uEnableMouseInteraction: { value: props.enableMouseInteraction },
  uColorPrimary: { value: [pr, pg, pb] },
  uColorSecondary: { value: [sr, sg, sb] },
  uColorAccent: { value: [ar, ag, ab] },
}

// Watch for prop changes
watch(() => props.speed, (val) => { uniforms.uSpeed.value = val })
watch(() => props.meshIntensity, (val) => { uniforms.uMeshIntensity.value = val })
watch(() => props.lightIntensity, (val) => { uniforms.uLightIntensity.value = val })
watch(() => props.lightPosition, (val) => { 
  uniforms.uLightPosition.value.set(val.x, val.y, val.z) 
}, { deep: true })
watch(() => props.colorPrimary, (val) => {
  const [r, g, b] = hexToRgb(val)
  uniforms.uColorPrimary.value = [r, g, b]
})
watch(() => props.colorSecondary, (val) => {
  const [r, g, b] = hexToRgb(val)
  uniforms.uColorSecondary.value = [r, g, b]
})
watch(() => props.colorAccent, (val) => {
  const [r, g, b] = hexToRgb(val)
  uniforms.uColorAccent.value = [r, g, b]
})

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


