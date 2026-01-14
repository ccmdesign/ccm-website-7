<template>
  <NuxtLayout name="default">
    <template #master-layout-hero>
      <ccmHero class="post-hero">
      <hgroup class="center">
        <div class="stack post-hero-content">
          <h1>{{ post?.title }}</h1>
          <h3 class="h2" v-if="post?.tagline">{{ post?.tagline }}</h3>
          <MDC :value="post?.tldr" />
        </div>
      </hgroup>  
      
      </ccmHero>
    </template>

    <section v-if="post?.tldr" class="tldr-section">
      <div class="center">
        
      </div>
    </section>

    <ccmContentOverview class="padding-block:3xl">
      <template #top>
        <span class="meta">{{ post?.author }}</span>
        <span class="meta">{{ post?.date ? formatDate(post?.date, 'MMM d, yyyy') : '' }}</span>
      </template>
      <template #bottom>
        <span class="cluster"><ccmChip v-for="tag in post?.tags" :key="tag" :label="tag" /></span>
      </template>
    </ccmContentOverview>

    <section class="post-content">
      <div class="stack">
        <ContentRenderer v-if="post" :value="post" class="prose" />
      </div>
    </section>

    <ccmNextNavigation
      v-if="nextPost"
      :to="nextPost.path"
      :title="nextPost.title"
    />
  </NuxtLayout>
</template>

<style scoped>

.post-hero .stack { --_stack-space: var(--space-xl); }
.post-hero .stack > * { width: 100%; }
.post-content .stack { --_stack-space: var(--space-3xl); }


.meta {
  font-size: var(--size--1);
}

.cluster {
  --_cluster-space: var(--space-xs);
}


section:last-of-type {
  margin-block-end: var(--space-3xl);
}

@media (max-width: 480px) {
  .post-hero-content > h1 { font-size: calc(var(--size-1) * 1.35) !important; }
  .post-hero-content > h3 { font-size: var(--size-1) !important; }
}
</style>

<script setup>
import { formatDate } from '~/utils/formatDate'

definePageMeta({
  layout: false
})

const route = useRoute()
const slugParam = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const { data: post } = await useAsyncData(`blog-${slugParam}`, async () => {
  if (!slugParam) return null
  return await queryCollection('blog').path(`/blog/${slugParam}`).first()
})

// Set page title
useHead({
  title: post.value?.title || 'Blog Post',
  meta: [
    { name: 'description', content: post.value?.excerpt || post.value?.tagline || 'Blog post from CCM Design Team' }
  ]
})

// Get all published blog posts for next post navigation
const { data: allPosts } = await useAsyncData('all-blog', () => {
  return queryCollection('blog').where('published', '=', true).order('date', 'DESC').all()
})

const nextPost = computed(() => {
  if (!allPosts.value || !post.value) return null
  const currentPath = post.value.path
  const currentIndex = allPosts.value.findIndex(p => p.path === currentPath)
  if (currentIndex === -1) return null
  const nextIndex = (currentIndex + 1) % allPosts.value.length
  return allPosts.value[nextIndex]
})
</script>
