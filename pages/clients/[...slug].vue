<template>
  <!-- Client Information Section -->
  <ccm-section v-if="client">
    <div class="client-info | prose-layout | prose">
      <div class="client-details">
        <div class="client-meta">
          <p class="sector">{{ client.meta?.sector }}</p>
          <p v-if="client.meta?.location" class="location">{{ client.meta?.location }}</p>
          <p v-if="client.meta?.established" class="established">Founded {{ client.meta?.established }}</p>
        </div>
        <div class="client-description">
          <ContentRenderer v-if="client" :value="client" />
        </div>
      </div>
    </div>
  </ccm-section>

  <!-- Case Studies Section -->
  <ccm-section>
    <h2>Our Work Together</h2>
    <div class="client-case-studies">
      <div v-if="filteredCaseStudies.length === 0">
        <p>No case studies found for this client yet.</p>
      </div>
      <div v-else>
        <ccm-card
          v-for="cs in filteredCaseStudies"
          :key="cs.path"
          :to="cs.path"
        >
          <h4>{{ cs.meta?.brow || cs.brow }}</h4>
          <h3>{{ cs.title }}</h3>
          <p v-if="cs.meta?.tagline || cs.tagline">{{ cs.meta?.tagline || cs.tagline }}</p>
        </ccm-card>
      </div>
    </div>
  </ccm-section>
</template>

<script setup>
import { computed } from 'vue'

const route = useRoute()

const slugify = (value) => {
  if (!value) return ''
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/["'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const clientParam = computed(() => {
  const raw = Array.isArray(route.params.slug)
    ? route.params.slug.join('/')
    : route.params.slug
  return String(raw)
})

// Fetch client data from clients collection
const { data: client } = await useAsyncData(`client-${clientParam.value}`, () => {
  return queryCollection('clients').path(`/clients/${clientParam.value}`).first()
})

// Fetch case studies
const { data: allCaseStudies } = await useAsyncData('all-case-studies', () => {
  return queryCollection('casestudies').all()
})

const filteredCaseStudies = computed(() => {
  if (!allCaseStudies.value) return []
  const target = clientParam.value.toLowerCase()
  return allCaseStudies.value.filter((doc) => {
    // First check if there's a client-slug field in meta
    if (doc.meta?.['client-slug']) {
      return doc.meta['client-slug'].toLowerCase() === target
    }
    // Fallback to slugifying the client name from meta
    if (doc.meta?.client) {
      return slugify(doc.meta.client) === target
    }
    // Final fallback to direct properties
    if (doc['client-slug']) {
      return doc['client-slug'].toLowerCase() === target
    }
    return slugify(doc.client) === target
  })
})

// Hero state for default layout
const heroState = useState('hero', () => null)
const clientDisplayName = computed(() => {
  if (client.value) {
    return client.value.meta?.['display-name'] || client.value.meta?.name || client.value.title
  }
  if (filteredCaseStudies.value.length > 0) {
    return filteredCaseStudies.value[0].client
  }
  // fallback: derive a display name from slug
  return clientParam.value.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
})

const clientTagline = computed(() => {
  if (client.value) {
    return client.value.meta?.description || `${filteredCaseStudies.value.length} case study${filteredCaseStudies.value.length === 1 ? '' : 'ies'}`
  }
  return `${filteredCaseStudies.value.length} case study${filteredCaseStudies.value.length === 1 ? '' : 'ies'}`
})

heroState.value = {
  brow: client.value?.meta?.sector || 'Client',
  title: clientDisplayName.value,
  tagline: clientTagline.value,
  backgroundColor: 'color-accent',
  size: 'l',
  hideBottom: true
}

// Set page SEO
useHead({
  title: `${clientDisplayName.value} - Client Work | CCM`,
  meta: [
    { name: 'description', content: client.value?.meta?.description || `Case studies and work completed for ${clientDisplayName.value}` }
  ]
})
</script>

<style scoped>

</style>


