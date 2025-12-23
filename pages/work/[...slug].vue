<template>

<section class="overview">
  <div class="overview-row">
    <div class="project-title">{{ workItem?.title }}</div>
    <div class="project-tags">{{ workItem?.tags?.join(', ') }}</div>
  </div>
  <div class="overview-row">
    <div class="border-top project-client">{{ workItem?.client }}</div>
    <div class="border-top project-year">{{ workItem?.year }}</div>
  </div>

</section>
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
</template>

<style scoped>
section {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  margin-inline: var(--system-padding-edge);
  gap: var(--space-xl);
}

h2 {
  font-size: var(--size-1);
  font-weight: 200;
  margin-block-start: var(--space-3xl);
  margin-block-end: var(--space-2xl);
}


@media (max-width: 768px) {
  .overview {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);

    > * {
      flex: 1;
      flex-basis: 0;
      display: flex;
      flex-direction: column;
    }
  }
}

@media (min-width: 769px) {
  .overview {
    display: table;
    width: calc(100% - var(--system-padding-edge) * 2);
    table-layout: fixed;
    color: var(--color-base-tint-80);
    padding-block: var(--space-3xl);
  }
  .overview-row {
    display: table-row;
  }
  .overview-row > div {
    display: table-cell;
  }
}

.border-top {
  border-top: 1px solid var(--color-base-tint-20);
  padding-block-start: var(--space-s);
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
  @media (min-width: 769px) {text-align: right; }
  font-size: var(--size--1);
  font-weight: 400;
  text-transform: capitalize;
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
</script>


