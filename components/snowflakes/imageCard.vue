<template>
  <figure 
    class="image-card portfolio-item" 
    :data-mockup="mockupType"
    :aria-label="title || undefined" 
    :aria-describedby="caption || undefined"
    @click="handleClick"
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
  cursor: pointer;
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

const emit = defineEmits<{
  open: [imageData: { image: string; title?: string | null; caption?: string | null; mockupType?: MockupType | null }]
}>()

const handleClick = () => {
  emit('open', {
    image: props.image,
    title: props.title,
    caption: props.caption,
    mockupType: props.mockupType
  })
}
</script>
