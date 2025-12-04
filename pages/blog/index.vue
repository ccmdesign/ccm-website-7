<template>
  <ccm-section>
    <div class="stack">

    <h2>Insights on Design, Data, and Social Impact</h2>
    <p>Welcome to our thinking space. Here, we share our expertise on the craft of designing for policy and research, creating effective knowledge products, and the nuances of ethical technology. Our goal is to provide value upfront, sharing what we've learned from our work with leading global organizations.</p>
    
    <div class="cluster">
      <ccm-button @click="setCategory('All Topics')">All Topics</ccm-button>
      <ccm-button @click="setCategory('Design Strategy')">Design Strategy</ccm-button>
      <ccm-button @click="setCategory('Research Communication')">Research Communication</ccm-button>
      <ccm-button @click="setCategory('Nonprofit & Foundation Strategy')">Nonprofit & Foundation Strategy</ccm-button>
      <ccm-button @click="setCategory('Content & Workflow')">Content & Workflow</ccm-button>
    </div>
  </div>
  </ccm-section>
  <ccm-section>
    <ccm-card v-for="post in filteredBlogPosts" :key="post._path" :to="post.path">
      <span>{{ post.meta.categories.join(', ') }}</span>
      <h4>{{ post.meta.brow }}</h4>
      <h3>{{ post.title || post._path }}</h3>
      <p>{{ post.meta.tagline }}</p>
    </ccm-card>
  </ccm-section>
  
  <ccm-cta-section />
    
</template>

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

<style scoped>

</style>
