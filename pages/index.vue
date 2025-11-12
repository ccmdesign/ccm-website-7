<template>

  <ccm-section>
    <ccm-client-list />
  </ccm-section>

  <ccm-section>
    <div class="text-align:center padding-block:l">
      <h2 class="h1">Latest Blog Posts</h2>
    </div>
    <div v-if="blogPosts && blogPosts.length > 0" class="stack">
      <ccm-card v-for="post in blogPosts.slice(0, 3)" :key="post.path" :to="post.path">
        <h4>{{ post.meta.brow }}</h4>
        <h3>{{ post.title }}</h3>
        <p>{{ post.meta.tagline }}</p>
      </ccm-card>

      <div class="text-align:center padding-block:m">
        <ccm-button color="primary" to="/blog">View all blog posts</ccm-button>
      </div>
    </div>
    <p v-else>No blog posts found</p>
  </ccm-section>

  <ccm-section>
    <div class="text-align:center padding-block:l">
      <h2 class="h1">Case Studies</h2>
    </div>
    <div v-if="caseStudies && caseStudies.length > 0" class="stack">
      <ccm-card v-for="study in caseStudies.slice(0, 3)" :key="study.path" :to="study.path">
        <h4>{{ study.meta.brow }}</h4>
        <h3>{{ study.title }}</h3>
        <p>{{ study.meta.tagline }}</p>
      </ccm-card>
      <div class="text-align:center padding-block:m">
        <ccm-button color="primary" to="/case-studies">View all case studies</ccm-button>
      </div>
    </div>
    <p v-else>No case studies found</p>
  </ccm-section>
</template>

<script setup>
definePageMeta({
  hero: {
    brow: '',
    title: 'We build systems',
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    backgroundColor: 'color-accent',
  }
})

const { data: blogPosts } = await useAsyncData('home-blog-posts', async () => {
  const posts = await queryCollection('blog').all()
  // Since published field parsing is broken, just show all posts for now
  return posts.sort((a, b) => new Date(b.date || '1970-01-01') - new Date(a.date || '1970-01-01'))
})

const { data: caseStudies } = await useAsyncData('home-case-studies', async () => {
  const studies = await queryCollection('casestudies').all()
  // Sort manually since database queries aren't working
  return studies.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
})
</script>

<style scoped>
.stack { --_stack-space: 0; }
</style>