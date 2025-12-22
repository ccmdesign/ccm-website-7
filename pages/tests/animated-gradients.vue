<script setup lang="ts">
import animatedGradient from '~/components/animatedGradient.vue'

definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="test-page">
    <animatedGradient class="gradient-bg">
      <h1 class="title">Test 3: Animated Gradient</h1>
    </animatedGradient>
  </div>
</template>

<style scoped>
.test-page {
  width: 100vw;
  height: 100vh;
}

.gradient-bg {
  width: 100%;
  height: 100%;
}

.title {
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 3rem;
  font-weight: 200;
  z-index: 20;
}
</style>
