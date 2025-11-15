<template>
  <!-- Case Studies Section -->
  <portfolio-section section-title="">
    <project-card v-for="study in caseStudies" :key="study.path" :to="study.path" :brow="study.meta?.brow || study.brow" :title="study.title" :tagline="study.meta?.tagline || study.tagline" />
  </portfolio-section>
</template>

<script setup>
definePageMeta({
  layout: 'minimal',
  hero: {
    brow: 'Case Studies',
    title: 'Work',
    tagline: 'See our work',
    backgroundColor: 'color-accent',
  }
})

const { data: caseStudies } = await useAsyncData('case-studies', () => {
  return queryCollection('casestudies').all()
})
</script>

<style scoped>
/* No custom styles needed - using stack layout class */
</style>