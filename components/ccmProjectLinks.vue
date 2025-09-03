<template>
  <ccmBaseSection 
    v-if="organizedCrossReferences.length > 0"
    :class="['project-links', `project-links--${variant}`, props.class]"
    data-testid="project-links"
  >
    <header class="project-links__header">
      <h3 class="project-links__heading">
        {{ headingText }}
      </h3>
      <p 
        v-if="showDescription"
        class="project-links__description"
      >
        {{ descriptionText }}
      </p>
    </header>

    <div class="project-links__content">
      <!-- Tags/Categories variant - grouped by relationship type -->
      <div 
        v-if="variant === 'tags' || variant === 'categories'"
        class="project-links__groups"
      >
        <div 
          v-for="group in groupedReferences" 
          :key="group.type"
          class="project-links__group"
          :data-testid="`link-group-${group.type}`"
        >
          <h4 class="project-links__group-title">
            {{ getGroupTitle(group.type) }}
          </h4>
          <nav class="project-links__nav" role="navigation">
            <ul class="project-links__list">
              <li 
                v-for="reference in group.items" 
                :key="reference.target_slug"
                class="project-links__item"
              >
                <NuxtLink 
                  :to="getContentPath(reference)"
                  class="project-links__link project-links__link--tag"
                  :data-testid="`cross-ref-${reference.target_slug}`"
                >
                  <span class="project-links__link-title">
                    {{ getRelationshipTitle(reference) }}
                  </span>
                  <span 
                    class="project-links__link-type"
                    :data-type="reference.target_type"
                  >
                    {{ getContentTypeLabel(reference.target_type) }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Related variant - card layout with reasons -->
      <nav 
        v-else
        class="project-links__nav" 
        role="navigation"
        aria-label="Related content links"
      >
        <ul class="project-links__list project-links__list--cards">
          <li 
            v-for="reference in organizedCrossReferences" 
            :key="reference.target_slug"
            class="project-links__item"
          >
            <NuxtLink 
              :to="getContentPath(reference)"
              class="project-links__link project-links__link--card"
              :data-testid="`cross-ref-${reference.target_slug}`"
            >
              <article class="project-links__card">
                <header class="project-links__card-header">
                  <div class="project-links__card-meta">
                    <span 
                      class="project-links__card-type"
                      :data-type="reference.target_type"
                    >
                      {{ getContentTypeLabel(reference.target_type) }}
                    </span>
                    <span class="project-links__card-relationship">
                      {{ getRelationshipTypeLabel(reference.relationship_type) }}
                    </span>
                  </div>
                  <h4 class="project-links__card-title">
                    {{ getRelationshipTitle(reference) }}
                  </h4>
                </header>
                
                <!-- Computed reason display -->
                <div 
                  v-if="showReasons && reference.computed_reason"
                  class="project-links__card-reason"
                >
                  <p class="project-links__reason-text">
                    {{ reference.computed_reason }}
                  </p>
                </div>
                
                <!-- Bidirectional indicator -->
                <footer class="project-links__card-footer">
                  <span class="project-links__direction">
                    {{ getBidirectionalLabel(reference) }}
                  </span>
                  <span 
                    class="project-links__strength"
                    :data-strength="getStrengthLevel(reference.strength)"
                  >
                    {{ Math.round(reference.strength * 100) }}% match
                  </span>
                </footer>
              </article>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </ccmBaseSection>
</template>

<script setup lang="ts">
/**
 * Project Links component that displays cross-references between blog posts
 * and case studies. Shows bidirectional relationships with computed reasons
 * and supports multiple display variants for different contexts.
 * 
 * Uses tag similarity and category matching algorithms to show relevant
 * content connections with relationship strength indicators.
 * 
 * @component ccmProjectLinks
 * @example
 * ```vue
 * <ccmProjectLinks 
 *   :source-content="currentPost"
 *   :cross-references="bidirectionalRelationships"
 *   variant="related"
 *   :show-reasons="true"
 * />
 * ```
 * 
 * @since 1.3.0
 * @see {@link ProjectLinksProps} for props interface
 * @see {@link ContentRelationship} for relationship data structure
 */

import type { BlogPost, CaseStudy, ContentRelationship, RelationshipType } from '~/types/content'
import type { ProjectLinksProps } from '~/types/components'

/**
 * Component props with default values
 */
const props = withDefaults(defineProps<ProjectLinksProps>(), {
  variant: 'related',
  showReasons: false
})

/**
 * Organize cross-references by strength and filter by source
 */
const organizedCrossReferences = computed(() => {
  return props.crossReferences
    .filter(ref => ref.source_slug === props.sourceContent.slug)
    .sort((a, b) => b.strength - a.strength)
})

/**
 * Group references by relationship type for tags/categories variants
 */
const groupedReferences = computed(() => {
  const groups = new Map<RelationshipType, ContentRelationship[]>()
  
  organizedCrossReferences.value.forEach(ref => {
    if (!groups.has(ref.relationship_type)) {
      groups.set(ref.relationship_type, [])
    }
    groups.get(ref.relationship_type)!.push(ref)
  })
  
  return Array.from(groups.entries()).map(([type, items]) => ({
    type,
    items: items.sort((a, b) => b.strength - a.strength)
  }))
})

/**
 * Dynamic heading text based on variant and content
 */
const headingText = computed(() => {
  const count = organizedCrossReferences.value.length
  if (count === 0) return ''
  
  switch (props.variant) {
    case 'tags':
      return 'Related Topics'
    case 'categories':
      return 'In This Category'
    case 'related':
    default:
      return count === 1 ? 'Related Content' : 'Related Content'
  }
})

/**
 * Show description for certain variants
 */
const showDescription = computed(() => {
  return props.variant === 'related' && props.showReasons
})

/**
 * Dynamic description text
 */
const descriptionText = computed(() => {
  const sourceType = 'title' in props.sourceContent && 'date' in props.sourceContent ? 'blog post' : 'case study'
  return `Content related to this ${sourceType} based on shared topics, categories, and themes.`
})

/**
 * Generate content path for navigation
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
 */
const getRelationshipTitle = (relationship: ContentRelationship): string => {
  // Format slug as title
  return relationship.target_slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get group title for relationship type groups
 */
const getGroupTitle = (relationshipType: RelationshipType): string => {
  const titles = {
    same_category: 'Same Category',
    shared_tags: 'Shared Topics',
    same_client: 'Same Client',
    similar_services: 'Similar Services',
    content_mention: 'Cross References'
  }
  return titles[relationshipType] || relationshipType
}

/**
 * Get relationship type label for display
 */
const getRelationshipTypeLabel = (type: RelationshipType): string => {
  const labels = {
    same_category: 'Same Category',
    shared_tags: 'Shared Topics',
    same_client: 'Client Work',
    similar_services: 'Similar Services',
    content_mention: 'Mentioned'
  }
  return labels[type] || type
}

/**
 * Get bidirectional relationship label
 */
const getBidirectionalLabel = (relationship: ContentRelationship): string => {
  const sourceType = getContentTypeLabel(relationship.source_type)
  const targetType = getContentTypeLabel(relationship.target_type)
  return `${sourceType} → ${targetType}`
}

/**
 * Convert strength to categorical level
 */
const getStrengthLevel = (strength: number): string => {
  if (strength >= 0.8) return 'high'
  if (strength >= 0.6) return 'medium'
  return 'low'
}
</script>

<style scoped>
/**
 * Project Links Component Styles
 * Supports multiple variants with different layouts and information density
 */

.project-links {
  container-type: inline-size;
}

.project-links__header {
  margin-bottom: var(--spacing-md, 1rem);
}

.project-links__heading {
  font-size: var(--font-size-lg, 1.125rem);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary, #1a1a1a);
  margin: 0 0 var(--spacing-xs, 0.5rem) 0;
}

.project-links__description {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
  line-height: 1.5;
}

/* Groups layout for tags/categories variants */
.project-links__groups {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 1.5rem);
}

.project-links__group {
  /* Group container */
}

.project-links__group-title {
  font-size: var(--font-size-md, 1rem);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-primary, #1a1a1a);
  margin: 0 0 var(--spacing-sm, 0.75rem) 0;
}

.project-links__nav {
  /* Navigation landmark */
}

.project-links__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Tag/Category variant - horizontal pill layout */
.project-links--tags .project-links__list,
.project-links--categories .project-links__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs, 0.5rem);
}

