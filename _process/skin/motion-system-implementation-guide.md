# Motion System Implementation Guide

This guide explains how to implement the sophisticated motion system from ccm-design-v6.1 in your Nuxt 3 application.

## Overview

The motion system is based on scroll-driven animations using CSS custom properties. It calculates motion based on the difference between a start value and the current scroll position, allowing for dynamic, performant animations without JavaScript.

## Core Concepts

### 1. The Motion API

The system uses several CSS custom properties that work together:

```css
[data-motion] {
  /* Core calculation variables */
  --diff: calc(var(--start) - var(--value));  /* Distance from start point */
  --speed: 1;                                  /* Animation speed multiplier */
  --direction: -1;                             /* 1 or -1 for direction */
  --origin: right;                             /* Transform origin point */
  --ratio: 0.1;                                /* Scale factor for scaling animations */
  
  /* Calculated motion values */
  --base-motion: calc(var(--diff) * var(--speed) * var(--direction) * 0.005vw);
  --base-scale: calc(var(--diff) * var(--ratio));
  
  /* Base styles */
  transform-origin: var(--origin);
  transition: transform .2s linear;
  scroll-behavior: smooth;
}
```

### 2. How It Works

1. **--start**: The initial scroll position (usually set via JavaScript)
2. **--value**: The current scroll position (updated via JavaScript)
3. **--diff**: Calculates how far we've scrolled from the start
4. **--base-motion**: Converts the diff into a motion value, considering speed, direction, and viewport width
5. **--base-scale**: Converts the diff into a scale value using the ratio

## Implementation in Nuxt 3

### Step 1: Create the CSS File

Create a new CSS file at `public/css/utils/motion.css`:

```css
/* Motion System Base */
[data-motion] {
  --diff: calc(var(--start) - var(--value));
  --speed: 1;
  --direction: -1;
  --origin: right;
  --ratio: 0.1;
  --base-motion: calc(var(--diff) * var(--speed) * var(--direction) * 0.005vw);
  --base-scale: calc(var(--diff) * var(--ratio));
  
  transform-origin: var(--origin);
  transition: transform .2s linear;
  scroll-behavior: smooth;
}

/* Basic Motion Types */
[data-motion="translate-x"] {
  transform: translateX(var(--base-motion));
}

[data-motion="translate-y"] {
  transform: translateY(var(--base-motion));
}

[data-motion="scale"] {
  transform: scale(calc(1 + var(--base-scale)));
}

[data-motion="scale-x"] {
  transform: scaleX(calc(1 + var(--base-scale)));
}

[data-motion="rotate"] {
  transform: rotate(calc(var(--base-motion) * 0.1deg));
}

/* Combined Motions */
[data-motion="slide-and-scale"] {
  transform: translateX(var(--base-motion)) scale(calc(1 + var(--base-scale)));
}

/* Custom CCM Bar Animations */
[data-motion^="ccm-bar"] {
  transform: translateX(var(--base-motion)) scaleX(calc(1 + var(--base-scale)));
}

[data-motion="ccm-bar-hero"] {
  --direction: 1;
  --origin: left;
  --speed: 1;
  --ratio: 0.00005;
}

[data-motion="ccm-bar-1"] {
  --direction: 1;
  --origin: left;
  --speed: 1;
  --ratio: 0.0005;
}

[data-motion="ccm-bar-2"] {
  --direction: -1;
  --origin: left;
  --speed: 1;
  --ratio: 0.0005;
}

[data-motion="ccm-bar-3"] {
  --direction: 1;
  --origin: right;
  --speed: 2;
  --ratio: 0.001;
}

/* Custom CCM Outline Animations */
[data-motion*="ccm-outline"] {
  transform: translate(var(--base-motion));
}

[data-motion="ccm-outline-hero"] {
  --speed: 2;
  --direction: -1;
}

[data-motion="ccm-outline-1"] {
  --speed: 0.5;
  --direction: 1;
}
```

### Step 2: Create a Composable for Scroll Tracking

Create `composables/useMotion.ts`:

```typescript
export const useMotion = () => {
  const startPosition = ref(0)
  const currentPosition = ref(0)
  const isInitialized = ref(false)

  const initializeMotion = () => {
    if (process.client && !isInitialized.value) {
      // Set initial scroll position
      startPosition.value = window.pageYOffset || document.documentElement.scrollTop
      currentPosition.value = startPosition.value
      
      // Update CSS custom properties on the root element
      document.documentElement.style.setProperty('--start', startPosition.value.toString())
      document.documentElement.style.setProperty('--value', currentPosition.value.toString())
      
      // Track scroll position
      const handleScroll = () => {
        currentPosition.value = window.pageYOffset || document.documentElement.scrollTop
        document.documentElement.style.setProperty('--value', currentPosition.value.toString())
      }
      
      // Use passive listener for better performance
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      isInitialized.value = true
      
      // Cleanup on unmount
      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll)
      })
    }
  }

  // Initialize on mount
  onMounted(() => {
    initializeMotion()
  })

  return {
    startPosition: readonly(startPosition),
    currentPosition: readonly(currentPosition),
    initializeMotion
  }
}
```

### Step 3: Create Motion Components

#### Example 1: Animated Hero Bar

Create `components/molecules/ccmMotionBar.vue`:

