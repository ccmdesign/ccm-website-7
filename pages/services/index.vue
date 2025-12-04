<template>
  
  <h2 class="tagline">{{ hero?.tagline }}</h2>

  <section v-if="services && services.length > 0" class="service-list">
    <service-card 
      class="service-item"
      v-for="service in services" 
      :key="service.path" 
      :service="service"
    />
  </section>

  <ccm-logo-reel class="logo-reel" />
  
</template>

<style scoped>

.tagline {
  min-height: 40.75svh;
  display: flex;
  align-items: center;
}
.service-list {
  --_stack-space: var(--space-xl);
  margin-inline: var(--system-padding-edge);
  margin-block-start: var(--space-2xl);
  /* margin-block-end: var(--space-3xl); */
}
</style>

<script setup>
definePageMeta({
  hero: {
    brow: '',
    title: 'Services',
    tagline: 'Professional design services tailored for research and mission-driven organizations.',
  }
})

const hero = useHeroContent()

const { data: services } = await useAsyncData('services', () => {
  return queryCollection('services').where('published', '=', true).all()
})
</script>


