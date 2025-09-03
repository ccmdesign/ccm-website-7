<template>
  <ccmBaseSection class="client-index">
    <!-- Index Header -->
    <header class="client-index__header">
      <h1 class="client-index__title">Clients</h1>
      <p class="client-index__description">
        Organizations we've partnered with to transform research communication and technology implementation.
      </p>
    </header>

    <!-- Client Statistics -->
    <div class="client-index__stats">
      <div class="stat-item">
        <span class="stat-value">{{ totalClients }}</span>
        <span class="stat-label">Clients</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ totalProjects }}</span>
        <span class="stat-label">Projects</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ uniqueSectors }}</span>
        <span class="stat-label">Sectors</span>
      </div>
    </div>

    <!-- Sector Filter -->
    <div 
      v-if="availableSectors.length > 1"
      class="client-index__sector-filter"
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

    <!-- Client Portfolio Grid -->
    <section 
      class="client-index__portfolio"
      aria-labelledby="client-portfolio-heading"
    >
      <h2 id="client-portfolio-heading" class="visually-hidden">
        {{ selectedSector ? `${selectedSector} Sector Clients` : 'All Clients' }}
      </h2>
      
      <div :class="portfolioClasses">
        <article
          v-for="clientPortfolio in displayedClients"
          :key="clientPortfolio.clientName"
          class="client-card"
          @click="handleClientClick(clientPortfolio)"
        >
          <!-- Client Header -->
          <header class="client-card__header">
            <h3 class="client-card__name">{{ clientPortfolio.clientName }}</h3>
            <div class="client-card__meta">
              <span class="client-card__sector">{{ clientPortfolio.sector }}</span>
              <span class="client-card__count">
                {{ clientPortfolio.projects.length }} {{ clientPortfolio.projects.length === 1 ? 'project' : 'projects' }}
              </span>
            </div>
          </header>

          <!-- Project Previews -->
          <div class="client-card__projects">
            <div 
              v-for="project in limitedProjects(clientPortfolio.projects)"
              :key="project.slug"
              class="project-preview"
              @click.stop="handleProjectClick(project)"
            >
              <h4 class="project-preview__title">{{ project.title }}</h4>
              <p v-if="project.challenge" class="project-preview__challenge">
                {{ truncateText(project.challenge, 100) }}
              </p>
              
              <!-- Services for this project -->
              <div 
                v-if="project.services.length > 0"
                class="project-preview__services"
              >
                <span 
                  v-for="service in limitedServices(project.services)"
                  :key="service"
                  class="service-tag"
                >
                  {{ service }}
                </span>
              </div>
            </div>
          </div>

          <!-- All Services for Client -->
          <footer 
            v-if="clientPortfolio.allServices.length > 0"
            class="client-card__footer"
          >
            <div class="client-card__all-services">
              <span class="services-label">All Services:</span>
              <div class="services-list">
                <span 
                  v-for="service in clientPortfolio.allServices"
                  :key="service"
                  class="service-badge"
                >
                  {{ service }}
                </span>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </section>
    
    <!-- Empty State -->
    <div 
      v-if="displayedClients.length === 0"
      class="client-index__empty"
    >
      <p>
        {{ selectedSector ? `No clients found for ${selectedSector} sector.` : 'No client portfolio available.' }}
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
 * Client Index Page Component
 * 
 * Displays client portfolio with project associations and sector-based
 * filtering. Groups case studies by client organization to showcase
 * ongoing partnerships and service breadth.
 * 
 * Used for client directory page (/clients) to present organizational
 * relationships and project portfolio in a business development context.
 * 
 * @component ccmClientIndex
 * @example
 * ```vue
 * <ccmClientIndex 
 *   :clients="clientPortfolios"
 *   variant="showcase"
 * />
 * ```
 * 
 * @since 1.4.0
 * @see {@link CaseStudy} for project data structure
 * @see {@link useContentRelationships} for client-project associations
 */

import type { CaseStudy } from '~/types/content'

interface ClientPortfolio {
  /** Client organization name */
  clientName: string
  /** Primary sector classification */
  sector: string
  /** Case study projects for this client */
  projects: CaseStudy[]
  /** All services provided across projects */
  allServices: string[]
  /** Total relationship count for this client */
  relationshipCount: number
}

