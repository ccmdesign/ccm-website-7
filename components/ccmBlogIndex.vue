<template>
  <ccmBaseSection class="blog-index">
    <!-- Index Header -->
    <header class="blog-index__header">
      <h1 class="blog-index__title">Blog</h1>
      <p class="blog-index__description">
        Research communication insights, client engagement strategies, and technical innovation.
      </p>
    </header>

    <!-- Featured Posts Section -->
    <section 
      v-if="featuredPosts && featuredPosts.length > 0"
      class="blog-index__featured"
      aria-labelledby="featured-heading"
    >
      <h2 id="featured-heading" class="blog-index__section-title">
        Featured Posts
      </h2>
      
      <div class="blog-index__featured-grid">
        <article
          v-for="post in featuredPosts"
          :key="post.slug"
          class="featured-post"
          @click="handlePostClick(post)"
        >
          <ccmContentMeta 
            :content="post"
            :show-author="true"
            :show-categories="true"
            date-format="long"
          />
          
          <p v-if="post.excerpt" class="featured-post__excerpt">
            {{ post.excerpt }}
          </p>
        </article>
      </div>
    </section>

    <!-- Main Content List -->
    <section 
      class="blog-index__main"
      aria-labelledby="all-posts-heading"
    >
      <ccmContentList
        :items="displayPosts"
        :variant="variant"
        :filterable="filterable"
        :show-relationships="showRelationships"
        :heading="allPostsHeading"
        heading-level="2"
        @content-click="handlePostClick"
        @filter-change="handleFilterChange"
      />
    </section>
  </ccmBaseSection>
</template>

<script setup lang="ts">
/**
 * Blog Index Page Component
 * 
 * Displays comprehensive listing of blog posts with featured content highlighting
 * and filtering capabilities. Integrates with existing ccmContentList component
 * for consistent content presentation and follows established ccm design patterns.
 * 
 * Used for blog listing page (/blog) to showcase all available blog content
 * with semantic HTML structure optimized for SEO and accessibility.
 * 
 * @component ccmBlogIndex
 * @example
 * ```vue
 * <ccmBlogIndex 
 *   :blog-posts="allBlogPosts" 
 *   :featured-posts="featuredBlogPosts"
 *   variant="grid"
 *   :filterable="true"
 * />
 * ```
 * 
 * @since 1.4.0
 * @see {@link BlogPost} for blog post data structure
 * @see {@link ccmContentList} for content listing functionality
 */

import type { BlogPost } from '~/types/content'
import type { ContentFilters } from '~/types/components'

interface BlogIndexProps {
  /** Array of blog posts from useContentPipeline composable */
  blogPosts: BlogPost[]
  
  /** Optional featured blog posts for highlighting */
  featuredPosts?: BlogPost[]
  
  /** Display variant for content list */
  variant?: 'grid' | 'list' | 'compact'
  
  /** Enable filtering controls for content discovery */
  filterable?: boolean
  
  /** Show content relationship indicators */
  showRelationships?: boolean
  
  /** Additional CSS classes for styling customization */
  class?: string
}

interface BlogIndexEmits {
  /** Emitted when blog post is clicked for navigation */
  (e: 'post-click', post: BlogPost): void
  
  /** Emitted when content filters are changed */
  (e: 'filter-change', filters: ContentFilters): void
}

/**
 * Component props with sensible defaults for blog listing
 */
const props = withDefaults(defineProps<BlogIndexProps>(), {
  variant: 'list',
  filterable: true,
  showRelationships: false,
  class: ''
})

/**
 * Component event emissions for parent component communication
 */
const emit = defineEmits<BlogIndexEmits>()

/**
 * Computed property to filter out featured posts from main list
 * Prevents duplication when featured posts are displayed separately
 */
const displayPosts = computed(() => {
  if (!props.featuredPosts || props.featuredPosts.length === 0) {
    return props.blogPosts
  }
  
  const featuredSlugs = new Set(props.featuredPosts.map(post => post.slug))
  return props.blogPosts.filter(post => !featuredSlugs.has(post.slug))
})

/**
 * Dynamic heading based on whether featured posts are shown
 * Provides appropriate context for the main content list
 */
const allPostsHeading = computed(() => {
  if (props.featuredPosts && props.featuredPosts.length > 0) {
    return 'All Posts'
  }
  return '' // No heading when no featured posts section exists
})

/**
 * Handles blog post click events with proper navigation emission
 * Provides consistent interaction pattern across all post listings
 */
const handlePostClick = (post: BlogPost) => {
  emit('post-click', post)
}

/**
 * Handles content filter changes from ccmContentList component
 * Passes filter state to parent for potential URL state management
 */
const handleFilterChange = (filters: ContentFilters) => {
  emit('filter-change', filters)
}
</script>

<style scoped>
.blog-index {
  --_section-gap: var(--space-xl);
  --_featured-gap: var(--space-l);
}

.blog-index__header {
  text-align: center;
  margin-bottom: var(--_section-gap);
  padding-bottom: var(--space-l);
  border-bottom: 2px solid var(--color-border-subtle, #e5e5e5);
}

.blog-index__title {
  font-size: var(--size-4);
  font-weight: 700;
  margin: 0 0 var(--space-s) 0;
  color: var(--color-text-primary, #1a1a1a);
}

.blog-index__description {
  font-size: var(--size-1);
  color: var(--color-text-secondary, #666);
  max-width: 60ch;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
}

.blog-index__featured {
  margin-bottom: var(--_section-gap);
}

.blog-index__section-title {
  font-size: var(--size-2);
  font-weight: 600;
  margin: 0 0 var(--space-l) 0;
  color: var(--color-text-primary, #1a1a1a);
}

.blog-index__featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--_featured-gap);
}

.featured-post {
  padding: var(--space-l);
  background: var(--color-background-subtle, #f9f9f9);
  border-radius: var(--border-radius-l, 12px);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid var(--color-border-subtle, #e5e5e5);
}

.featured-post:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary, #0066cc);
}

.featured-post__excerpt {
  font-size: var(--size-0);
  color: var(--color-text-secondary, #666);
  line-height: var(--line-height-relaxed);
  margin: var(--space-s) 0 0 0;
}

.blog-index__main {
  margin-top: var(--_section-gap);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .blog-index__featured-grid {
    grid-template-columns: 1fr;
    gap: var(--space-m);
  }
  
  .blog-index__title {
    font-size: var(--size-3);
  }
  
  .blog-index__description {
    font-size: var(--size-0);
  }
  
  .featured-post {
    padding: var(--space-m);
  }
}
</style>