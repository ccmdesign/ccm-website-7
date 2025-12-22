<template>
    <article class="article | center">
      <div class="blog-post-container">
        <ContentRenderer v-if="post" :value="post" class="post-main-content | prose" />
      </div>
    </article>
</template>

<style>

</style>

<script setup>

definePageMeta({
  layout: 'article-layout'
})

const route = useRoute()
const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () => {
  return queryCollection('blog').path(`/blog/${route.params.slug}`).first()
})

const renderedTldr = computed(() => {
  if (!post.value?.meta?.tldr) return ''
  return md.render(post.value.meta.tldr)
})

// Set page title
useHead({
  title: post.value?.title || 'Blog Post',
  meta: [
    { name: 'description', content: post.value?.meta?.excerpt || post.value?.meta?.tagline || 'Blog post from CCM Design Team' }
  ]
})

// Set hero data for layout
const heroState = useState('hero', () => null)
if (post.value) {
  heroState.value = {
    title: post.value.title || post.value.meta?.title,
    brow: post.value.brow || post.value.meta?.brow,
    tagline: post.value.tagline || post.value.meta?.tagline
  }
}



</script>

