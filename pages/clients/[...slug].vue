<template>
  <ccm-section>
    <h2>Our Work Together</h2>
    <div v-if="filteredWorkProjects.length === 0">
      <p>No standalone projects are listed for this client yet.</p>
    </div>
    <portfolio-section v-else>
      <template #header>
        <div class="client-projects-header">
          <h2>Projects with {{ clientDisplayName }}</h2>
          <p class="body-sm">Selected work from the portfolio filtered to this client.</p>
        </div>
      </template>
      <project-card
        v-for="project in filteredWorkProjects"
        :key="getWorkPath(project)"
        :to="getWorkPath(project)"
        :brow="project.client"
        :title="project.title"
        :tagline="project.description"
        :image="getFirstImage(project)?.image || null"
        :mockupType="getFirstImage(project)?.mockupType || null"
      />
    </portfolio-section>
  </ccm-section>
</template>

<script setup>
import { computed } from 'vue'

definePageMeta({
  layout: 'minimal',
})

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

const { data: workItems } = await useAsyncData('client-work-items', () => {
  return queryCollection('work').all()
})

const filteredWorkProjects = computed(() => {
  if (!workItems.value) return []
  const target = clientParam.value.toLowerCase()
  return workItems.value.filter((doc) => {
    if (doc.meta?.['client-slug']) {
      return doc.meta['client-slug'].toLowerCase() === target
    }
    if (doc.meta?.client) {
      return slugify(doc.meta.client) === target
    }
    if (doc['client-slug']) {
      return doc['client-slug'].toLowerCase() === target
    }
    if (doc.client) {
      return slugify(doc.client) === target
    }
    return false
  })
})

const getWorkPath = (item) => {
  if (item.path) return item.path
  if (item._path) return item._path
  if (item._file) {
    const filename = item._file.replace('.md', '')
    return `/work/${filename}`
  }
  return '#'
}

const getFirstImage = (item) => {
  if (!item.items || !Array.isArray(item.items)) return null

  const images = item.items.filter((entry) => entry.type === 'image')
  if (images.length === 0) return null

  const coverImages = images.filter((entry) => entry.cover)
  return coverImages[0] || images[0] || null
}

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
  hideBottom: true,
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
