<template>
  <ccmBaseSection 
    v-if="projects.length > 0"
    :class="['client-portfolio', `client-portfolio--${variant}`, props.class]"
    data-testid="client-portfolio"
  >
    <header class="client-portfolio__header">
      <h2 class="client-portfolio__heading">
        {{ clientName }} Portfolio
      </h2>
      <p class="client-portfolio__description">
        {{ portfolioDescription }}
      </p>
    </header>

    <ccmMasterGrid class="client-portfolio__grid">
      <div 
        v-for="project in limitedProjects" 
        :key="project.slug"
        class="client-portfolio__item"
        :data-testid="`portfolio-item-${project.slug}`"
      >
        <NuxtLink 
          :to="`/case-studies/${project.slug}`"
          class="client-portfolio__link"
        >
          <article class="client-portfolio__card">
            <!-- Featured Image -->
            <div 
              v-if="showImages && project.featured_image"
              class="client-portfolio__image-container"
            >
              <img 
                :src="project.featured_image"
                :alt="`${project.title} featured image`"
                class="client-portfolio__image"
                loading="lazy"
              />
            </div>
            
            <!-- Project Content -->
            <div class="client-portfolio__content">
              <header class="client-portfolio__card-header">
                <h3 class="client-portfolio__card-title">
                  {{ project.title }}
                </h3>
                
                <!-- Sector Badge -->
                <span 
                  class="client-portfolio__sector"
                  data-testid="project-sector"
                >
                  {{ project.sector }}
                </span>
              </header>
              
              <!-- Challenge Preview -->
              <p class="client-portfolio__challenge">
                <strong>Challenge:</strong> {{ truncateText(project.challenge, 120) }}
              </p>
              
              <!-- Services Tags -->
              <div class="client-portfolio__services">
                <span 
                  v-for="service in project.services" 
                  :key="service"
                  class="client-portfolio__service-tag"
                  data-testid="service-tag"
                >
                  {{ service }}
                </span>
              </div>
              
              <!-- Related Content Count -->
              <div 
                v-if="getRelatedContentCount(project) > 0"
                class="client-portfolio__related-count"
              >
                <span class="client-portfolio__related-indicator">
                  {{ getRelatedContentCount(project) }} related {{ getRelatedContentCount(project) === 1 ? 'post' : 'posts' }}
                </span>
              </div>
            </div>
          </article>
        </NuxtLink>
      </div>
    </ccmMasterGrid>
    
    <!-- View All Link for carousel/limited variants -->
    <footer 
      v-if="projects.length > displayLimit" 
      class="client-portfolio__footer"
    >
      <NuxtLink 
        :to="`/case-studies?client=${encodeURIComponent(clientName)}`"
        class="client-portfolio__view-all"
        data-testid="view-all-projects"
      >
        View All {{ clientName }} Projects ({{ projects.length }})
      </NuxtLink>
    </footer>
  </ccmBaseSection>
</template>

<script setup lang="ts">
/**
 * Client Portfolio component that displays case studies grouped by client
 * organization. Shows project previews with relationship indicators and
 * supports multiple layout variants for different display contexts.
 * 
 * Integrates with ccmMasterGrid for responsive layout and maintains
 * consistent styling with existing ccm component patterns.
 * 
 * @component ccmClientPortfolio
 * @example
 * ```vue
 * <ccmClientPortfolio 
 *   :client-name="'Stanford Research Center'"
 *   :projects="clientProjects"
 *   :relationships="relationships"
 *   variant="grid"
 *   :show-images="true"
 * />
 * ```
 * 
 * @since 1.3.0
 * @see {@link ClientPortfolioProps} for props interface
 * @see {@link CaseStudy} for project data structure
 */

import type { CaseStudy, ContentRelationship } from '~/types/content'
import type { ClientPortfolioProps } from '~/types/components'

/**
 * Component props with default values
 */
const props = withDefaults(defineProps<ClientPortfolioProps>(), {
  variant: 'grid',
  showImages: true
})

/**
 * Display limit based on variant
 */
const displayLimit = computed(() => {
  switch (props.variant) {
    case 'carousel':
      return 3
    case 'list':
      return 6
    case 'grid':
    default:
      return 9
  }
})

/**
 * Limited projects for display based on variant
 */
const limitedProjects = computed(() => {
  return props.projects.slice(0, displayLimit.value)
})

/**
 * Dynamic portfolio description based on project count and types
 */
const portfolioDescription = computed(() => {
  const count = props.projects.length
  const sectors = [...new Set(props.projects.map(p => p.sector))]
  
  if (count === 1) {
    return `1 project in ${sectors[0]}`
  } else if (sectors.length === 1) {
    return `${count} projects in ${sectors[0]}`
  } else {
    return `${count} projects across ${sectors.length} sectors`
  }
})

/**
 * Get count of related content for a project
 * Counts relationships where this project is the source
 */
const getRelatedContentCount = (project: CaseStudy): number => {
  return props.relationships.filter(rel => 
    rel.source_slug === project.slug && rel.source_type === 'case_study'
  ).length
}

