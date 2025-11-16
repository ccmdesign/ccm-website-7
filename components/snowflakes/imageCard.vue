<template>
  <figure 
    class="image-card portfolio-item" 
    :data-mockup="mockupType"
    :aria-label="title || undefined" 
    :aria-describedby="caption || undefined"
  >
    <img :src="image" :alt="title || undefined" />
    <!-- <figcaption v-if="caption">
      <p v-if="title">{{ title }}</p>
      <p>{{ caption }}</p>
    </figcaption> -->
  </figure>
</template>

<style scoped>
.image-card {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* outline: 1px solid red; */

  /* background: linear-gradient(to top, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.05)); */
  
  figcaption { display: none; }
}
</style>

<script setup lang="ts">


type MockupType = 'editorial' | 'branding' | 'web'

const props = defineProps<{
  image: string
  title?: string | null
  caption?: string | null
  mockupType?: MockupType | null
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
