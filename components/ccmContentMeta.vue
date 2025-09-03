<template>
  <ccmBaseSection class="content-meta">
    <header class="content-meta__header">
      <!-- Brow/Category -->
      <div 
        v-if="displayBrow" 
        class="content-meta__brow"
        data-testid="brow"
      >
        {{ displayBrow }}
      </div>
      
      <!-- Main Title -->
      <h1 
        v-if="!compact"
        class="content-meta__title"
        data-testid="title"
      >
        {{ content.title }}
      </h1>
      <h2 
        v-else
        class="content-meta__title content-meta__title--compact"
        data-testid="title"
      >
        {{ content.title }}
      </h2>
      
      <!-- Tagline -->
      <p 
        v-if="displayTagline && !compact"
        class="content-meta__tagline"
        data-testid="tagline"
      >
        {{ displayTagline }}
      </p>
    </header>
    
    <!-- Metadata Row -->
    <div class="content-meta__metadata">
      <!-- Author -->
      <span 
        v-if="showAuthor && displayAuthor"
        class="content-meta__author"
        data-testid="author"
      >
        by {{ displayAuthor }}
      </span>
      
      <!-- Date -->
      <time 
        class="content-meta__date"
        data-testid="date"
        :datetime="isoDate"
      >
        {{ formattedDate }}
      </time>
      
      <!-- Categories/Sectors -->
      <div 
        v-if="showCategories && displayCategories.length > 0"
        class="content-meta__categories"
        data-testid="categories"
      >
        <span 
          v-for="category in displayCategories"
          :key="category"
          class="content-meta__category"
        >
          {{ category }}
        </span>
      </div>
    </div>
    
    <!-- Content Type Indicator -->
    <div 
      class="content-meta__type"
      data-testid="content-type"
    >
      {{ contentTypeLabel }}
    </div>
  </ccmBaseSection>
</template>

<script setup lang="ts">
import type { ContentMetaProps } from '~/types/components'
import type { BlogPost, CaseStudy } from '~/types/content'

// Props with defaults
const props = withDefaults(defineProps<ContentMetaProps>(), {
  compact: false,
  dateFormat: 'long',
  showAuthor: true,
  showCategories: true,
  loading: false
})

// Content type detection
const contentType = computed(() => {
  return 'tags' in props.content ? 'blog' : 'case_study'
})

const contentTypeLabel = computed(() => {
  return contentType.value === 'blog' ? 'Blog Post' : 'Case Study'
})

// Display content based on type
const displayBrow = computed(() => {
  if (contentType.value === 'blog') {
    return (props.content as BlogPost).brow
  }
  return (props.content as CaseStudy).sector
})

const displayTagline = computed(() => {
  if (contentType.value === 'blog') {
    return (props.content as BlogPost).tagline
  }
  return (props.content as CaseStudy).challenge
})

const displayAuthor = computed(() => {
  if (contentType.value === 'blog') {
    return (props.content as BlogPost).author
  }
  return (props.content as CaseStudy).client
})

const displayCategories = computed(() => {
  if (contentType.value === 'blog') {
    return (props.content as BlogPost).categories || []
  }
  return [(props.content as CaseStudy).sector]
})

// Date formatting
const contentDate = computed(() => {
  if (contentType.value === 'blog') {
    return (props.content as BlogPost).date
  }
  // Case studies don't have explicit dates, use current date for now
  return new Date()
})

const isoDate = computed(() => {
  return contentDate.value instanceof Date 
    ? contentDate.value.toISOString().split('T')[0]
    : new Date(contentDate.value).toISOString().split('T')[0]
})

const formattedDate = computed(() => {
  const date = contentDate.value instanceof Date 
    ? contentDate.value 
    : new Date(contentDate.value)
    
  switch (props.dateFormat) {
    case 'short':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    case 'relative':
      return getRelativeTime(date)
    case 'long':
    default:
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
  }
})

// Helper function for relative time
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return date < now ? '1 day ago' : 'in 1 day'
  } else if (diffDays < 7) {
    return date < now ? `${diffDays} days ago` : `in ${diffDays} days`
  } else if (diffDays < 30) {
    const weeks = Math.ceil(diffDays / 7)
    return date < now ? `${weeks} week${weeks > 1 ? 's' : ''} ago` : `in ${weeks} week${weeks > 1 ? 's' : ''}`
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
}
</script>

<style scoped>
.content-meta {
  --_meta-space: var(--space-s);
}

.content-meta__header {
  margin-bottom: var(--space-m);
}

.content-meta__brow {
  font-size: var(--size--1);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent, #666);
  margin-bottom: var(--space-xs);
}

.content-meta__title {
  font-size: var(--size-3);
  font-weight: 700;
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-s);
}

.content-meta__title--compact {
  font-size: var(--size-1);
  margin-bottom: var(--space-xs);
}

.content-meta__tagline {
  font-size: var(--size-0);
  color: var(--color-text-secondary, #666);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-s);
}

.content-meta__metadata {
  display: flex;
  flex-wrap: wrap;
  gap: var(--_meta-space);
  align-items: center;
  font-size: var(--size--1);
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--space-s);
}

.content-meta__author,
.content-meta__date {
  display: inline-block;
}

.content-meta__categories {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.content-meta__category {
  background: var(--color-background-subtle, #f5f5f5);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--border-radius-s, 4px);
  font-size: var(--size--2);
  font-weight: 500;
}

.content-meta__type {
  font-size: var(--size--2);
  color: var(--color-text-tertiary, #999);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-meta__title {
    font-size: var(--size-2);
  }
  
  .content-meta__metadata {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
  
  .content-meta__categories {
    width: 100%;
  }
}
</style>