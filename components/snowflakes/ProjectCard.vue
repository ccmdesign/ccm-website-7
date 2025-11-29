<template>
  <nuxt-link 
    class="project-card portfolio-item" 
    :data-mockup="mockupType"
    :to="to"
  >
    <img v-if="image" :src="image" :alt="title" />
  </nuxt-link>
</template>

<style scoped>
.project-card {
  height: 100%;
  width: 100%;
  /* display handled by global mockup-type styles */
  
  img {
    width: 100%;
    display: block;
    object-fit: cover; /* Default fallback */
  }

  caption { display: none; }
}

.project-card {
  border: 1px solid var(--color-primary-tint-05);
}

.project-card[data-mockup="web"] {
  padding: var(--space-xl);
}


</style>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type MockupType = 'editorial' | 'branding' | 'web'

const props = defineProps<{
  brow?: string | null
  title: string
  tagline?: string | null
  to: RouteLocationRaw
  image?: string | null
  mockupType?: MockupType | null
}>()
</script>