interface ClientIndexProps {
  /** Array of client portfolios computed from case studies */
  clients: ClientPortfolio[]
  
  /** Display variant for client directory */
  variant?: 'directory' | 'showcase' | 'timeline'
  
  /** Additional CSS classes for styling customization */
  class?: string
}

interface ClientIndexEmits {
  /** Emitted when client portfolio is clicked for detailed view */
  (e: 'client-click', clientPortfolio: ClientPortfolio): void
  
  /** Emitted when individual project is clicked for navigation */
  (e: 'project-click', project: CaseStudy): void
  
  /** Emitted when sector filter is changed */
  (e: 'sector-filter', sector: string): void
}

/**
 * Component props with sensible defaults for client directory
 */
const props = withDefaults(defineProps<ClientIndexProps>(), {
  variant: 'directory',
  class: ''
})

/**
 * Component event emissions for parent component communication
 */
const emit = defineEmits<ClientIndexEmits>()

/**
 * Reactive state for sector filtering
 */
const selectedSector = ref('')

/**
 * Computed statistics for client portfolio overview
 */
const totalClients = computed(() => props.clients.length)

const totalProjects = computed(() => 
  props.clients.reduce((sum, client) => sum + client.projects.length, 0)
)

const uniqueSectors = computed(() => {
  const sectors = new Set(props.clients.map(client => client.sector))
  return sectors.size
})

/**
 * Computed property to extract unique sectors for filtering
 * Enables sector-focused client portfolio browsing
 */
const availableSectors = computed(() => {
  const sectors = new Set(props.clients.map(client => client.sector))
  return Array.from(sectors).sort()
})

/**
 * Computed property to filter clients by selected sector
 * Provides focused portfolio viewing by industry
 */
const displayedClients = computed(() => {
  if (!selectedSector.value) {
    return props.clients
  }
  return props.clients.filter(client => client.sector === selectedSector.value)
})

/**
 * Dynamic portfolio grid classes based on variant
 * Adapts layout for different client directory presentations
 */
const portfolioClasses = computed(() => {
  const baseClass = 'client-portfolio'
  const variantClass = `client-portfolio--${props.variant}`
  
  return [baseClass, variantClass]
})

/**
 * Handles client portfolio selection with navigation emission
 * Provides detailed client view or filtering functionality
 */
const handleClientClick = (clientPortfolio: ClientPortfolio) => {
  emit('client-click', clientPortfolio)
}

/**
 * Handles individual project selection with direct navigation
 * Allows direct access to case study details from client context
 */
const handleProjectClick = (project: CaseStudy) => {
  emit('project-click', project)
}

/**
 * Handles sector filter selection with state management
 * Updates display and emits filter change for analytics
 */
const selectSector = (sector: string) => {
  selectedSector.value = sector
  emit('sector-filter', sector)
}

/**
 * Limits displayed projects to prevent card overcrowding
 * Maintains readable client portfolio presentation
 */
const limitedProjects = (projects: CaseStudy[]) => {
  return projects.slice(0, 2) // Show first 2 projects as preview
}

/**
 * Limits displayed services to maintain visual hierarchy
 * Prevents service tag overflow in project previews
 */
const limitedServices = (services: string[]) => {
  return services.slice(0, 2)
}

/**
 * Truncates text to specified character limit with ellipsis
 * Maintains consistent card heights in grid layout
 */
const truncateText = (text: string, limit: number) => {
  if (text.length <= limit) return text
  return text.substring(0, limit).trim() + '...'
}
</script>

<style scoped>
.client-index {
  --_section-gap: var(--space-xl);
  --_grid-gap: var(--space-l);
  --_card-radius: var(--border-radius-l, 12px);
}

