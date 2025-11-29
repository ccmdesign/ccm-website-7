<template>

  <!-- <ccm-section>
    <div class="text-align:center padding-block:l">
      <h2 class="h1">Latest Blog Posts</h2>
    </div>
    <div v-if="blogPosts && blogPosts.length > 0" class="stack">
      <BlogPostCard
        v-for="post in blogPosts.slice(0, 3)"
        :key="post.path"
        :to="post.path"
        :brow="post.meta?.brow"
        :title="post.title ?? ''"
        :tagline="post.meta?.tagline"
      />

      <div class="text-align:center padding-block:m">
        <ccm-button color="primary" to="/blog">View all blog posts</ccm-button>
      </div>
    </div>
    <p v-else>No blog posts found</p>
  </ccm-section> -->



<portfolio-section section-title="Work" class="padding-block:3xl">
  <project-card
    v-for="workItem in workItems.slice(0, 5)"
    :key="getWorkPath(workItem)"
    :to="getWorkPath(workItem)"
    :brow="workItem.client"
    :title="workItem.title ?? ''"
    :tagline="workItem.description"
    :image="getFirstImage(workItem)?.image || null"
    :mockupType="getFirstImage(workItem)?.mockupType || null"
  />
  <template #footer>
    <div class="text-align:center padding-block:m">
      <ccm-button size="xl" class="portfolio-section__button" color="primary" to="/work">View all case studies</ccm-button>
    </div>
  </template>
</portfolio-section>
  
</template>

<script setup>
definePageMeta({
  hero: {
    brow: '',
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    backgroundColor: 'color-accent',
    typewriterWords: ['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence'],
  }
})

const { data: blogPosts } = await useAsyncData('home-blog-posts', async () => {
  const posts = await queryCollection('blog').all()
  // Since published field parsing is broken, just show all posts for now
  return posts.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'))
})

const { data: workItems } = await useAsyncData('home-work-items', async () => {
  const items = await queryCollection('work').all()
  return items.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
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
  if (!item.items || !Array.isArray(item.items)) return null
  
  const images = item.items.filter(i => i.type === 'image')
  if (images.length === 0) return null
  
  // Find cover images
  const coverImages = images.filter(i => i.cover === true)
  
  // Return first cover, or fallback to first image
  return coverImages[0] || images[0] || null
}

const randomSize = () => {
  const sizes = ['xl', 'l', 'm']
  return sizes[Math.floor(Math.random() * sizes.length)]
}
</script>

<style scoped>
.stack { --_stack-space: 0; }
</style>
