<template>
  <nuxt-link class="project-card" :to="to">
    <img :src="`/assets/portfolio/bfna/${randomImage()}`" :alt="title" />
    <!-- <img :src="image" :alt="title" /> -->
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
  /* background-color: red; */
  
  img {
    object-fit: cover;
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
}>()

const randomImage = () => {
  const images = [
    'bfna-federalism-in-crisis-10-11.png',
    'bfna-federalism-in-crisis-24-25.png',
    'bfna-federalism-in-crisis-26-27.png',
    'bfna-federalism-in-crisis-44-45.png',
    'bfna-federalism-in-crisis-54-55.png',
    'bfna-federalism-in-crisis-60-61.png',
    'bfna-federalism-in-crisis-64-65.png',
    'bfna-federalism-in-crisis-82-83.png',
    'bfna-federalism-in-crisis-86-87.png',
    'bfna-federalism-in-crisis-cover.png',
    'bfna-federalism-in-crisis-toc.png'
  ]

  return images[Math.floor(Math.random() * images.length)]
}
</script>
