<template>
  <ccmBaseSection class="content-list">
    <!-- List Heading -->
    <header v-if="heading" class="content-list__header">
      <component 
        :is="headingTag"
        class="content-list__heading"
        data-testid="list-heading"
      >
        {{ heading }}
      </component>
      
      <!-- Item Count -->
      <div 
        class="content-list__count"
        data-testid="item-count"
      >
        {{ displayedItems.length }} {{ itemsLabel }}
      </div>
    </header>

    <!-- Filter Controls -->
    <div 
      v-if="filterable && items.length > 0"
      class="content-list__filters"
      data-testid="filter-controls"
    >
      <div class="filter-group">
        <label for="type-filter">Type:</label>
        <select 
          id="type-filter"
          v-model="activeFilters.type"
          class="filter-select"
          @change="applyFilters"
        >
          <option value="all">All Content</option>
          <option value="blog">Blog Posts</option>
          <option value="case_study">Case Studies</option>
        </select>
      </div>
      
      <div v-if="availableCategories.length > 0" class="filter-group">
        <label for="category-filter">Category:</label>
        <select 
          id="category-filter"
          v-model="selectedCategory"
          class="filter-select"
          @change="applyFilters"
        >
          <option value="">All Categories</option>
          <option 
            v-for="category in availableCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <!-- Content Items -->
    <div 
      v-if="displayedItems.length > 0"
      :class="listClasses"
      data-testid="content-items"
    >
      <article
        v-for="item in limitedItems"
        :key="item.slug"
        :class="itemClasses"
        data-testid="content-item"
        @click="handleItemClick(item)"
      >
        <!-- Item Content -->
        <div class="content-item__content">
          <!-- Compact metadata for list view -->
          <ccmContentMeta 
            :content="item"
            compact
            :show-author="variant !== 'compact'"
            :show-categories="variant === 'default'"
            :date-format="variant === 'compact' ? 'short' : 'long'"
          />
          
          <!-- Excerpt (for default variant) -->
          <p 
            v-if="variant === 'default' && getItemExcerpt(item)"
            class="content-item__excerpt"
          >
            {{ getItemExcerpt(item) }}
          </p>
          
          <!-- Relationship indicators -->
          <div 
            v-if="showRelationships && item.relationships.length > 0"
            class="content-item__relationships"
            data-testid="relationship-indicators"
          >
            <span class="relationships-count">
              {{ item.relationships.length }} related {{ item.relationships.length === 1 ? 'item' : 'items' }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div 
      v-else-if="items.length === 0"
      class="content-list__empty"
      data-testid="empty-state"
    >
      <p>No content available.</p>
    </div>
    
    <!-- No Results State -->
    <div 
      v-else
      class="content-list__no-results"
      data-testid="no-results"
    >
      <p>No content matches the current filters.</p>
      <button 
        class="reset-filters-btn"
        @click="resetFilters"
      >
        Clear Filters
      </button>
    </div>
  </ccmBaseSection>
</template>

<script setup lang="ts">
import type { ContentListProps, ContentFilters, ContentItem } from '~/types/components'
import type { BlogPost, CaseStudy } from '~/types/content'

// Props with defaults
const props = withDefaults(defineProps<ContentListProps>(), {
  variant: 'default',
  limit: undefined,
  filterable: false,
  showRelationships: false,
  headingLevel: 2,
  class: ''
})

// Emits for parent component interaction
const emit = defineEmits<{
  'content-click': [content: ContentItem]
  'filter-change': [filters: ContentFilters]
}>()

// Reactive filter state
const activeFilters = ref<ContentFilters>({
  type: 'all',
  categories: [],
  tags: []
})

const selectedCategory = ref('')

// Computed properties
const headingTag = computed(() => `h${props.headingLevel}`)

const itemsLabel = computed(() => {
  const count = displayedItems.value.length
  if (count === 0) return 'items'
  
  const hasBlogs = displayedItems.value.some(item => 'tags' in item)
  const hasCaseStudies = displayedItems.value.some(item => 'services' in item)
  
  if (hasBlogs && hasCaseStudies) return 'items'
  if (hasBlogs) return count === 1 ? 'post' : 'posts'
  return count === 1 ? 'case study' : 'case studies'
})

const availableCategories = computed(() => {
  const categories = new Set<string>()
  
  props.items.forEach(item => {
    if ('categories' in item) {
      item.categories.forEach(cat => categories.add(cat))
    }
    if ('sector' in item) {
      categories.add(item.sector)
    }
  })
  
  return Array.from(categories).sort()
})

const displayedItems = computed(() => {
  let filtered = [...props.items]
  
  // Filter by type
  if (activeFilters.value.type && activeFilters.value.type !== 'all') {
    filtered = filtered.filter(item => {
      const isBlob = 'tags' in item
      return (activeFilters.value.type === 'blog' && isBlob) ||
             (activeFilters.value.type === 'case_study' && !isBlob)
    })
  }
  
  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(item => {
      if ('categories' in item) {
        return item.categories.includes(selectedCategory.value)
      }
      if ('sector' in item) {
        return item.sector === selectedCategory.value
      }
      return false
    })
  }
  
  return filtered
})

