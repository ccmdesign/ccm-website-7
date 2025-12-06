<template>
  <ccm-section>
    <div class="cluster">
      <ccm-button @click="setCategory('All Topics')">All Topics</ccm-button>
      <ccm-button @click="setCategory('Design Strategy')">Design Strategy</ccm-button>
      <ccm-button @click="setCategory('Research Communication')">Research Communication</ccm-button>
      <ccm-button @click="setCategory('Nonprofit & Foundation Strategy')">Nonprofit & Foundation Strategy</ccm-button>
      <ccm-button @click="setCategory('Content & Workflow')">Content & Workflow</ccm-button>
    </div>
  </ccm-section>

  <ccm-section>
    <ul class="portfolio-section__content">
      <li class="portfolio-item" v-for="post in filteredBlogPosts" :key="post._path">
        <ccm-post-card 
          :to="post.path"
          :categories="post.meta.categories.join(', ')"
          :brow="post.meta.brow"
          :title="post.title"
        />
      </li>
    </ul>
  </ccm-section>
  
  <ccm-cta-section />
    
</template>

<style scoped>
.cluster,
ul { 
  grid-column: 3/9; 
  padding: 0;
}
</style>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  hero: {
    brow: 'Blog',
    title: 'Insights',
    tagline: 'Insights on Design, Data, and Social Impact',
    backgroundColor: 'color-accent',
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
</script>

