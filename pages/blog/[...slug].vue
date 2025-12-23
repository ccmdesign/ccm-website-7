<template>
  <NuxtLayout name="master-layout-sidebar-main">
    <template #hero>
      <hgroup>
        <h1 class="ccm-post-hero__title">{{ post?.title || 'Post Title' }}</h1>
        <p class="ccm-post-hero__tagline">{{ post?.meta?.tagline || post?.tagline || 'Post Tagline' }}</p>
      </hgroup>
      <div v-if="post?.meta?.tldr || post?.tldr" class="tldr">
        <p>{{ post?.meta?.tldr || post?.tldr }}</p>
      </div>
    </template>

    <template #sidebar>
      <div class="post-sidebar | stack">
        <p v-if="post?.meta?.date || post?.date" class="ccm-post__date">
          {{ formatDate(post?.meta?.date || post?.date, 'MMM d, yyyy') }}
        </p>
        <p v-if="post?.meta?.author || post?.author" class="ccm-post__author">By {{ post?.meta?.author }}</p>
        <div v-if="post?.meta?.categories?.length" class="cluster">
          <ccm-chip v-for="category in post?.meta?.categories" :key="category" class="chip">{{ category }}</ccm-chip>
        </div>
        <div v-if="post?.meta?.tags?.length" class="ccm-post__tags | cluster">
          <ccm-chip v-for="tag in post?.meta?.tags" :key="tag" class="chip">{{ tag }}</ccm-chip>
        </div>
      </div>
    </template>

    <template #main>
      <ContentRenderer v-if="post" :value="post" class="post-main-content | prose" />
    </template>
  </NuxtLayout>
</template>

<style>
.ccm-post-hero__title {
  font-size: var(--size-3);
  line-height: 1.15;
  font-weight: 100;
}

.ccm-post-hero__tagline {
  font-size: var(--size-1);
  line-height: 1.25;
}


.post-sidebar,
.post-main-content {
  padding-bottom: var(--space-3xl);
}

.ccm-post__tags {
  --_cluster-space: var(--space-xs);
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
    { name: 'description', content: post.value?.meta?.excerpt || post.value?.meta?.tagline || post.value?.tagline || 'Blog post from CCM Design Team' }
  ]
})

// Set hero data for layout
const heroState = useState('hero', () => null)
if (post.value) {
  heroState.value = {
    title: post.value.title,
    brow: post.value.meta?.brow || post.value.brow,
    tagline: post.value.meta?.tagline || post.value.tagline,
    date: post.value.meta?.date || post.value.date
  }
}
</script>

