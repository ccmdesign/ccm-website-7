<template>
  <ccm-section full-width>
  <div class="blog-post | prose-layout | prose">
    <ContentRenderer v-if="post" :value="post" class="post-main-content | prose" />
    <div v-else>
      <h1>Post not found</h1>
        <NuxtLink to="/blog">← Back to Blog</NuxtLink>
      </div>
    </div>
  </ccm-section>
</template>

<script setup>
definePageMeta({
  layout: 'article-layout'
})


const route = useRoute()
const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () => {
  return queryCollection('blog').path(`/blog/${route.params.slug}`).first()
})

// Set page title
useHead({
  title: post.value?.title || 'Blog Post',
  meta: [
    { name: 'description', content: post.value?.meta?.excerpt || post.value?.meta?.tagline || 'Blog post from CCM Design Team' }
  ]
})

// Provide hero data from content frontmatter to layout via shared state
const heroState = useState('hero', () => null)
if (post.value) {
  heroState.value = {
    brow: post.value.meta?.brow || 'Blog',
    title: post.value.title,
    tagline: post.value.meta?.tagline || post.value.meta?.excerpt || 'Blog Post',
    date: post.value.meta?.date,
    author: post.value.meta?.author || 'CCM Design Team',
    tags: post.value.meta?.tags || [],
    backgroundColor: 'color-primary-tint-20',
    size: 'l',
    hideTopbar: false,
    hideBottom: true,
    variant: 'minimal'
  }
}

</script>

<style>

</style>