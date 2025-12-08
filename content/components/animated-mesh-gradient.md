---
title: Animated Mesh Gradient
description: iOS-style animated mesh gradient component using TresJS and custom GLSL shaders
category: Effects
component: AnimatedMeshGradient
tags: [shader, animation, gradient, three.js, tresjs]
---

# Animated Mesh Gradient

An advanced animated mesh gradient component that creates iOS-style flowing gradients using custom GLSL shaders and TresJS (Three.js for Vue).

## Features

- **Smooth Animated Gradients**: Flowing, organic color transitions using Simplex noise
- **Mouse Interaction**: Optional mouse-driven effects that respond to cursor movement
- **Highly Customizable**: Control colors, speed, complexity, and intensity
- **Performant**: Optimized shader code running at 60fps
- **Educational**: Extensively commented code that teaches shader concepts

## Basic Usage

```vue
<template>
  <TresCanvas window-size>
    <AnimatedMeshGradient
      :colors="['#ff6b9d', '#c06c84', '#6c5b7b', '#355c7d']"
      :speed="0.5"
      :complexity="2.0"
      :enable-mouse-interaction="true"
    />
  </TresCanvas>
</template>
```

## Props

### `colors`
- **Type**: `string[]`
- **Default**: `['#ff6b9d', '#c06c84', '#6c5b7b', '#355c7d']`
- **Description**: Array of 4 hex color strings that will be blended in the gradient

### `speed`
- **Type**: `number`
- **Default**: `0.5`
- **Description**: Animation speed multiplier. Higher values = faster animation
- **Range**: `0` to `2` (recommended)

### `complexity`
- **Type**: `number`
- **Default**: `2.0`
- **Description**: Noise frequency/detail level. Higher values = more intricate patterns
- **Range**: `0.5` to `5` (recommended)

### `enableMouseInteraction`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable/disable mouse position influence on the gradient

### `intensity`
- **Type**: `number`
- **Default**: `1.0`
- **Description**: How dramatic the color changes are. Lower = more subtle, Higher = more vibrant
- **Range**: `0` to `2` (recommended)

## Color Palettes

### iOS Style (Default)
```js
['#ff6b9d', '#c06c84', '#6c5b7b', '#355c7d']
```

### Sunset
```js
['#ff6e7f', '#ff9a56', '#ffc371', '#f38181']
```

### Ocean
```js
['#667eea', '#764ba2', '#f093fb', '#4facfe']
```

### Forest
```js
['#11998e', '#38ef7d', '#7bed9f', '#2ed573']
```

### Lavender Dreams
```js
['#a8edea', '#fed6e3', '#c471ed', '#f64f59']
```

## Advanced Examples

### Full-Screen Background
```vue
<template>
  <div class="page-wrapper">
    <TresCanvas 
      window-size 
      clear-color="#000000"
      class="gradient-background"
    >
      <AnimatedMeshGradient :colors="colors" />
    </TresCanvas>
    
    <div class="content">
      <!-- Your page content here -->
    </div>
  </div>
</template>

<style>
.page-wrapper {
  position: relative;
  min-height: 100vh;
}

.gradient-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.content {
  position: relative;
  z-index: 1;
}
</style>
```

### Slow, Subtle Gradient
```vue
<AnimatedMeshGradient
  :colors="['#ffeaa7', '#dfe6e9', '#74b9ff', '#a29bfe']"
  :speed="0.2"
  :complexity="1.5"
  :intensity="0.6"
/>
```

### Fast, Intense Animation
```vue
<AnimatedMeshGradient
  :colors="['#ff0000', '#ff00ff', '#0000ff', '#00ffff']"
  :speed="1.5"
  :complexity="3.5"
  :intensity="1.8"
/>
```

### Static (No Animation)
```vue
<AnimatedMeshGradient
  :colors="['#667eea', '#764ba2', '#f093fb', '#4facfe']"
  :speed="0"
  :enable-mouse-interaction="false"
/>
```

## How It Works

### Shader Architecture

The component uses custom GLSL shaders to generate the gradient entirely on the GPU:

1. **Vertex Shader**: 
   - Creates a high-subdivision plane mesh (32x32 segments)
   - Adds subtle wave distortion for organic depth
   - Passes UV coordinates to fragment shader

2. **Fragment Shader**:
   - Implements 3D Simplex noise with Fractal Brownian Motion (FBM)
   - Generates animated noise patterns using time as third dimension
   - Blends 4 colors smoothly based on noise values
   - Applies mouse interaction effects

### Noise Function

The component uses **Simplex Noise**, an improved version of Perlin noise:

- **Better Performance**: Especially in 3D and higher dimensions
- **Fewer Artifacts**: No directional bias or grid patterns
- **More Organic**: Natural, flowing patterns perfect for gradients

### Color Blending

Colors are blended in multiple stages:

1. Generate noise at different scales (large, medium, small)
2. Combine noises for complex patterns
3. Use noise to create blend factors between colors
4. Apply smoothstep for smooth transitions
5. Blend color pairs horizontally and vertically
6. Combine layers for final result

## Performance Tips

### Optimization Strategies

1. **Lower Complexity**: Reduce `complexity` prop for faster rendering
2. **Disable Mouse**: Set `enableMouseInteraction={false}` if not needed
3. **Fewer Octaves**: Modify FBM function to use fewer octaves (currently 4)
4. **Lower Subdivision**: Reduce plane geometry segments (in component code)

### Performance Mode Example
```vue
<AnimatedMeshGradient
  :colors="['#ff6b9d', '#c06c84', '#6c5b7b', '#355c7d']"
  :speed="0.5"
  :complexity="1.5"
  :enable-mouse-interaction="false"
/>
```

## Customization Guide

### Modifying Mesh Subdivision

In `AnimatedMeshGradient.vue`, find this line:

```vue
<TresPlaneGeometry :args="[2, 2, 32, 32]" />
```

Change the last two numbers (width/height segments):
- `32, 32` = Ultra smooth (default)
- `16, 16` = Balanced
- `8, 8` = Performance mode

### Adjusting Animation Speed

The `speed` prop directly multiplies the time uniform:

```glsl
float time = uTime * uSpeed;
```

You can also adjust individual noise layers in the shader:

```glsl
// Slower large-scale movement
float noise1 = fbm(vec3(
  uv.x * uComplexity,
  uv.y * uComplexity,
  time * 0.3  // Change this multiplier
));
```

### Changing Color Blend Logic

Modify the color blending in `createGradient()` function:

```glsl
// Horizontal blend
vec3 color12 = mix(
  uColor1,
  uColor2,
  smoothstep(0.3, 0.7, blend1 + uv.x * 0.5)
  // Adjust smoothstep range and UV multiplier
);
```

### Mouse Interaction Radius

Adjust the influence area in `applyMouseInteraction()`:

```glsl
float radius = 0.4; // Larger = wider effect
float interaction = 1.0 - smoothstep(0.0, radius, dist);
```

## Troubleshooting

### Gradient Appears Static
- Check that `speed` prop is greater than 0
- Verify TresJS canvas is rendering
- Check browser console for WebGL errors

### Colors Look Wrong
- Ensure hex colors include the `#` prefix
- Verify colors are valid 6-digit hex codes
- Check that exactly 4 colors are provided

### Performance Issues
- Lower the `complexity` prop
- Reduce mesh subdivision
- Disable mouse interaction
- Check for other GPU-intensive processes

### Mouse Interaction Not Working
- Ensure `enableMouseInteraction` is `true`
- Check that mouse events are not blocked by other elements
- Verify canvas is receiving mouse events

## Browser Support

- **Requires WebGL**: Modern browsers with WebGL support
- **Tested**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS 14+, Android Chrome 90+

## Learn More

### Shader Resources
- [The Book of Shaders](https://thebookofshaders.com/)
- [Simplex Noise Explained](https://en.wikipedia.org/wiki/Simplex_noise)
- [TresJS Documentation](https://tresjs.org/)

### Related Components
- `ShaderGradient.vue` - Alternative gradient implementation
- `MeshGradientShader.vue` - Mesh-style gradient pattern

## Demo

Visit [/gradient-demo](/gradient-demo) to see the component in action with interactive controls.

