<template>
  <ccmBlogIndex
    :blog-posts="processedBlogPosts"
    :featured-posts="featuredPosts"
    variant="list"
    :filterable="true"
    :show-relationships="true"
    @post-click="navigateToPost"
    @filter-change="handleFilterChange"
  />
</template>

<script setup lang="ts">
/**
 * Blog Index Page
 * 
 * Static page that displays all blog posts using the ccmBlogIndex component
 * integrated with useContentPipeline for build-time content processing.
 * Generates static HTML during `nuxt generate` for optimal performance.
 * 
 * @page /blog
 * @since 1.4.0
 */

import type { BlogPost } from '~/types/content'
import type { ContentFilters } from '~/types/components'

// Use content pipeline to process blog posts during build
const { processAllContent } = useContentPipeline()
const contentResult = await processAllContent()

// Extract processed blog posts from pipeline result
const processedBlogPosts = contentResult.success 
  ? contentResult.content.blogPosts 
  : []

// Select featured posts (first 2 most recent posts for highlighting)
const featuredPosts = computed(() => {
  return processedBlogPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2)
})

/**
 * Handles blog post navigation with proper Nuxt routing
 */
const navigateToPost = (post: BlogPost) => {
  navigateTo(`/blog/${post.slug}`)
}

/**
 * Handles filter changes for analytics or URL state management
 */
const handleFilterChange = (filters: ContentFilters) => {
  // Could emit to analytics or update URL query params
  console.log('Blog filters changed:', filters)
}

// Set page meta for SEO and accessibility
useHead({
  title: 'Blog - Research Communication Insights',
  meta: [
    {
      name: 'description',
      content: 'Research communication insights, client engagement strategies, and technical innovation from CCM consultancy work.'
    }
  ]
})
</script>