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

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 uMouse;

#define filmGrainIntensity 0.05

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p)*8758.5453);
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f*f*(3.0-2.0*f);

    float n = mix(mix(dot(-1.0+2.0*hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
    dot(-1.0+2.0*hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(-1.0+2.0*hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
    dot(-1.0+2.0*hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    return 0.5 + 0.5*n;
}

float filmGrainNoise(in vec2 uv) {
    return length(hash(vec2(uv.x, uv.y)));
}

void main() {
    vec2 uv = vUv;
    float aspectRatio = iResolution.x / iResolution.y;
    
    // Transformed uv
    vec2 tuv = uv - .01;

    // Rotate with noise
    float degree = noise(vec2(iTime*.01, tuv.x*tuv.y));

    tuv.y *= 1./aspectRatio;
    tuv *= Rot(radians((degree-.5)*720.+180.));
    tuv.y *= aspectRatio;

    // Wave warp with sine
    float frequency = 6.;
    float amplitude = 20.;
    float speed = iTime * 2.;
    tuv.x += sin(tuv.y*frequency+speed)/amplitude;
    tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);
    
    // Light gradient colors
    vec3 white = vec3(1.0);
    vec3 navy = vec3(2., 48., 1.) / 255.;
    vec3 yellow = vec3(243., 224., 0.) / 255.;

    vec3 amberYellow = white;
    vec3 deepBlue = navy;
    vec3 pink = white;
    vec3 blue = white;
    
    // Dark gradient colors
    vec3 purpleHaze = white;
    vec3 swampyBlack = yellow;
    vec3 persimmonOrange = white;
    vec3 darkAmber = white;
    
    // Interpolate between light and dark gradient
    float cycle = sin(iTime * 0.5);
    float t = (sign(cycle) * pow(abs(cycle), 0.6) + 1.) / 2.;
    vec3 color1 = mix(amberYellow, purpleHaze, t);
    vec3 color2 = mix(deepBlue, swampyBlack, t);
    vec3 color3 = mix(pink, persimmonOrange, t);
    vec3 color4 = mix(blue, darkAmber, t);

    // Blend the gradient colors and apply transformations
    vec3 layer1 = mix(color3, color2, smoothstep(-.6, .6, (tuv*Rot(radians(-5.))).x));
    vec3 layer2 = mix(color4, color1, smoothstep(-.6, .6, (tuv*Rot(radians(-5.))).x));
    
    vec3 color = mix(layer1, layer2, smoothstep(.5, -.3, tuv.y));
    
    // Mouse interaction
    vec2 mouse = uMouse / iResolution;
    // Fix mouse Y coordinate (standard GLSL UV vs Screen coords)
    mouse.y = 1.0 - mouse.y; 
    
    // Adjust for aspect ratio for correct distance calculation
    vec2 aspectUV = uv;
    aspectUV.x *= aspectRatio;
    vec2 aspectMouse = mouse;
    aspectMouse.x *= aspectRatio;
    
    float dist = distance(aspectUV, aspectMouse);
    float radius = 0.5; // Radius of influence
    float interaction = 1.0 - smoothstep(0.0, radius, dist);
    
    // Mix white based on interaction
    color = mix(color, white, interaction * 0.7); // 0.7 intensity

    // Apply film grain
    color = color - filmGrainNoise(uv) * filmGrainIntensity;
    
    gl_FragColor = vec4(color, 1.0);  
}
`

const uniforms = {
  iTime: { value: 0 },
  iResolution: { value: new Vector2(1, 1) },
  uMouse: { value: new Vector2(0, 0) },
}

const targetMouse = new Vector2(0, 0)

const { onRender } = useLoop()

onRender(({ elapsed }) => {
  uniforms.iTime.value = elapsed
  
  // Lerp mouse position for smooth trailing effect
  const lerpFactor = 0.05 // Adjust speed here
  uniforms.uMouse.value.lerp(targetMouse, lerpFactor)
})

const updateMouse = (e: MouseEvent) => {
  targetMouse.set(e.clientX, e.clientY)
}

onMounted(() => {
    // Initial size
    if (typeof window !== 'undefined') {
        const width = window.innerWidth
        const height = window.innerHeight
        uniforms.iResolution.value.set(width, height)
        // Set initial mouse to center
        targetMouse.set(width / 2, height / 2)
        uniforms.uMouse.value.set(width / 2, height / 2)
        
        window.addEventListener('resize', () => {
            uniforms.iResolution.value.set(window.innerWidth, window.innerHeight)
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

