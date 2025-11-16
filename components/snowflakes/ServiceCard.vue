<template>
  <ccm-card :to="to" image="false">
    <h4 class="h6" v-if="brow">{{ brow }}</h4>
    <h2 class="h4">{{ title }}</h2>
    <p v-if="tagline">{{ tagline }}</p>
  </ccm-card>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  brow?: string | null
  title: string
  tagline?: string | null
  to: RouteLocationRaw
}>()
</script>

<style scoped>
/* Styling to be added later */
:deep(.ccm-card__text) {
  border: 1px solid red;
}
</style>