.client-index__header {
  text-align: center;
  margin-bottom: var(--_section-gap);
  padding-bottom: var(--space-l);
  border-bottom: 2px solid var(--color-border-subtle, #e5e5e5);
}

.client-index__title {
  font-size: var(--size-4);
  font-weight: 700;
  margin: 0 0 var(--space-s) 0;
  color: var(--color-text-primary, #1a1a1a);
}

.client-index__description {
  font-size: var(--size-1);
  color: var(--color-text-secondary, #666);
  max-width: 70ch;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
}

/* Statistics */
.client-index__stats {
  display: flex;
  justify-content: center;
  gap: var(--space-xl);
  margin-bottom: var(--_section-gap);
  padding: var(--space-l);
  background: var(--color-background-subtle, #f9f9f9);
  border-radius: var(--border-radius-l, 12px);
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.stat-value {
  font-size: var(--size-3);
  font-weight: 700;
  color: var(--color-primary, #0066cc);
}

.stat-label {
  font-size: var(--size-0);
  color: var(--color-text-secondary, #666);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* Sector Filter */
.client-index__sector-filter {
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

/* Portfolio Grid */
.client-portfolio {
  display: grid;
  gap: var(--_grid-gap);
}

.client-portfolio--directory {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.client-portfolio--showcase {
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
}

.client-portfolio--timeline {
  grid-template-columns: 1fr;
  max-width: 800px;
  margin: 0 auto;
}

/* Client Cards */
.client-card {
  background: var(--color-background, white);
  border-radius: var(--_card-radius);
  border: 1px solid var(--color-border-subtle, #e5e5e5);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.client-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary, #0066cc);
}

.client-card__header {
  padding: var(--space-l);
  border-bottom: 1px solid var(--color-border-subtle, #e5e5e5);
  background: var(--color-background-subtle, #f9f9f9);
}

.client-card__name {
  font-size: var(--size-2);
  font-weight: 700;
  color: var(--color-text-primary, #1a1a1a);
  margin: 0 0 var(--space-s) 0;
}

.client-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--size--1);
}

.client-card__sector {
  color: var(--color-primary, #0066cc);
  font-weight: 600;
}

.client-card__count {
  color: var(--color-text-secondary, #666);
  background: white;
  padding: var(--space-xs) var(--space-s);
  border-radius: var(--border-radius-s, 4px);
  font-weight: 500;
}

/* Project Previews */
.client-card__projects {
  padding: var(--space-l);
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
  flex: 1;
}

.project-preview {
  padding: var(--space-m);
  background: var(--color-background-subtle, #f9f9f9);
  border-radius: var(--border-radius-m, 8px);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.project-preview:hover {
  background: var(--color-primary-light, #e6f3ff);
}

.project-preview__title {
  font-size: var(--size-0);
  font-weight: 600;
  color: var(--color-text-primary, #1a1a1a);
  margin: 0 0 var(--space-xs) 0;
  line-height: var(--line-height-tight);
}

.project-preview__challenge {
  font-size: var(--size--1);
  color: var(--color-text-secondary, #666);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--space-s) 0;
}

.project-preview__services {
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

/* Client Footer */
.client-card__footer {
  padding: var(--space-l);
  border-top: 1px solid var(--color-border-subtle, #e5e5e5);
  background: var(--color-background-subtle, #f9f9f9);
}

.client-card__all-services {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

.services-label {
  font-size: var(--size--1);
  font-weight: 600;
  color: var(--color-text-secondary, #666);
}

.services-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.service-badge {
  font-size: var(--size--2);
  background: white;
  color: var(--color-text-primary, #1a1a1a);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--border-radius-s, 4px);
  border: 1px solid var(--color-border-subtle, #e5e5e5);
  font-weight: 500;
}

/* Empty State */
.client-index__empty {
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
  .client-portfolio--directory,
  .client-portfolio--showcase {
    grid-template-columns: 1fr;
  }
  
  .client-index__stats {
    flex-direction: column;
    gap: var(--space-m);
    text-align: center;
  }
  
  .stat-item {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--space-s);
  }
  
  .client-index__title {
    font-size: var(--size-3);
  }
  
  .client-index__description {
    font-size: var(--size-0);
  }
  
  .sector-pills {
    justify-content: flex-start;
  }
  
  .client-card__header,
  .client-card__projects,
  .client-card__footer {
    padding: var(--space-m);
  }
  
  .client-card__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
}
</style>