<template>
  <portfolio-section class="padding-block:3xl">
    <project-header
      v-if="workItem"
      :title="workItem.title"
      :client="workItem.client"
      :description="workItem.description"
    />
  </portfolio-section>
  <portfolio-section v-if="workItem">
    <template v-for="(item, index) in workItem.items" :key="index">
      <image-card
        v-if="item.type === 'image'"
        :image="item.image"
        :title="item.title"
        :caption="item.caption"
        :mockupType="item.mockupType || null"
      />
      <project-info
        v-else-if="item.type === 'text'"
        :content="item.content"
        :heading="item.heading"
      />
    </template>
  </portfolio-section>
</template>

<script setup>
definePageMeta({
  layout: 'work-layout'
})

const route = useRoute()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const { data: workItem } = await useAsyncData(`work-${slugParam}`, () => {
  return queryCollection('work').path(`/work/${slugParam}`).first()
})

// Provide hero data from content front-matter (if present) to layout via shared state
const heroState = useState('hero', () => null)
if (workItem.value) {
  const doc = workItem.value
  heroState.value = {
    brow: doc.brow || doc.meta?.brow,
    title: doc.title || doc.meta?.title,
    tagline: doc.tagline || doc.meta?.tagline,
    backgroundColor: doc.backgroundColor || doc.meta?.backgroundColor,
    size: doc.size || doc.meta?.size,
    client: doc.client || doc.meta?.client,
    project: doc.project || doc.meta?.project,
    hideTopbar: doc.hideTopbar ?? doc.meta?.hideTopbar,
    hideBottom: doc.hideBottom ?? doc.meta?.hideBottom,
    variant: doc.variant || doc.meta?.variant
  }
}
</script>

<style scoped>

</style>