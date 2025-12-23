<template>
  <NuxtLayout name="master-layout-sidebar-main">
    <template #hero>
      <hgroup>
        <h1 class="ccm-post-hero__title">{{ post?.title || 'Post Title' }}</h1>
        <p class="ccm-post-hero__tagline">{{ post?.tagline || 'Post Tagline' }}</p>
      </hgroup>
      <div v-if="post?.tldr" class="tldr">
        <p>{{ post?.tldr }}</p>
      </div>
    </template>

    <template #sidebar>
      <div class="post-sidebar | stack">
        <p v-if="post?.date" class="ccm-post__date">
          {{ formatDate(post?.date, 'MMM d, yyyy') }}
        </p>
        <p v-if="post?.author" class="ccm-post__author">By {{ post?.author }}</p>
        <div>
          <ul v-if="post?.categories?.length" class="ccm-post__categories | stack">
            <li v-for="category in post?.categories" :key="category"><ccm-chip class="chip">{{ category }}</ccm-chip></li>
          </ul>
        </div>
        <div>
          <ul v-if="post?.tags?.length" class="ccm-post__tags | stack">
            <li v-for="tag in post?.tags" :key="tag"><ccm-chip class="chip">{{ tag }}</ccm-chip></li>
          </ul>
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

.post-sidebar {
  text-align: right;
  padding-right: var(--space-3xl);
  --_stack-space: var(--space-xl);

}

.post-sidebar,
.post-main-content {
  padding-bottom: var(--space-3xl);
}


.ccm-post__categories,
.ccm-post__tags {

  align-items: flex-end;

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

// Set hero data for layout
const heroState = useState('hero', () => null)
if (post.value) {
  heroState.value = {
    title: post.value.title,
    brow: post.value.brow,
    tagline: post.value.tagline,
    date: post.value.date
  }
}
</script>

