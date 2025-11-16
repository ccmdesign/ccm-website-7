<template>
  <ccm-section>
    <h2>From Insight to Impact</h2>
    <p>Professional design services tailored for research and mission-driven organizations.</p>
    <p>Your work is complex. You deal in groundbreaking research, nuanced policy, and ambitious social goals. The challenge is ensuring your digital presence communicates that value with the clarity and authority it deserves. We partner with you to bridge that gap.</p>
    <p>Our approach is holistic, integrating strategy, design, and technology to build the digital experiences that advance knowledge and drive social impact. We translate your most complex ideas into clear, effective, and engaging platforms that serve your audience and achieve your mission.</p>    
  </ccm-section>
  <ccm-section v-if="services && services.length > 0">
    <service-card 
      v-for="service in services" 
      :key="service.path" 
      :to="service.path"
      :brow="service.meta?.brow"
      :title="service.title"
      :tagline="service.meta?.tagline"
    />
  </ccm-section>

  <ccm-section v-else>
    <p>No services found.</p>
  </ccm-section>
</template>

<script setup>
definePageMeta({
  layout: 'minimal',
  hero: {
    brow: 'Services',
    title: 'How We Can Help',
    tagline: 'Professional design services tailored for research and mission-driven organizations.',
    backgroundColor: 'color-accent'
  }
})

const { data: services } = await useAsyncData('services', async () => {
  const servicesData = await queryCollection('services').all()
  // Sort manually since database-level sorting might not work reliably
  return servicesData.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
})
</script>

<style scoped>

</style>


<!-- 
# 



## 
-->