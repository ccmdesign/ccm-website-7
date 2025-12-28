<template>
  <TresMesh>
    <TresPlaneGeometry :args="[8, 8]" />
    <CustomShaderMaterial
      :base-material="() => new MeshBasicMaterial()"
      :uniforms="shaderUniforms"
      :vertex-shader="vertexShader"
      :fragment-shader="fragmentShader"
    />
  </TresMesh>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { CustomShaderMaterial } from '@tresjs/cientos'
import { useLoop, useTres } from '@tresjs/core'
import { MeshBasicMaterial } from 'three'

const { sizes } = useTres()
const { onBeforeRender } = useLoop()

// Shader uniforms - mapped from Shadertoy conventions
const shaderUniforms = reactive({
  uTime: { value: 0 },
  uResolution: { value: [0, 0] }
})

// Update uniforms in animation loop
onBeforeRender(({ elapsed }) => {
  shaderUniforms.uTime.value = elapsed
  if (sizes.width.value && sizes.height.value) {
    shaderUniforms.uResolution.value = [sizes.width.value, sizes.height.value]
  }
})

// Standard Three.js vertex shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Shadertoy-style fragment shader (mesh gradient example)
// This is adapted from Shadertoy - converts mainImage to main()
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;
  
  // Shadertoy-style mesh gradient function
  vec3 meshGradient(vec2 uv, float time) {
    // Create a mesh-like pattern with animated colors
    vec2 grid = abs(fract(uv * 4.0 - 0.5) - 0.5) / fwidth(uv * 4.0);
    float pattern = min(grid.x, grid.y);
    
    // Animated color gradients
    vec3 color1 = vec3(0.996, 0.0, 0.431); // #ff006e
    vec3 color2 = vec3(0.514, 0.220, 0.925); // #8338ec
    vec3 color3 = vec3(0.227, 0.525, 1.0);  // #3a86ff
    
    // Mix colors based on UV position and time
    vec3 gradient = mix(
      mix(color1, color2, sin(time + uv.x * 2.0) * 0.5 + 0.5),
      color3,
      sin(time * 0.5 + uv.y * 2.0) * 0.5 + 0.5
    );
    
    // Apply mesh pattern
    float mesh = smoothstep(0.0, 0.02, pattern);
    return gradient * (0.7 + mesh * 0.3);
  }
  
  void main() {
    // Convert UV to Shadertoy-style coordinates (0,0 at bottom-left)
    vec2 uv = vUv;
    
    // Get mesh gradient color
    vec3 color = meshGradient(uv, uTime);
    
    gl_FragColor = vec4(color, 1.0);
  }
`
</script>

