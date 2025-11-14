<template>
  <ccm-card :to="to">
    <h4 v-if="brow">{{ brow }}</h4>
    <h3>{{ title }}</h3>
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
