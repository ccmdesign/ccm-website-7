<template>
  <ccmBaseSection class="case-study-index">
    <!-- Index Header -->
    <header class="case-study-index__header">
      <h1 class="case-study-index__title">Case Studies</h1>
      <p class="case-study-index__description">
        Portfolio of client engagements showcasing strategic technology implementation and research communication excellence.
      </p>
    </header>

    <!-- Sector Filter -->
    <div 
      v-if="availableSectors.length > 1"
      class="case-study-index__sector-filter"
    >
      <h2 class="visually-hidden">Filter by Sector</h2>
      <div class="sector-pills">
        <button
          :class="['sector-pill', { 'sector-pill--active': selectedSector === '' }]"
          @click="selectSector('')"
        >
          All Sectors
        </button>
        <button
          v-for="sector in availableSectors"
          :key="sector"
          :class="['sector-pill', { 'sector-pill--active': selectedSector === sector }]"
          @click="selectSector(sector)"
        >
          {{ sector }}
        </button>
      </div>
    </div>

    <!-- Case Study Grid -->
    <section 
      class="case-study-index__grid"
      aria-labelledby="case-studies-heading"
    >
      <h2 id="case-studies-heading" class="visually-hidden">
        {{ selectedSector ? `${selectedSector} Case Studies` : 'All Case Studies' }}
      </h2>
      
      <div :class="gridClasses">
        <article
          v-for="caseStudy in displayedCaseStudies"
          :key="caseStudy.slug"
          class="case-study-card"
          @click="handleCaseStudyClick(caseStudy)"
        >
          <!-- Case Study Image -->
          <div 
            v-if="showImages && caseStudy.featured_image"
            class="case-study-card__image"
          >
            <img 
              :src="caseStudy.featured_image"
              :alt="`${caseStudy.title} featured image`"
              loading="lazy"
            />
          </div>
          
          <!-- Case Study Content -->
          <div class="case-study-card__content">
            <!-- Metadata -->
            <div class="case-study-card__meta">
              <span class="case-study-card__client">{{ caseStudy.client }}</span>
              <span class="case-study-card__sector">{{ caseStudy.sector }}</span>
            </div>
            
            <!-- Title -->
            <h3 class="case-study-card__title">
              {{ caseStudy.title }}
            </h3>
            
            <!-- Challenge Excerpt -->
            <p 
              v-if="caseStudy.challenge"
              class="case-study-card__challenge"
            >
              {{ caseStudy.challenge }}
            </p>
            
            <!-- Services -->
            <div 
              v-if="caseStudy.services.length > 0"
              class="case-study-card__services"
            >
              <span 
                v-for="service in limitedServices(caseStudy.services)"
                :key="service"
                class="service-tag"
              >
                {{ service }}
              </span>
            </div>
            
            <!-- Relationship Indicator -->
            <div 
              v-if="showRelationships && caseStudy.relationships.length > 0"
              class="case-study-card__relationships"
            >
              <span class="relationships-indicator">
                {{ caseStudy.relationships.length }} related {{ caseStudy.relationships.length === 1 ? 'item' : 'items' }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
    
    <!-- Empty State -->
    <div 
      v-if="displayedCaseStudies.length === 0"
      class="case-study-index__empty"
    >
      <p>
        {{ selectedSector ? `No case studies found for ${selectedSector} sector.` : 'No case studies available.' }}
      </p>
      <button 
        v-if="selectedSector"
        class="reset-filter-btn"
        @click="selectSector('')"
      >
        Show All Sectors
      </button>
    </div>
  </ccmBaseSection>
</template>

<script setup lang="ts">
/**
 * Case Study Index Page Component
 * 
 * Displays portfolio of case studies with sector-based filtering and 
 * grid layout optimized for showcasing client work. Integrates with
 * existing ccmMasterGrid system for responsive design.
 * 
 * Used for case study listing page (/case-studies) to present client
 * portfolio with professional presentation and discovery features.
 * 
 * @component ccmCaseStudyIndex
 * @example
 * ```vue
 * <ccmCaseStudyIndex 
 *   :case-studies="allCaseStudies"
 *   variant="showcase"
 *   :show-images="true"
 * />
 * ```
 * 
 * @since 1.4.0
 * @see {@link CaseStudy} for case study data structure
 * @see {@link ccmMasterGrid} for layout system integration
 */

import type { CaseStudy } from '~/types/content'

interface CaseStudyIndexProps {
  /** Array of case studies from useContentPipeline composable */
  caseStudies: CaseStudy[]
  
  /** Display variant for portfolio layout */
  variant?: 'portfolio' | 'grid' | 'showcase'
  
  /** Whether to show featured images in cards */
  showImages?: boolean
  
  /** Show content relationship indicators */
  showRelationships?: boolean
  
  /** Additional CSS classes for styling customization */
  class?: string
}

interface CaseStudyIndexEmits {
  /** Emitted when case study is clicked for navigation */
  (e: 'case-study-click', caseStudy: CaseStudy): void
  
  /** Emitted when sector filter is changed */
  (e: 'sector-filter', sector: string): void
}

/**
 * Component props with sensible defaults for case study portfolio
 */
const props = withDefaults(defineProps<CaseStudyIndexProps>(), {
  variant: 'grid',
  showImages: true,
  showRelationships: false,
  class: ''
})

/**
 * Component event emissions for parent component communication
 */
const emit = defineEmits<CaseStudyIndexEmits>()

/**
 * Reactive state for sector filtering
 */
const selectedSector = ref('')

/**
 * Computed property to extract unique sectors for filtering
 * Provides sector-based content discovery
 */
const availableSectors = computed(() => {
  const sectors = new Set(props.caseStudies.map(cs => cs.sector))
  return Array.from(sectors).sort()
})

/**
 * Computed property to filter case studies by selected sector
 * Enables focused portfolio browsing by industry
 */
const displayedCaseStudies = computed(() => {
  if (!selectedSector.value) {
    return props.caseStudies
  }
  return props.caseStudies.filter(cs => cs.sector === selectedSector.value)
})

/**
 * Dynamic grid classes based on variant and image display
 * Adapts layout to content presentation requirements
 */
const gridClasses = computed(() => {
  const baseClass = 'case-study-grid'
  const variantClass = `case-study-grid--${props.variant}`
  const imageClass = props.showImages ? 'case-study-grid--with-images' : 'case-study-grid--text-only'
  
  return [baseClass, variantClass, imageClass]
})

/**
 * Handles case study selection with proper navigation emission
 * Provides consistent interaction pattern for portfolio browsing
 */
const handleCaseStudyClick = (caseStudy: CaseStudy) => {
  emit('case-study-click', caseStudy)
}

/**
 * Handles sector filter selection with state management
 * Updates display and emits filter change for parent components
 */
const selectSector = (sector: string) => {
  selectedSector.value = sector
  emit('sector-filter', sector)
}

/**
 * Limits displayed services to prevent card overcrowding
 * Maintains visual hierarchy in portfolio presentation
 */
const limitedServices = (services: string[]) => {
  return services.slice(0, 3)
}
</script>

<style scoped>
.case-study-index {
  --_section-gap: var(--space-xl);
  --_grid-gap: var(--space-l);
  --_card-radius: var(--border-radius-l, 12px);
}

.case-study-index__header {
  text-align: center;
  margin-bottom: var(--_section-gap);
  padding-bottom: var(--space-l);
  border-bottom: 2px solid var(--color-border-subtle, #e5e5e5);
}

.case-study-index__title {
  font-size: var(--size-4);
  font-weight: 700;
  margin: 0 0 var(--space-s) 0;
  color: var(--color-text-primary, #1a1a1a);
}

.case-study-index__description {
  font-size: var(--size-1);
  color: var(--color-text-secondary, #666);
  max-width: 70ch;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
}

/* Sector Filter */
.case-study-index__sector-filter {
  margin-bottom: var(--_section-gap);
}

.sector-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);
  justify-content: center;
}

.sector-pill {
  padding: var(--space-xs) var(--space-m);
  background: var(--color-background-subtle, #f9f9f9);
  border: 1px solid var(--color-border, #ccc);
  border-radius: var(--border-radius-full, 999px);
  font-size: var(--size--1);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sector-pill:hover {
  background: var(--color-primary-light, #e6f3ff);
  border-color: var(--color-primary, #0066cc);
}

.sector-pill--active {
  background: var(--color-primary, #0066cc);
  color: white;
  border-color: var(--color-primary, #0066cc);
}

/* Grid Layouts */
.case-study-grid {
  display: grid;
  gap: var(--_grid-gap);
}

.case-study-grid--portfolio {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
}

.case-study-grid--grid {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.case-study-grid--showcase {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

/* Case Study Cards */
.case-study-card {
  background: var(--color-background, white);
  border-radius: var(--_card-radius);
  border: 1px solid var(--color-border-subtle, #e5e5e5);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.case-study-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary, #0066cc);
}

.case-study-card__image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.case-study-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.case-study-card:hover .case-study-card__image img {
  transform: scale(1.05);
}

.case-study-card__content {
  padding: var(--space-l);
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

.case-study-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--size--1);
  font-weight: 600;
}

.case-study-card__client {
  color: var(--color-primary, #0066cc);
}

.case-study-card__sector {
  color: var(--color-text-secondary, #666);
  background: var(--color-background-subtle, #f9f9f9);
  padding: var(--space-xs) var(--space-s);
  border-radius: var(--border-radius-s, 4px);
}

.case-study-card__title {
  font-size: var(--size-1);
  font-weight: 700;
  color: var(--color-text-primary, #1a1a1a);
  margin: 0;
  line-height: var(--line-height-tight);
}

.case-study-card__challenge {
  font-size: var(--size--1);
  color: var(--color-text-secondary, #666);
  line-height: var(--line-height-relaxed);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.case-study-card__services {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.service-tag {
  font-size: var(--size--2);
  background: var(--color-accent-light, #e6f3ff);
  color: var(--color-accent, #0066cc);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--border-radius-s, 4px);
  font-weight: 500;
}

.case-study-card__relationships {
  font-size: var(--size--2);
  color: var(--color-text-tertiary, #999);
  font-style: italic;
  margin-top: auto;
}

/* Empty State */
.case-study-index__empty {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary, #666);
}

.reset-filter-btn {
  margin-top: var(--space-s);
  padding: var(--space-xs) var(--space-m);
  background: var(--color-primary, #0066cc);
  color: white;
  border: none;
  border-radius: var(--border-radius-s, 4px);
  cursor: pointer;
  font-size: var(--size--1);
}

.reset-filter-btn:hover {
  background: var(--color-primary-dark, #0052a3);
}

/* Accessibility */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .case-study-grid--portfolio,
  .case-study-grid--grid,
  .case-study-grid--showcase {
    grid-template-columns: 1fr;
  }
  
  .case-study-index__title {
    font-size: var(--size-3);
  }
  
  .case-study-index__description {
    font-size: var(--size-0);
  }
  
  .sector-pills {
    justify-content: flex-start;
  }
  
  .case-study-card__content {
    padding: var(--space-m);
  }
  
  .case-study-card__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
}
</style>