```vue
<template>
  <div 
    :data-motion="variant"
    class="motion-bar"
    :style="customStyles"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'ccm-bar-hero' | 'ccm-bar-1' | 'ccm-bar-2' | 'ccm-bar-3'
  speed?: number
  direction?: 1 | -1
  origin?: 'left' | 'right' | 'center'
  ratio?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ccm-bar-1',
  speed: 1,
  direction: 1,
  origin: 'left',
  ratio: 0.0005
})

// Apply custom motion properties if provided
const customStyles = computed(() => ({
  '--speed': props.speed,
  '--direction': props.direction,
  '--origin': props.origin,
  '--ratio': props.ratio
}))

// Initialize motion system
const { initializeMotion } = useMotion()
</script>

<style scoped>
.motion-bar {
  width: 100%;
  height: 4px;
  background-color: var(--accent-color);
  margin: var(--s2) 0;
}
</style>
```

#### Example 2: Parallax Text

Create `components/molecules/ccmParallaxText.vue`:

```vue
<template>
  <component 
    :is="tag"
    data-motion="translate-x"
    class="parallax-text"
    :style="customStyles"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: string
  speed?: number
  direction?: 1 | -1
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  speed: 0.5,
  direction: -1
})

const customStyles = computed(() => ({
  '--speed': props.speed,
  '--direction': props.direction
}))

const { initializeMotion } = useMotion()
</script>

<style scoped>
.parallax-text {
  will-change: transform;
}
</style>
```

### Step 4: Using Motion in Pages

Example usage in a page component:

```vue
<template>
  <div>
    <!-- Hero Section with Animated Bar -->
    <section class="hero">
      <h1>Welcome to Our Site</h1>
      <ccmMotionBar variant="ccm-bar-hero" />
    </section>

    <!-- Parallax Section -->
    <section class="features">
      <ccmParallaxText tag="h2" :speed="0.3">
        Features That Move With You
      </ccmParallaxText>
      
      <div class="feature-grid">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          :data-motion="`ccm-bar-${index + 1}`"
          class="feature-card"
        >
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Custom Motion Elements -->
    <section>
      <div 
        data-motion="slide-and-scale" 
        style="--speed: 2; --direction: 1; --ratio: 0.001;"
        class="custom-element"
      >
        This element slides and scales on scroll
      </div>
    </section>
  </div>
</template>

<script setup>
const features = [
  { title: 'Fast', description: 'Lightning quick performance' },
  { title: 'Responsive', description: 'Works on all devices' },
  { title: 'Modern', description: 'Built with latest tech' }
]
</script>
```

### Step 5: Advanced Usage

#### Creating Custom Motion Variants

Add new motion types to your CSS:

```css
/* Fade in from bottom */
[data-motion="fade-up"] {
  opacity: calc(1 - var(--diff) * 0.001);
  transform: translateY(calc(var(--diff) * -0.02vw));
}

/* 3D rotation effect */
[data-motion="tilt-3d"] {
  transform: perspective(1000px) rotateX(calc(var(--base-motion) * 0.1deg)) rotateY(calc(var(--base-motion) * 0.2deg));
}

/* Elastic scale */
[data-motion="elastic-scale"] {
  --elastic: calc(sin(var(--diff) * 0.01) * 0.1);
  transform: scale(calc(1 + var(--base-scale) + var(--elastic)));
}
```

#### Performance Optimization

For better performance with many animated elements:

```typescript
// Enhanced composable with throttling
export const useMotionOptimized = () => {
  let rafId: number | null = null
  let lastScrollY = 0

  const updateMotion = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop
    
    // Only update if scroll changed significantly
    if (Math.abs(scrollY - lastScrollY) > 1) {
      document.documentElement.style.setProperty('--value', scrollY.toString())
      lastScrollY = scrollY
    }
    
    rafId = requestAnimationFrame(updateMotion)
  }

  onMounted(() => {
    if (process.client) {
      document.documentElement.style.setProperty('--start', '0')
      rafId = requestAnimationFrame(updateMotion)
    }
  })

  onUnmounted(() => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }
  })
}
```

## Best Practices

1. **Use `will-change` sparingly**: Only on elements that will definitely animate
2. **Limit the number of animated elements**: Too many can impact performance
3. **Test on lower-end devices**: Ensure smooth performance across devices
4. **Provide fallbacks**: Consider users with `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  [data-motion] {
    transform: none !important;
    transition: none !important;
  }
}
```

5. **Use CSS containment**: For better performance on complex layouts

```css
[data-motion] {
  contain: layout style;
}
```

## Debugging Tips

1. **Visualize motion values**: Add this debug helper

```css
[data-motion]::after {
  content: attr(data-motion) " | diff: " var(--diff) " | motion: " var(--base-motion);
  position: absolute;
  top: 0;
  right: 0;
  font-size: 10px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 2px 4px;
  pointer-events: none;
  z-index: 9999;
}
```

2. **Log scroll values**: Use console logging in the composable

```typescript
if (import.meta.env.DEV) {
  console.log('Scroll:', { start: startPosition.value, current: currentPosition.value, diff: currentPosition.value - startPosition.value })
}
```

## Conclusion

This motion system provides a performant, flexible way to add scroll-driven animations to your Nuxt application. By leveraging CSS custom properties and minimal JavaScript, you get smooth animations that work well across devices while maintaining the sophisticated motion design from the original implementation.
