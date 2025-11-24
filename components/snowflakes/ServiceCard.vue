<template>
  <div class="service-card">
    <hgroup class=""stack>
      <h6>{{ title }}</h6>
      <p v-if="tagline">{{ tagline }}</p>
      
      <ccm-button :to="to" class="service-card__cta">Explore service</ccm-button>
    </hgroup>

    <section v-if="shouldShowProjects">
      <ul v-if="previewWorks.length" class="service-card__projects | cluster">
        <li v-for="work in previewWorks" :key="getWorkPath(work)">
          <project-card
            class="service-card__project"
            :to="getWorkPath(work)"
            :title="work.title"
            :image="getCoverImage(work, normalizedSlug)?.image || null"
            :mockupType="getCoverImage(work, normalizedSlug)?.mockupType || null"
          />
        </li>
      </ul>
      <p v-else class="service-card__empty">Projects are being added.</p>
    </section>

    
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  brow?: string | null
  title: string
  tagline?: string | null
  to: RouteLocationRaw
  slug?: string | null
}>()

const slugSource = computed(() => {
  if (props.slug) return props.slug
  if (typeof props.to === 'string') return props.to
  return ''
})

const normalizedSlug = computed(() => {
  const raw = slugSource.value ?? ''
  return raw.replace(/^\/services\//, '').replace(/^\//, '').replace(/\/$/, '')
})

const slugKey = normalizedSlug.value || 'unknown'
const { data: workMatches } = await useAsyncData(`service-works-${slugKey}`, async () => {
  const serviceSlug = normalizedSlug.value
  if (!serviceSlug) return []

  const allWork = await queryCollection('work').all()
  return allWork.filter((item: any) => {
    const services = item.services || []
    return Array.isArray(services) && services.includes(serviceSlug)
  })
})

// Hide projects for design-subscription service
const shouldShowProjects = computed(() => {
  const slug = normalizedSlug.value
  return !slug.includes('design-subscription')
})

const previewWorks = computed(() => {
  if (!shouldShowProjects.value) return []
  return (workMatches.value || []).slice(0, 3)
})
const workCount = computed(() => workMatches.value?.length ?? 0)

const getWorkPath = (item: any) => {
  if (item.path) return item.path
  if (item._path) return item._path
  if (item._file) {
    return `/work/${item._file.replace('.md', '')}`
  }
  return '#'
}

// Map service slugs to mockup types
const serviceToMockupType: Record<string, string> = {
  'interface-design-and-development': 'web',
  'interface-design-development': 'web',
  'branding': 'branding',
  'publication-in-30-days': 'editorial',
  'design-subscription': 'web', // default to web for subscription
  'splashpage-in-a-week': 'web'
}

const getCoverImage = (item: any, serviceSlug: string) => {
  if (!item.items || !Array.isArray(item.items)) return null
  
  const images = item.items.filter((i: any) => i.type === 'image')
  if (images.length === 0) return null
  
  // Get the expected mockup type for this service
  const expectedMockupType = serviceToMockupType[serviceSlug] || null
  
  // Find cover images matching the service's mockup type
  let coverImages = images.filter((i: any) => i.cover === true)
  
  if (expectedMockupType) {
    // Prefer cover images with matching mockup type
    const matchingCover = coverImages.find((i: any) => i.mockupType === expectedMockupType)
    if (matchingCover) return matchingCover
    
    // Fallback to any image with matching mockup type
    const matchingImage = images.find((i: any) => i.mockupType === expectedMockupType)
    if (matchingImage) return matchingImage
  }
  
  // Return first cover, or fallback to first image
  return coverImages[0] || images[0] || null
}
</script>

<style scoped>
.service-card {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: wide-start / wide-end;
  border-top: 1px solid var(--color-base-tint-10);
  gap: var(--space-ml);
  padding: var(--space-l) 0;
}

hgroup {
  grid-column: 1 / 4;
}

section {
  
  grid-column: 4 / wide-end;
}

.service-card__projects {
  list-style: none;
  align-items: end;
  justify-content: end;
}

.service-card__projects li {
  grid-column: span 4;
  width: 300px;
  flex: 0 0 auto;
}

.service-card__project {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}


</style>
