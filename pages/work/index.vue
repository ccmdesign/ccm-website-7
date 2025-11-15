<template>
  <portfolio-section section-title="">
    <project-card 
      v-for="workItem in workItems" 
      :key="getWorkPath(workItem)" 
      :to="getWorkPath(workItem)" 
      :brow="workItem.client" 
      :title="workItem.title" 
      :tagline="workItem.description"
      :image="getFirstImage(workItem)"
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

const getFirstImage = (item) => {
  if (item.items && Array.isArray(item.items)) {
    const firstImageItem = item.items.find(i => i.type === 'image')
    return firstImageItem?.image || null
  }
  return null
}
</script>

<style scoped>
/* No custom styles needed - using stack layout class */
</style>