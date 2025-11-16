<template>
  <portfolio-section section-title="" class="padding-block:3xl">
    <template #header>
      <div class="work-filters | cluster | margin-inline:auto">
        <button
          class="h5"
          v-for="filter in filters"
          :key="filter.value"
          :aria-active="activeFilter === filter.value ? 'true' : undefined"
          @click="setFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
    </template>
    
    <project-card 
      v-for="workItem in filteredWorkItems" 
      :key="getWorkPath(workItem)" 
      :to="getWorkPath(workItem)" 
      :brow="workItem.client" 
      :title="workItem.title" 
      :tagline="workItem.description"
      :image="getFirstImage(workItem, activeFilter)?.image || null"
      :mockupType="getFirstImage(workItem, activeFilter)?.mockupType || null"
    />
  </portfolio-section>
</template>

<script setup>
definePageMeta({
  layout: 'minimal',
  hero: {
    brow: 'Portfolio',
    title: 'Work',
    tagline: 'See our work',
    backgroundColor: 'color-accent',
  }
})

const { data: workItems } = await useAsyncData('work-items', () => {
  return queryCollection('work').all()
})

// Debug: log the data structure
watch(workItems, (items) => {
  if (items && items.length > 0) {
    console.log('Work items sample:', items[0])
    console.log('First item tags:', items[0].tags)
  }
}, { immediate: true })

const activeFilter = ref('all')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Editorial', value: 'editorial' },
  { label: 'Branding', value: 'branding' }
]

const setFilter = (value) => {
  console.log('Filter clicked:', value)
  activeFilter.value = value
  console.log('Active filter set to:', activeFilter.value)
}

const filteredWorkItems = computed(() => {
  if (!workItems.value) return []
  
  if (activeFilter.value === 'all') {
    return workItems.value
  }
  
  const filtered = workItems.value.filter(item => {
    const tags = item.tags || []
    const hasTag = tags.includes(activeFilter.value)
    console.log(`Item: ${item.title}, tags:`, tags, `filter: ${activeFilter.value}, matches:`, hasTag)
    return hasTag
  })
  
  console.log(`Filtered ${filtered.length} items for filter: ${activeFilter.value}`)
  return filtered
})

const getWorkPath = (item) => {
  // Try path properties first
  if (item.path) return item.path
  if (item._path) return item._path
  
  // Fallback: construct from _file
  if (item._file) {
    const filename = item._file.replace('.md', '')
    return `/work/${filename}`
  }
  
  return '#'
}

const getFirstImage = (item, activeFilter = 'all') => {
  if (!item.items || !Array.isArray(item.items)) return null
  
  const images = item.items.filter(i => i.type === 'image')
  if (images.length === 0) return null
  
  // Find cover images
  const coverImages = images.filter(i => i.cover === true)
  
  // Debug logging
  if (item.title === 'People-led Innovation') {
    console.log(`[${item.title}] Active filter:`, activeFilter)
    console.log(`[${item.title}] Cover images:`, coverImages.map(c => ({ 
      mockupType: c.mockupType, 
      cover: c.cover,
      image: c.image?.split('/').pop() 
    })))
  }
  
  if (activeFilter === 'all') {
    // Return first cover, or fallback to first image
    return coverImages[0] || images[0] || null
  }
  
  // Match mockupType to active filter
  const matchingCover = coverImages.find(i => i.mockupType === activeFilter)
  if (matchingCover) {
    if (item.title === 'People-led Innovation') {
      console.log(`[${item.title}] Found matching cover:`, matchingCover.image?.split('/').pop())
    }
    return matchingCover
  }
  
  // If no cover for this mockupType, return first image with matching mockupType
  const matchingImage = images.find(i => i.mockupType === activeFilter)
  if (matchingImage) {
    if (item.title === 'People-led Innovation') {
      console.log(`[${item.title}] Found matching image (no cover):`, matchingImage.image?.split('/').pop())
    }
    return matchingImage
  }
  
  // Final fallback: first cover or first image (for edge cases)
  if (item.title === 'People-led Innovation') {
    console.log(`[${item.title}] Using fallback:`, coverImages[0]?.image?.split('/').pop() || images[0]?.image?.split('/').pop())
  }
  return coverImages[0] || images[0] || null
}
</script>

<style scoped>
.work-filters {
  --_cluster-space: var(--space-2xl);

  button {
    border: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
    background-color: transparent;
    color: var(--color-base-tint-40);
    transition: all 0.3s ease;
    line-height: .7;
  }

  button[aria-active] {
    transition: all 0.3s ease;
    color: var(--color-primary);
    transform: scale(1.2);
    transform-origin: bottom center;
    

  }
}




</style>