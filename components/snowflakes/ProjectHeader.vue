<template>
  <hgroup class="project-header | stack">
    <h2 class="h5">{{ title }}</h2>
    <p>{{ client }}</p>
    <p>{{ description }}</p>
  </hgroup>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  client: string
  description: string
}>()
</script>

<style scoped>
.project-header {
  grid-column: 2 / 12;
}
</style>

