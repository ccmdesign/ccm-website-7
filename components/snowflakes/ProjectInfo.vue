<template>
  <div class="project-info portfolio-item | stack">
    <p :class="heading">{{ content }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
  heading?: string
}>()
</script>

<style scoped>
.project-info {
  justify-content: center;
}

.project-info p {
  font-weight: 500;
}
</style>

