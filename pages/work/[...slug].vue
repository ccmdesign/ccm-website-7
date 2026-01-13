<template>
  <ccmContentOverview :borderBottom="true">
    <template #top-left>
      <span class="project-title">{{ workItem?.title }}</span>
    </template>
    <template #top-right>
      <span class="project-tags">{{ workItem?.tags?.join(', ') }}</span>
    </template>
    <template #bottom-left>
      <span class="project-client">{{ workItem?.client }}</span>
    </template>
    <template #bottom-right>
      <span class="project-year">{{ workItem?.year }}</span>
    </template>
  </ccmContentOverview>

  <div class="stack">
    <section v-if="firstImage" class="first-image">
      <project-card class="grid-9"
        :image="firstImage.image || null"
        :mockupType="firstImage.mockupType || null"
      />
      <p class="grid-3">{{ workItem?.description }}</p>
    </section>

    <section v-if="brandingImages.length > 0">
      <project-card class="grid-6"
        v-for="(imageItem, index) in brandingImages"
        :key="index"
        :to="workItem?.path || workItem?._path || `/work/${slugParam}`"
        :brow="workItem?.client"
        :title="imageItem.title || workItem?.title"
        :tagline="imageItem.caption || workItem?.description"
        :image="imageItem.image || null"
        :mockupType="imageItem.mockupType || null"
      />
    </section>

    <section v-if="editorialImages.length > 0">
      <project-card class="grid-6"
        v-for="(imageItem, index) in editorialImages"
        :key="index"
        :image="imageItem.image || null"
        :mockupType="imageItem.mockupType || null"
      />
    </section>

    <section v-if="webImages.length > 0">
      <project-card class="grid-6"
        v-for="(imageItem, index) in webImages"
        :key="index"
        :image="imageItem.image || null"
        :mockupType="imageItem.mockupType || null"
      />
    </section>
  </div>

  <ccmNextNavigation
    v-if="nextProject"
    :to="nextProject.path"
    :title="nextProject.title"
  />
</template>

<style scoped>
section {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-xl);
}

h2 {
  font-size: var(--size-1);
  font-weight: 200;
  margin-block-start: var(--space-3xl);
  margin-block-end: var(--space-2xl);
}

.stack {
  --_stack-space: var(--space-3xl);
}

.project-title {
  font-size: var(--size-1);
  font-weight: 200;
}

.project-client {
  font-size: var(--size--1);
  font-weight: 600;
}

.project-tags {
  font-size: var(--size--1);
  font-weight: 400;
  text-transform: capitalize;
}

.project-year {
  font-size: var(--size--1);
}

@media (max-width: 768px) {
  [class*="grid-"] {
    grid-column: span 12;
  }
}

@media (min-width: 769px) {
  .grid-6 { grid-column: span 6; }
  .grid-9 { grid-column: span 9; }
  .grid-3 { grid-column: span 3; }
}

section:last-of-type {
  margin-block-end: var(--space-3xl);
}
</style>

<script setup>
const route = useRoute()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug

const { data: workItem } = await useAsyncData(`work-${slugParam}`, () => {
  return queryCollection('work').path(`/work/${slugParam}`).first()
})

const heroState = useState('hero', () => null)
if (workItem.value) {
  heroState.value = {
    brow: workItem.value.client || 'Work',
    title: workItem.value.title || 'Project',
    tagline: workItem.value.description || workItem.value.tagline || ''
  }
}

const imageItems = computed(() => {
  if (!workItem.value?.items) return []
  return workItem.value.items.filter((item) => item.type === 'image')
})

const firstImage = computed(() => {
  return imageItems.value[0] || null
})

const brandingImages = computed(() => {
  const first = firstImage.value
  return imageItems.value.filter((item) =>
    item.mockupType === 'branding' && item !== first
  )
})

const editorialImages = computed(() => {
  const first = firstImage.value
  return imageItems.value.filter((item) =>
    item.mockupType === 'editorial' && item !== first
  )
})

const webImages = computed(() => {
  const first = firstImage.value
  return imageItems.value.filter((item) =>
    item.mockupType === 'web' && item !== first
  )
})

const { data: allProjects } = await useAsyncData('all-work', () => {
  return queryCollection('work').where('published', '=', true).order('order', 'ASC').all()
})

const nextProject = computed(() => {
  if (!allProjects.value || !workItem.value) return null
  const currentPath = workItem.value.path
  const currentIndex = allProjects.value.findIndex(p => p.path === currentPath)
  if (currentIndex === -1) return null
  const nextIndex = (currentIndex + 1) % allProjects.value.length
  return allProjects.value[nextIndex]
})
</script>
