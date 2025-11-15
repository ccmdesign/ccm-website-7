<template>
<portfolio-section>
  <img :src="`/assets/portfolio/bfna/${randomImage()}`" :alt="title" />
</portfolio-section>
</template>

<script setup>
definePageMeta({
  layout: 'work-layout'
})

const route = useRoute()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const { data: caseStudy } = await useAsyncData(`case-study-${slugParam}`, () => {
  return queryCollection('casestudies').path(`/case-studies/${slugParam}`).first()
})

// Provide hero data from content front-matter (if present) to layout via shared state
const heroState = useState('hero', () => null)
if (caseStudy.value) {
  const doc = caseStudy.value
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