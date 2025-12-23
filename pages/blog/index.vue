<template>

  <ccm-section v-if="blogPosts?.length > 0" class="padding-bottom:xl">
    <div class="cluster">
      <ccm-chip :active="selectedCategory === 'All Topics'" @click="setCategory('All Topics')">All Topics</ccm-chip>
      <ccm-chip v-if="hasPostsInCategory('Design Strategy')" :active="selectedCategory === 'Design Strategy'" @click="setCategory('Design Strategy')">Design Strategy</ccm-chip>
      <ccm-chip v-if="hasPostsInCategory('Research Communication')" :active="selectedCategory === 'Research Communication'" @click="setCategory('Research Communication')">Research Communication</ccm-chip>
      <ccm-chip v-if="hasPostsInCategory('Nonprofit & Foundation Strategy')" :active="selectedCategory === 'Nonprofit & Foundation Strategy'" @click="setCategory('Nonprofit & Foundation Strategy')">Nonprofit & Foundation Strategy</ccm-chip>
      <ccm-chip v-if="hasPostsInCategory('Content & Workflow')" :active="selectedCategory === 'Content & Workflow'" @click="setCategory('Content & Workflow')">Content & Workflow</ccm-chip>
    </div>
  </ccm-section>

  <ccm-section>
    <ul class="portfolio-section__content">
      <ccm-post-card class="portfolio-item" v-for="post in filteredBlogPosts" :key="post._path"
        :to="post.path"
        :categories="post.meta.categories.join(', ')"
        :brow="post.meta.brow"
        :title="post.title"
        :tldr="post.meta.tldr"
      />
    </ul>
  </ccm-section>
  
  <ccm-cta-section />
    
</template>

<style scoped>

.cluster {
  --_cluster-space: var(--space-s);
}

.cluster,
ul { 
  grid-column: 3/11; 
  padding: 0;
}
</style>

<script setup>

import { ref, computed } from 'vue';

definePageMeta({
  layout: 'default',

  hero: {
    brow: 'Blog',
    title: 'Insights',
    tagline: 'Insights on Design, Data, and Social Impact',
  }
})

const { data: blogPosts } = await useAsyncData('blog-posts', () => {
  return queryCollection('blog').where('published', '=', true).all()
})

const selectedCategory = ref('All Topics');

const filteredBlogPosts = computed(() => {
  if (!blogPosts.value) {
    return [];
  }
  if (selectedCategory.value === 'All Topics') {
    return blogPosts.value;
  }
  return blogPosts.value.filter(post => post.meta.brow === selectedCategory.value);
});

function setCategory(category) {
  selectedCategory.value = category;
}

function hasPostsInCategory(category) {
  if (!blogPosts.value) return false;
  return blogPosts.value.some(post => post.meta.brow === category);
}
</script>

