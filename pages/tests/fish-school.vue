<script setup lang="ts">
import FishSchool from '~/components/explorations/FishSchool/FishSchool.vue'

definePageMeta({
  layout: 'none',
})
</script>

<template>
  <div class="test-page">
    <FishSchool class="fish-container" />
  </div>
</template>

<style scoped>
.test-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.fish-container {
  width: 100%;
  height: 100%;
}
</style>
