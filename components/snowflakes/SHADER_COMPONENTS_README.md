# Shader Components Reference

This directory contains advanced WebGL shader-based components using TresJS (Three.js for Vue).

## Components Overview

### AnimatedMeshGradient.vue ✨ NEW
**iOS-style animated mesh gradient with full customization**

Production-ready component with:
- 3D Simplex noise implementation
- Fractal Brownian Motion (FBM) for complex patterns
- 4-color smooth blending
- Mouse interaction effects
- Extensive educational comments

**Usage:**
```vue
<AnimatedMeshGradient
  :colors="['#ff6b9d', '#c06c84', '#6c5b7b', '#355c7d']"
  :speed="0.5"
  :complexity="2.0"
  :intensity="1.0"
  :enable-mouse-interaction="true"
/>
```

**Props:**
- `colors: string[]` - 4 hex colors for gradient
- `speed: number` - Animation speed (0-2)
- `complexity: number` - Noise detail level (0.5-5)
- `intensity: number` - Color change drama (0-2)
- `enableMouseInteraction: boolean` - Mouse effects toggle

### ShaderGradient.vue
**Existing gradient with rotation and wave effects**

Features:
- Rotation with noise
- Wave warp with sine functions
- Film grain effect
- Mouse interaction with white highlight
- Cyclic color interpolation

### MeshGradientShader.vue
**Grid-based mesh gradient pattern**

Features:
- Mesh-like grid pattern
- Simple color mixing
- Animated with time
- Uses CustomShaderMaterial from @tresjs/cientos

## Shader Concepts Explained

### Vertex Shader
Runs once per vertex (mesh point):
- Transforms vertex positions
- Passes data to fragment shader via `varying` variables
- Handles geometry deformation/animation

### Fragment Shader
Runs once per pixel:
- Determines final pixel color
- Performs complex calculations (noise, blending, effects)
- Receives interpolated data from vertex shader

### Uniforms
JavaScript → GLSL bridge:
- `uniform float uTime` - Elapsed time for animation
- `uniform vec2 uResolution` - Screen dimensions
- `uniform vec2 uMouse` - Mouse coordinates
- `uniform vec3 uColorN` - RGB colors (0-1 range)

### Noise Functions

**Simplex Noise**
- Improved version of Perlin noise
- Better performance in 3D+
- More organic, flowing patterns
- Returns value between -1 and 1

**Fractal Brownian Motion (FBM)**
- Layers multiple octaves of noise
- Each octave: 2× frequency, 0.5× amplitude
- Creates natural complexity
- Used in terrain, clouds, gradients

### Color Blending

**Linear Interpolation (mix)**
```glsl
vec3 result = mix(colorA, colorB, factor);
// factor = 0: colorA
// factor = 0.5: 50/50 blend
// factor = 1: colorB
```

**Smooth Transitions (smoothstep)**
```glsl
float smooth = smoothstep(edge0, edge1, value);
// Creates S-curve between edge0 and edge1
// Smoother than linear interpolation
```

## Integration Patterns

### Full-Screen Background
```vue
<template>
  <div class="app">
    <TresCanvas window-size class="gradient-bg">
      <AnimatedMeshGradient :colors="colors" />
    </TresCanvas>
    <main class="content">
      <!-- Page content -->
    </main>
  </div>
</template>

<style>
.gradient-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
}
</style>
```

### Hero Section
```vue
<section class="hero">
  <TresCanvas class="hero-gradient">
    <AnimatedMeshGradient
      :colors="['#667eea', '#764ba2', '#f093fb', '#4facfe']"
      :speed="0.3"
    />
  </TresCanvas>
  <div class="hero-content">
    <h1>Welcome</h1>
  </div>
</section>

<style>
.hero {
  position: relative;
  height: 100vh;
}
.hero-gradient {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.hero-content {
  position: relative;
  z-index: 1;
}
</style>
```

### Section Background
```vue
<section class="features">
  <div class="gradient-wrapper">
    <TresCanvas class="section-gradient">
      <AnimatedMeshGradient
        :colors="sectionColors"
        :speed="0.4"
        :complexity="1.8"
      />
    </TresCanvas>
  </div>
  <div class="features-content">
    <!-- Content -->
  </div>
</section>

<style>
.features {
  position: relative;
  padding: 4rem 0;
}
.gradient-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.section-gradient {
  width: 100%;
  height: 100%;
}
.features-content {
  position: relative;
  z-index: 1;
}
</style>
```

## Performance Best Practices

1. **Reuse Components**: Don't create multiple instances unnecessarily
2. **Lower Complexity**: Start with lower values, increase if needed
3. **Disable Unused Features**: Turn off mouse interaction if not needed
4. **Use CSS Layers**: Let CSS handle z-index layering, not multiple canvases
5. **Monitor FPS**: Check browser DevTools performance tab

## Debugging Tips

### Check WebGL Support
```js
const canvas = document.createElement('canvas')
const hasWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
console.log('WebGL supported:', hasWebGL)
```

### View Shader Errors
Open browser console - GLSL errors show with line numbers

### Test Without Animation
Set `speed={0}` to isolate animation issues from rendering issues

### Verify Uniforms Update
Add to component:
```js
onBeforeRender(({ elapsed }) => {
  console.log('Time:', elapsed, 'Mouse:', uniforms.uMouse.value)
})
```

## Resources

- [TresJS Documentation](https://tresjs.org/)
- [Three.js ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [The Book of Shaders](https://thebookofshaders.com/)
- [Shadertoy](https://www.shadertoy.com/) - Shader examples
- [GLSL Reference](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)

## Common Issues

### "Cannot read property 'value' of undefined"
- Uniform not initialized in uniforms object
- Check spelling matches shader uniform name

### "WebGL context lost"
- Too many shader instances
- Memory leak (check cleanup in onUnmounted)
- GPU overload

### Colors not updating
- Uniforms need `.value` property
- Make sure reactive values trigger updates
- Check computed properties recalculate

### Mouse interaction inverted
- Y-axis in screen coords vs UV coords
- Use: `mouse.y = 1.0 - mouse.y`

## Demo Page

Visit `/gradient-demo` to see the AnimatedMeshGradient component with interactive controls.

