<template>
  <nuxt-link class="project-card portfolio-item" :to="to">
    <img v-if="image" :src="image" :alt="title" />
    <!-- <caption>
      <p v-if="brow">{{ brow }}</p>
      <p>{{ title }}</p>
      <p v-if="tagline">{{ tagline }}</p>
    </caption> -->
  </nuxt-link>
</template>

<style scoped>
.project-card {
  height: 100%;
  width: 100%;
  /* outline: 1px solid red; */
  
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }

  caption { display: none; }
}
</style>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  brow?: string | null
  title: string
  tagline?: string | null
  to: RouteLocationRaw
  image?: string | null
}>()
</script>
