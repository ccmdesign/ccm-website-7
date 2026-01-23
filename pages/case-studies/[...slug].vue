<template>
  <ccm-section>
    <div class=" | prose-layout | prose">      
      <ContentRenderer v-if="caseStudy" :value="caseStudy" />
      <div v-else>
        <h1>Case Study not found</h1>
        <NuxtLink to="/case-studies">← Back to Case Studies</NuxtLink>
      </div>
    </div>
  </ccm-section>
  
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const { data: caseStudy } = await useAsyncData(`case-study-${slugParam}`, () => {
  return queryCollection('casestudies').path(`/case-studies/${slugParam}`).first()
})

const config = useRuntimeConfig()
useSeoMeta({
  title: caseStudy.value?.title ? `${caseStudy.value.title} - ${config.public.siteName}` : config.public.siteName,
  description: caseStudy.value?.tagline || caseStudy.value?.description || config.public.siteDescription,
  ogTitle: caseStudy.value?.title || config.public.siteName,
  ogDescription: caseStudy.value?.tagline || caseStudy.value?.description || config.public.siteDescription,
  ogImage: caseStudy.value?.image || caseStudy.value?.featuredImage,
  ogUrl: caseStudy.value?.path ? `${config.public.siteUrl}${caseStudy.value.path}` : config.public.siteUrl,
  ogType: 'article',
  twitterCard: 'summary_large_image'
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