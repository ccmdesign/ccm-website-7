<template>
  <NuxtLayout name="master-layout-sidebar-main">
    <template #hero>
      <ccm-hero
        brow="Blog"
        title="Insights"
        tagline="Insights on Design, Data, and Social Impact"
      />
    </template>

    <template #sidebar>
      <div class="sidebar-content | stack">
        <ul v-if="blogPosts?.length > 0" class="categories-list | stack">
          <li><ccm-chip :active="selectedCategory === 'All Topics'" @click="setCategory('All Topics')">All Topics</ccm-chip></li>
          <li v-for="category in allCategories" :key="category"><ccm-chip :active="selectedCategory === category" @click="setCategory(category)">{{ category }}</ccm-chip></li>
        </ul>
        <ccm-cta-section />
      </div>
    </template>

    <template #main>
        <TransitionGroup 
          tag="ul" 
          name="fade" 
          class="portfolio-section__content | center"
        >
          <ccm-post-card class="portfolio-item" v-for="post in filteredBlogPosts" :key="post._path"
            :to="post.path"
            :categories="post.categories?.join(', ') || ''"
            :brow="post.brow"
            :title="post.title"
            :tldr="post.tldr"
            :date="post.date"
          />
        </TransitionGroup>
    </template>
  </NuxtLayout>
</template>

<style scoped>

.categories-list { 
  align-items: flex-end;
}

ul {
  padding-inline: 0;
}

.portfolio-section__content {
  --_center-measure: 60ch;;
}

.sidebar-content { 
  padding-inline-end: var(--space-3xl);
  position: sticky;
  top: var(--space-3xl);
}

/* Fade transition for filtering */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}

.fade-move {
  transition: transform 0.3s ease;
}

</style>

<script setup>

import { ref, computed } from 'vue';

definePageMeta({
  layout: false
})

const { data: blogPosts } = await useAsyncData('blog-posts', async () => {
  const posts = await queryCollection('blog').where('published', '=', true).all()
  // Exclude drafts folder
  const filteredPosts = posts.filter(post => !post._path?.includes('/_drafts/'))
  
  // Filter out future posts
  const today = new Date().toISOString().split('T')[0]
  const nonFuturePosts = filteredPosts.filter(post => post.date && post.date <= today)
  
  // Sort by date (reverse chronological - newest first)
  return nonFuturePosts.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const selectedCategory = ref('All Topics');

const allCategories = computed(() => {
  if (!blogPosts.value) return []
  const cats = blogPosts.value.flatMap(post => post.categories || [])
  return [...new Set(cats)].sort()
})

const filteredBlogPosts = computed(() => {
  if (!blogPosts.value) {
    return [];
  }
  if (selectedCategory.value === 'All Topics') {
    return blogPosts.value;
  }
  return blogPosts.value.filter(post => post.categories?.includes(selectedCategory.value));
});

function setCategory(category) {
  selectedCategory.value = category;
}
</script>

