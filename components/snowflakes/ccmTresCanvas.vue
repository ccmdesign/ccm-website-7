<template>
  <div class="ccm-tres-canvas" :style="containerStyle">
    <TresCanvas
      v-bind="canvasProps"
      :clear-color="clearColor"
      :window-size="windowSize"
    >
      <slot />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  clearColor?: string
  windowSize?: boolean
  width?: string | number
  height?: string | number
  shadows?: boolean
  alpha?: boolean
  antialias?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  clearColor: '#000000',
  windowSize: false,
  width: '100%',
  height: '100%',
  shadows: false,
  alpha: true,
  antialias: true
})

const containerStyle = computed(() => {
  if (props.windowSize) {
    return {}
  }
  return {
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height
  }
})

const canvasProps = computed(() => {
  return {
    shadows: props.shadows,
    alpha: props.alpha,
    antialias: props.antialias
  }
})
</script>

<style scoped>
.ccm-tres-canvas {
  position: relative;
  overflow: hidden;
}
</style>

