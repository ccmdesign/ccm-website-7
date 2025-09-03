<template>
  <ccmBaseSection 
    v-if="filteredRelationships.length > 0"
    :class="['related-posts', `related-posts--${variant}`, props.class]"
    data-testid="related-posts"
  >
    <header class="related-posts__header">
      <h3 class="related-posts__heading">
        {{ headingText }}
      </h3>
    </header>
    
    <nav class="related-posts__nav" role="navigation" aria-label="Related content">
      <ul class="related-posts__list">
        <li 
          v-for="relationship in filteredRelationships" 
          :key="relationship.target_slug"
          class="related-posts__item"
        >
          <NuxtLink 
            :to="getContentPath(relationship)"
            class="related-posts__link"
            :data-testid="`related-link-${relationship.target_slug}`"
          >
            <article class="related-posts__card">
              <header class="related-posts__card-header">
                <span 
                  class="related-posts__type"
                  :data-type="relationship.target_type"
                >
                  {{ getContentTypeLabel(relationship.target_type) }}
                </span>
                <h4 class="related-posts__card-title">
                  {{ getRelationshipTitle(relationship) }}
                </h4>
              </header>
              
              <!-- Relationship reason (when enabled) -->
              <p 
                v-if="showReasons && relationship.computed_reason"
                class="related-posts__reason"
                data-testid="relationship-reason"
              >
                {{ relationship.computed_reason }}
              </p>
              
              <!-- Strength indicator -->
              <div class="related-posts__meta">
                <span 
                  class="related-posts__strength"
                  :data-strength="getStrengthLevel(relationship.strength)"
                  :title="`Relevance: ${Math.round(relationship.strength * 100)}%`"
                >
                  {{ getStrengthLabel(relationship.strength) }}
                </span>
              </div>
            </article>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </ccmBaseSection>
</template>

<script setup lang="ts">
/**
 * Related Posts component that displays content relationships based on 
 * computed algorithms from useContentRelationships composable. Supports
 * multiple display variants and filtering by relationship strength.
 * 
 * Used to show related blog posts and case studies with semantic HTML
 * structure optimized for static generation and accessibility.
 * 
 * @component ccmRelatedPosts
 * @example
 * ```vue
 * <ccmRelatedPosts 
 *   :current-item="currentPost" 
 *   :relationships="relationships"
 *   :limit="5"
 *   variant="sidebar"
 * />
 * ```
 * 
 * @since 1.3.0
 * @see {@link RelatedPostsProps} for props interface
 * @see {@link ContentRelationship} for relationship data structure
 */

import type { BlogPost, CaseStudy, ContentRelationship } from '~/types/content'
import type { RelatedPostsProps } from '~/types/components'

/**
 * Component props with default values and validation
 */
const props = withDefaults(defineProps<RelatedPostsProps>(), {
  limit: 5,
  variant: 'inline'
})

/**
 * Filter relationships by source content and apply limit
 * Only show relationships where current item is the source
 */
const filteredRelationships = computed(() => {
  return props.relationships
    .filter(rel => rel.source_slug === props.currentItem.slug)
    .sort((a, b) => b.strength - a.strength) // Sort by strength descending
    .slice(0, props.limit)
})

/**
 * Dynamic heading text based on variant and content type
 */
const headingText = computed(() => {
  const count = filteredRelationships.value.length
  if (count === 0) return ''
  
  switch (props.variant) {
    case 'sidebar':
      return 'Related Content'
    case 'footer':
      return 'You Might Also Like'
    case 'inline':
    default:
      return count === 1 ? 'Related Post' : 'Related Posts'
  }
})

/**
 * Whether to show relationship reasons based on variant
 */
const showReasons = computed(() => {
  return props.variant === 'inline' || props.variant === 'sidebar'
})

/**
 * Generate content path for NuxtLink navigation
 * Maps content type to appropriate route structure
 */
const getContentPath = (relationship: ContentRelationship): string => {
  const baseUrl = relationship.target_type === 'blog' ? '/blog' : '/case-studies'
  return `${baseUrl}/${relationship.target_slug}`
}

/**
 * Get display label for content type
 */
const getContentTypeLabel = (type: string): string => {
  return type === 'blog' ? 'Blog Post' : 'Case Study'
}

/**
 * Get relationship title from relationship data
 * Uses computed title or falls back to slug formatting
 */
