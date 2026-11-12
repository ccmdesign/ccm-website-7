<template>
  <component
    :is="hasLink ? 'a' : 'figure'"
    class="project-card portfolio-item"
    :data-mockup="mockupType"
    :href="hasLink ? to : undefined"
    :aria-label="hasLink && title ? title : undefined"
    :data-slide-in="hasLink ? 'from-top' : undefined"
    @click="!hasLink && handleClick()"
  >
    <img :src="image" :alt="imageAlt" />
  </component>
</template>

<style scoped>
.project-card {
  height: min-content;
  width: 100%;
  margin: 0;
  margin-block-start: auto;
  
  img {
    width: 100%;
    display: block;
    object-fit: cover;
  }

  figcaption,
  caption {
    display: none;
  }
}


/* .project-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
} */

.project-card[data-mockup="web"] {
  padding: var(--space-xl);
  display: flex;
  

  img {
    border-radius: var(--border-radius-l);
    /* border: 2px solid var(--color-primary-tint-10);
    border-top: 40px solid var(--color-primary-tint-10); */
    box-shadow: var(--shadow-elevation-high);
    
    object-fit: cover;
    
    aspect-ratio: 16/9;
  }
}

.project-card[data-mockup="branding"] {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.project-card[data-mockup="editorial"] {
  img {
    object-fit: cover;
  }
}
</style>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type MockupType = 'editorial' | 'branding' | 'web'

const props = defineProps<{
  title?: string | null
  to?: RouteLocationRaw | null
  image: string
  caption?: string | null
  alt?: string | null
  mockupType?: MockupType | null
}>()

const emit = defineEmits<{
  open: [imageData: { image: string; title?: string | null; caption?: string | null; mockupType?: MockupType | null }]
}>()

const hasLink = computed(() => {
  return props.to != null && props.to !== '' && props.to !== '#'
})

// A linked card is named by its aria-label, so its image is decorative.
// A standalone image gets alt from `alt`, else "title: caption". Never omit alt.
const imageAlt = computed(() => {
  if (hasLink.value && props.title) return ''
  if (props.alt != null) return props.alt
  return [props.title, props.caption].filter(Boolean).join(': ')
})

const handleClick = () => {
  emit('open', {
    image: props.image,
    mockupType: props.mockupType
  })
}
</script>
