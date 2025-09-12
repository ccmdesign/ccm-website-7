<template>
  <!-- Clients Section -->
  <ccm-section background-color="color-accent-tint-20">
    <h2>Our Clients</h2>
    <ccm-client-list />
  </ccm-section>

  <!-- Case Studies Section -->
  <ccm-section>
    <h2>Case Studies</h2>
    <div class="stack">
      <ccm-card v-for="study in caseStudies" :key="study.path" :to="study.path">
        <h4>{{ study.meta?.brow || study.brow }}</h4>
        <h3>{{ study.title }}</h3>
        <p>{{ study.meta?.tagline || study.tagline }}</p>
      </ccm-card>
    </div>
  </ccm-section>
</template>

<script setup>
definePageMeta({
  hero: {
    brow: 'Case Studies',
    title: 'Case Studies',
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