const getRelationshipTitle = (relationship: ContentRelationship): string => {
  // In a real implementation, this would lookup the actual content title
  // For now, format the slug as a title
  return relationship.target_slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Convert numeric strength to categorical level
 */
const getStrengthLevel = (strength: number): string => {
  if (strength >= 0.8) return 'high'
  if (strength >= 0.6) return 'medium'
  return 'low'
}

/**
 * Get user-friendly strength label
 */
const getStrengthLabel = (strength: number): string => {
  const level = getStrengthLevel(strength)
  const labels = {
    high: 'Highly Related',
    medium: 'Related',
    low: 'Somewhat Related'
  }
  return labels[level as keyof typeof labels]
}
</script>

<style scoped>
/**
 * Related Posts Component Styles
 * Following ccm component patterns with CSS layer integration
 */

.related-posts {
  container-type: inline-size;
}

.related-posts__header {
  margin-bottom: var(--spacing-md, 1rem);
}

.related-posts__heading {
  font-size: var(--font-size-lg, 1.25rem);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary, #1a1a1a);
  margin: 0;
}

.related-posts__nav {
  /* Navigation landmark for accessibility */
}

.related-posts__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 0.75rem);
}

/* Variant: Sidebar - Compact vertical layout */
.related-posts--sidebar .related-posts__list {
  gap: var(--spacing-xs, 0.5rem);
}

/* Variant: Footer - Horizontal grid layout */
.related-posts--footer .related-posts__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md, 1rem);
}

/* Variant: Inline - Full-width cards */
.related-posts--inline .related-posts__list {
  gap: var(--spacing-md, 1rem);
}

.related-posts__item {
  /* List item container */
}

.related-posts__link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: all 0.2s ease;
}

.related-posts__link:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1));
}

.related-posts__card {
  border: 1px solid var(--color-border-light, #e5e5e5);
  border-radius: var(--border-radius-sm, 0.375rem);
  padding: var(--spacing-sm, 0.75rem);
  background: var(--color-surface, #ffffff);
  transition: all 0.2s ease;
}

.related-posts__card:hover {
  border-color: var(--color-border-hover, #d1d5db);
  background: var(--color-surface-hover, #f9fafb);
}

.related-posts__card-header {
  margin-bottom: var(--spacing-xs, 0.5rem);
}

.related-posts__type {
  display: inline-block;
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: var(--font-weight-medium, 500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: var(--border-radius-xs, 0.25rem);
  margin-bottom: var(--spacing-xs, 0.5rem);
}

.related-posts__type[data-type="blog"] {
  background: var(--color-blog-bg, #e0f2fe);
  color: var(--color-blog-text, #0369a1);
}

.related-posts__type[data-type="case_study"] {
  background: var(--color-case-study-bg, #f0fdf4);
  color: var(--color-case-study-text, #15803d);
}

.related-posts__card-title {
  font-size: var(--font-size-md, 1rem);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-primary, #1a1a1a);
  margin: 0;
  line-height: 1.4;
}

.related-posts__reason {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #6b7280);
  margin: var(--spacing-xs, 0.5rem) 0;
  line-height: 1.4;
}

.related-posts__meta {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-xs, 0.5rem);
}

.related-posts__strength {
  font-size: var(--font-size-xs, 0.75rem);
  padding: 2px 6px;
  border-radius: var(--border-radius-xs, 0.25rem);
  font-weight: var(--font-weight-medium, 500);
}

.related-posts__strength[data-strength="high"] {
  background: var(--color-success-bg, #dcfce7);
  color: var(--color-success-text, #15803d);
}

.related-posts__strength[data-strength="medium"] {
  background: var(--color-warning-bg, #fef3c7);
  color: var(--color-warning-text, #d97706);
}

.related-posts__strength[data-strength="low"] {
  background: var(--color-neutral-bg, #f3f4f6);
  color: var(--color-neutral-text, #6b7280);
}

/* Responsive behavior using container queries */
@container (max-width: 300px) {
  .related-posts--footer .related-posts__list {
    grid-template-columns: 1fr;
  }
  
  .related-posts__reason {
    display: none;
  }
}

/* Sidebar variant compact styles */
.related-posts--sidebar .related-posts__card {
  padding: var(--spacing-xs, 0.5rem);
}

.related-posts--sidebar .related-posts__card-title {
  font-size: var(--font-size-sm, 0.875rem);
}

.related-posts--sidebar .related-posts__reason {
  font-size: var(--font-size-xs, 0.75rem);
}
</style>