const limitedItems = computed(() => {
  return props.limit 
    ? displayedItems.value.slice(0, props.limit)
    : displayedItems.value
})

const listClasses = computed(() => {
  return [
    'content-list__items',
    `content-list__items--${props.variant}`,
    props.class
  ]
})

const itemClasses = computed(() => {
  return [
    'content-item',
    `content-item--${props.variant}`
  ]
})

// Methods
function getItemExcerpt(item: ContentItem): string {
  if ('excerpt' in item) {
    return item.excerpt
  }
  if ('challenge' in item) {
    return item.challenge
  }
  return ''
}

function handleItemClick(item: ContentItem) {
  emit('content-click', item)
}

function applyFilters() {
  emit('filter-change', activeFilters.value)
}

function resetFilters() {
  activeFilters.value = {
    type: 'all',
    categories: [],
    tags: []
  }
  selectedCategory.value = ''
  applyFilters()
}

// Watch for filter changes
watch(() => [activeFilters.value, selectedCategory.value], () => {
  applyFilters()
}, { deep: true })
</script>

<style scoped>
.content-list {
  --_list-gap: var(--space-m);
  --_item-gap: var(--space-s);
}

.content-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-m);
  padding-bottom: var(--space-s);
  border-bottom: 1px solid var(--color-border-subtle, #e5e5e5);
}

.content-list__heading {
  font-size: var(--size-2);
  font-weight: 700;
  margin: 0;
}

.content-list__count {
  font-size: var(--size--1);
  color: var(--color-text-secondary, #666);
  font-weight: 500;
}

.content-list__filters {
  display: flex;
  gap: var(--space-m);
  margin-bottom: var(--space-l);
  padding: var(--space-s);
  background: var(--color-background-subtle, #f9f9f9);
  border-radius: var(--border-radius-m, 8px);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.filter-group label {
  font-size: var(--size--1);
  font-weight: 600;
  color: var(--color-text-secondary, #666);
}

.filter-select {
  padding: var(--space-xs) var(--space-s);
  border: 1px solid var(--color-border, #ccc);
  border-radius: var(--border-radius-s, 4px);
  font-size: var(--size--1);
  background: white;
}

/* List Layouts */
.content-list__items--default {
  display: flex;
  flex-direction: column;
  gap: var(--_list-gap);
}

.content-list__items--compact {
  display: flex;
  flex-direction: column;
  gap: var(--_item-gap);
}

.content-list__items--grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--_list-gap);
}

/* Content Items */
.content-item {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: var(--border-radius-m, 8px);
}

.content-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.content-item--default {
  padding: var(--space-m);
  border: 1px solid var(--color-border-subtle, #e5e5e5);
}

.content-item--compact {
  padding: var(--space-s);
  border-bottom: 1px solid var(--color-border-subtle, #e5e5e5);
}

.content-item--grid {
  padding: var(--space-m);
  border: 1px solid var(--color-border-subtle, #e5e5e5);
  height: fit-content;
}

.content-item__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

.content-item__excerpt {
  font-size: var(--size--1);
  color: var(--color-text-secondary, #666);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.content-item__relationships {
  font-size: var(--size--2);
  color: var(--color-accent, #0066cc);
  font-weight: 500;
}

/* Empty and No Results States */
.content-list__empty,
.content-list__no-results {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary, #666);
}

.reset-filters-btn {
  margin-top: var(--space-s);
  padding: var(--space-xs) var(--space-m);
  background: var(--color-primary, #0066cc);
  color: white;
  border: none;
  border-radius: var(--border-radius-s, 4px);
  cursor: pointer;
  font-size: var(--size--1);
}

.reset-filters-btn:hover {
  background: var(--color-primary-dark, #0052a3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-list__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
  
  .content-list__filters {
    flex-direction: column;
    gap: var(--space-s);
  }
  
  .content-list__items--grid {
    grid-template-columns: 1fr;
  }
}
</style>