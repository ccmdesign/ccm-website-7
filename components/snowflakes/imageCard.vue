<template>
  <figure class="image-card" :aria-label="title" :aria-describedby="caption" >
    <img :src="image" :alt="title" />
    <!-- <figcaption v-if="caption">
      <p v-if="title">{{ title }}</p>
      <p>{{ caption }}</p>
    </figcaption> -->
  </figure>
</template>

<style scoped>
.image-card {
  height: 100%;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  img { object-fit: cover; }

  figcaption { display: none; }
}
</style>

<script setup lang="ts">


const props = defineProps<{
  image: string
  title?: string | null
  caption?: string | null
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
