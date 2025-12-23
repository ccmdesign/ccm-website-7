<template>
  <portfolio-section>
    <template #header>
      <div class="work-filters | cluster | margin-inline:auto padding-bottom:xl">
        <button
          class="menu-item | h5"
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
      v-for="(workItem, index) in workItemsWithImages" 
      :key="workItem.id || index" 
      :to="workItem.path" 
      :image="workItem.image || null"
      :mockupType="workItem.mockupType || null"
    />
  </portfolio-section>
</template>

<style scoped lang="css">

.work-filters {
  --_cluster-space: var(--space-xl);
}
button {
  all: unset;
  cursor: pointer;
  background-color: transparent;
  color: var(--color-base-tint-40);
  transition: all 0.3s ease;
  line-height: 1;
  letter-spacing: .5px;
}

button[aria-active] {
  color: var(--color-primary-tint-80);
  transform: scale(1);
}
</style>


<script setup>
definePageMeta({
  hero: {
    brow: 'Portfolio',
    title: 'Our Work',
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    typewriterWords: ['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']
  }
})

const { data: workItems } = await useAsyncData('work-items', () => {
  return queryCollection('work')
    .where('published', '=', true)
    .order('order', 'ASC')
    .all()
})

const activeFilter = ref('all')

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Editorial', value: 'editorial' },
  { label: 'Branding', value: 'branding' }
]

const setFilter = (value) => {
  activeFilter.value = value
}

const filteredWorkItems = computed(() => {
  if (!workItems.value) return []
  
  if (activeFilter.value === 'all') {
    return workItems.value
  }
  
  return workItems.value.filter(item => {
    const tags = item.tags || []
    return tags.includes(activeFilter.value)
  })
})

const getWorkPath = (item) => {
  return item.path ?? item._path ?? (item.stem ? `/work/${item.stem}` : null) ?? (item._file ? `/work/${item._file.replace('.md', '')}` : '#')
}

const getFirstImage = (item, activeFilter = 'all') => {
  if (!item.items || !Array.isArray(item.items)) return null
  
  const images = item.items.filter(i => i.type === 'image')
  if (images.length === 0) return null
  
  const coverImages = images.filter(i => i.cover === true)
  
  if (activeFilter === 'all') {
    return coverImages[0] || images[0] || null
  }
  
  const matchingCover = coverImages.find(i => i.mockupType === activeFilter)
  if (matchingCover) return matchingCover
  
  const matchingImage = images.find(i => i.mockupType === activeFilter)
  if (matchingImage) return matchingImage
  
  return coverImages[0] || images[0] || null
}

const workItemsWithImages = computed(() => {
  return filteredWorkItems.value.map(item => {
    const imageData = getFirstImage(item, activeFilter.value)
    return {
      ...item,
      path: getWorkPath(item),
      image: imageData?.image || null,
      mockupType: imageData?.mockupType || null
    }
  })
})
</script>