/* Related variant - vertical card layout */
.project-links__list--cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 0.75rem);
}

.project-links__item {
  /* List item container */
}

.project-links__link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: all 0.2s ease;
}

/* Tag-style links */
.project-links__link--tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs, 0.5rem);
  padding: var(--spacing-xs, 0.5rem) var(--spacing-sm, 0.75rem);
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border-light, #e5e5e5);
  border-radius: var(--border-radius-full, 9999px);
  font-size: var(--font-size-sm, 0.875rem);
}

.project-links__link--tag:hover {
  background: var(--color-surface-hover, #f9fafb);
  border-color: var(--color-border-hover, #d1d5db);
  transform: translateY(-1px);
}

.project-links__link-title {
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-text-primary, #1a1a1a);
}

.project-links__link-type {
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: var(--font-weight-medium, 500);
  padding: 0.125rem 0.375rem;
  border-radius: var(--border-radius-sm, 0.375rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-links__link-type[data-type="blog"] {
  background: var(--color-blog-bg, #e0f2fe);
  color: var(--color-blog-text, #0369a1);
}

.project-links__link-type[data-type="case_study"] {
  background: var(--color-case-study-bg, #f0fdf4);
  color: var(--color-case-study-text, #15803d);
}

/* Card-style links */
.project-links__link--card {
  /* Full card container */
}

.project-links__card {
  padding: var(--spacing-md, 1rem);
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border-light, #e5e5e5);
  border-radius: var(--border-radius-md, 0.5rem);
  transition: all 0.2s ease;
}

.project-links__card:hover {
  border-color: var(--color-border-hover, #d1d5db);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1));
  transform: translateY(-1px);
}

.project-links__card-header {
  margin-bottom: var(--spacing-sm, 0.75rem);
}

.project-links__card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm, 0.75rem);
  margin-bottom: var(--spacing-xs, 0.5rem);
}

.project-links__card-type {
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: var(--font-weight-medium, 500);
  padding: 0.125rem 0.375rem;
  border-radius: var(--border-radius-sm, 0.375rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-links__card-type[data-type="blog"] {
  background: var(--color-blog-bg, #e0f2fe);
  color: var(--color-blog-text, #0369a1);
}

.project-links__card-type[data-type="case_study"] {
  background: var(--color-case-study-bg, #f0fdf4);
  color: var(--color-case-study-text, #15803d);
}

.project-links__card-relationship {
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-text-tertiary, #9ca3af);
  font-weight: var(--font-weight-medium, 500);
}

.project-links__card-title {
  font-size: var(--font-size-md, 1rem);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary, #1a1a1a);
  margin: 0;
  line-height: 1.4;
}

.project-links__card-reason {
  margin-bottom: var(--spacing-sm, 0.75rem);
}

.project-links__reason-text {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
  line-height: 1.4;
  font-style: italic;
}

.project-links__card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm, 0.75rem);
  padding-top: var(--spacing-sm, 0.75rem);
  border-top: 1px solid var(--color-border-light, #e5e5e5);
}

.project-links__direction {
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-text-tertiary, #9ca3af);
  font-weight: var(--font-weight-medium, 500);
}

.project-links__strength {
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: var(--font-weight-medium, 500);
  padding: 0.125rem 0.375rem;
  border-radius: var(--border-radius-sm, 0.375rem);
}

.project-links__strength[data-strength="high"] {
  background: var(--color-success-bg, #dcfce7);
  color: var(--color-success-text, #15803d);
}

.project-links__strength[data-strength="medium"] {
  background: var(--color-warning-bg, #fef3c7);
  color: var(--color-warning-text, #d97706);
}

.project-links__strength[data-strength="low"] {
  background: var(--color-neutral-bg, #f3f4f6);
  color: var(--color-neutral-text, #6b7280);
}

/* Responsive adjustments */
@container (max-width: 400px) {
  .project-links__groups {
    gap: var(--spacing-md, 1rem);
  }
  
  .project-links__card-footer {
    flex-direction: column;
    gap: var(--spacing-xs, 0.5rem);
    align-items: flex-start;
  }
  
  .project-links__card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs, 0.5rem);
  }
}

/* Variant-specific responsive behavior */
@container (max-width: 600px) {
  .project-links--tags .project-links__list,
  .project-links--categories .project-links__list {
    gap: var(--spacing-xs, 0.5rem);
  }
  
  .project-links__link--tag {
    padding: var(--spacing-xs, 0.5rem);
    font-size: var(--font-size-xs, 0.75rem);
  }
}
</style>