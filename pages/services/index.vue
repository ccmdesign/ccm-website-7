<template>
  <ccm-section v-if="services && services.length > 0" class="service-list">
    <service-card 
      class="service-item"
      v-for="service in services" 
      :key="service.path" 
      :service="service"
    />
  </ccm-section>
</template>

<style scoped>

.service-list {
  --_stack-space: var(--space-xl);
  margin-inline: var(--system-padding-edge);

  > * {
    grid-column: span 12;
  }
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

const { data: services } = await useAsyncData('services', () => {
  return queryCollection('services')
    .where('published', '=', true)
    .order('order', 'ASC')
    .all()
})
</script>


