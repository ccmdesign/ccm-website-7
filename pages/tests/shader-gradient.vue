<template>
  <ClientOnly>
    <TresCanvas clear-color="#0a0a0a" window-size>
      <TresPerspectiveCamera :position="[0, 0, 1]" :look-at="[0, 0, 0]" />
      <ShaderGradient />
    </TresCanvas>
  </ClientOnly>
</template>

<script setup lang="ts">
import ShaderGradient from '~/components/explorations/ShaderGradient.vue'
</script>

<style scoped>
</style>