/**
 * Truncate text to specified length with ellipsis
 */
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}
</script>

<style scoped>
/**
 * Client Portfolio Component Styles
 * Uses ccmMasterGrid integration and responsive design patterns
 */

.client-portfolio {
  container-type: inline-size;
}

.client-portfolio__header {
  text-align: center;
  margin-bottom: var(--spacing-xl, 2rem);
}

.client-portfolio__heading {
  font-size: var(--font-size-2xl, 1.875rem);
  font-weight: var(--font-weight-bold, 700);
  color: var(--color-text-primary, #1a1a1a);
  margin: 0 0 var(--spacing-sm, 0.75rem) 0;
}

.client-portfolio__description {
  font-size: var(--font-size-lg, 1.125rem);
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
}

.client-portfolio__grid {
  margin-bottom: var(--spacing-lg, 1.5rem);
}

/* Grid Layout Variants */
.client-portfolio--grid .client-portfolio__grid {
  --grid-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg, 1.5rem);
}

.client-portfolio--list .client-portfolio__grid {
  --grid-columns: 1fr;
  gap: var(--spacing-md, 1rem);
}

.client-portfolio--carousel .client-portfolio__grid {
  --grid-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md, 1rem);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.client-portfolio__item {
  scroll-snap-align: start;
}

.client-portfolio__link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.client-portfolio__card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border-light, #e5e5e5);
  border-radius: var(--border-radius-md, 0.5rem);
  overflow: hidden;
  transition: all 0.3s ease;
}

.client-portfolio__card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg, 0 10px 25px rgba(0,0,0,0.1));
  border-color: var(--color-border-hover, #d1d5db);
}

.client-portfolio__image-container {
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--color-neutral-100, #f3f4f6);
}

.client-portfolio__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.client-portfolio__card:hover .client-portfolio__image {
  transform: scale(1.05);
}

.client-portfolio__content {
  padding: var(--spacing-md, 1rem);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.client-portfolio__card-header {
  margin-bottom: var(--spacing-sm, 0.75rem);
}

.client-portfolio__card-title {
  font-size: var(--font-size-lg, 1.125rem);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--color-text-primary, #1a1a1a);
  margin: 0 0 var(--spacing-xs, 0.5rem) 0;
  line-height: 1.4;
}

.client-portfolio__sector {
  display: inline-block;
  font-size: var(--font-size-xs, 0.75rem);
  font-weight: var(--font-weight-medium, 500);
  background: var(--color-primary-100, #e0f2fe);
  color: var(--color-primary-700, #0369a1);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm, 0.375rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.client-portfolio__challenge {
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-text-secondary, #6b7280);
  line-height: 1.5;
  margin: 0 0 var(--spacing-sm, 0.75rem) 0;
  flex-grow: 1;
}

.client-portfolio__services {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs, 0.5rem);
  margin-bottom: var(--spacing-sm, 0.75rem);
}

.client-portfolio__service-tag {
  font-size: var(--font-size-xs, 0.75rem);
  background: var(--color-neutral-100, #f3f4f6);
  color: var(--color-neutral-700, #374151);
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm, 0.375rem);
  font-weight: var(--font-weight-medium, 500);
}

.client-portfolio__related-count {
  margin-top: auto;
}

.client-portfolio__related-indicator {
  font-size: var(--font-size-xs, 0.75rem);
  color: var(--color-text-tertiary, #9ca3af);
  font-style: italic;
}

.client-portfolio__footer {
  text-align: center;
  margin-top: var(--spacing-lg, 1.5rem);
}

.client-portfolio__view-all {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs, 0.5rem);
  font-size: var(--font-size-md, 1rem);
  font-weight: var(--font-weight-medium, 500);
  color: var(--color-primary-600, #2563eb);
  text-decoration: none;
  padding: var(--spacing-sm, 0.75rem) var(--spacing-md, 1rem);
  border: 1px solid var(--color-primary-200, #bfdbfe);
  border-radius: var(--border-radius-md, 0.5rem);
  transition: all 0.2s ease;
}

.client-portfolio__view-all:hover {
  background: var(--color-primary-50, #eff6ff);
  border-color: var(--color-primary-300, #93c5fd);
  transform: translateY(-1px);
}

/* Responsive adjustments */
@container (max-width: 600px) {
  .client-portfolio--grid .client-portfolio__grid {
    --grid-columns: 1fr;
  }
  
  .client-portfolio--carousel .client-portfolio__grid {
    --grid-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

/* List variant specific styles */
.client-portfolio--list .client-portfolio__card {
  flex-direction: row;
  align-items: stretch;
}

.client-portfolio--list .client-portfolio__image-container {
  flex: 0 0 200px;
  aspect-ratio: 4/3;
}

.client-portfolio--list .client-portfolio__content {
  flex: 1;
}

@container (max-width: 600px) {
  .client-portfolio--list .client-portfolio__card {
    flex-direction: column;
  }
  
  .client-portfolio--list .client-portfolio__image-container {
    flex: none;
    aspect-ratio: 16/9;
  }
}
</style>