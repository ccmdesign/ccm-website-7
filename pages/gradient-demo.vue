<template>
  <div class="gradient-demo">
    <TresCanvas window-size>
      <AnimatedMeshGradient />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'

useHead({
  title: 'Mesh Gradient Demo',
})
</script>

<style scoped>
.gradient-demo {
  width: 100%;
  height: 100vh;
}
</style>
