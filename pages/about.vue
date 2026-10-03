<template>
  <article class="trust-page">
    <section v-for="block in aboutPage.sections" :key="block.heading">
      <h2>{{ block.heading }}</h2>
      <p v-for="paragraph in block.paragraphs" :key="paragraph">{{ paragraph }}</p>
    </section>
  </article>
</template>

<style scoped>
.trust-page {
  max-width: 68ch;
  margin-inline: auto;
  padding: var(--space-xl);
}

h2 {
  font-size: var(--size-1);
  font-weight: 500;
  margin-block: var(--space-l) var(--space-s);
}

p {
  margin-block-end: var(--space-m);
  line-height: 1.5;
}
</style>

<script setup lang="ts">
import { aboutPage } from '~/utils/agentContent'

definePageMeta({
  hero: {
    brow: 'About',
    title: 'About',
    tagline: 'A design studio for research institutions, think tanks, foundations, and technology companies.',
    variant: 'minimal',
  },
})

const config = useRuntimeConfig()
useSeoMeta({
  title: `About - ${config.public.siteName}`,
  description: aboutPage.description,
  ogTitle: `About - ${config.public.siteName}`,
  ogDescription: aboutPage.description,
  ogUrl: `${config.public.siteUrl}/about`,
  ogType: 'website',
  twitterCard: 'summary',
})
</script>
