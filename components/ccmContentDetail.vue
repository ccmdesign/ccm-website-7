<template>
  <article class="content-detail">
    <!-- Main Content Header -->
    <header class="content-detail__header">
      <ccmContentMeta 
        :content="content"
        :show-author="true"
        :show-categories="true"
        :date-format="'long'"
        data-testid="detail-meta"
      />
    </header>

    <!-- Table of Contents -->
    <nav 
      v-if="showToc && tocItems.length > 0"
      class="content-detail__toc"
      data-testid="table-of-contents"
    >
      <h3 class="toc__heading">Table of Contents</h3>
      <ul class="toc__list">
        <li 
          v-for="item in tocItems"
          :key="item.id"
          class="toc__item"
        >
          <a :href="`#${item.id}`" class="toc__link">
            {{ item.text }}
          </a>
        </li>
      </ul>
    </nav>

    <!-- Main Content Body -->
    <ccmBaseSection class="content-detail__body">
      <div 
        class="content-detail__content"
        data-testid="main-content"
      >
        <!-- Content Type Specific Rendering -->
        <div v-if="contentType === 'blog'">
          <!-- Blog content (HTML from markdown) -->
          <div 
            class="prose-content"
            v-html="content.content"
          />
        </div>
        
        <div v-else class="case-study-content">
          <!-- Case Study Structure -->
          <section id="challenge" class="case-study-section">
            <h2>The Challenge</h2>
            <p>{{ (content as CaseStudy).challenge }}</p>
          </section>
          
          <section id="solution" class="case-study-section">
            <h2>Our Solution</h2>
            <p>{{ (content as CaseStudy).solution }}</p>
          </section>
          
          <section id="impact" class="case-study-section">
            <h2>Impact & Results</h2>
            <p>{{ (content as CaseStudy).impact }}</p>
          </section>
          
          <!-- Services Provided -->
          <section 
            v-if="(content as CaseStudy).services.length > 0"
            id="services" 
            class="case-study-section"
          >
            <h2>Services Provided</h2>
            <ul class="services-list">
              <li 
                v-for="service in (content as CaseStudy).services"
                :key="service"
                class="service-item"
              >
                {{ service }}
              </li>
            </ul>
          </section>
          
          <!-- Full Content if Available -->
          <section 
            v-if="content.content"
            id="details"
            class="case-study-section"
          >
            <h2>Project Details</h2>
            <div 
              class="prose-content"
              v-html="content.content"
            />
          </section>
        </div>
      </div>

      <!-- Reading Time & Social Sharing -->
      <aside 
        v-if="showReadingTime || enableSharing"
        class="content-detail__meta-sidebar"
        data-testid="content-sidebar"
      >
        <div v-if="showReadingTime" class="reading-time">
          <span class="reading-time__label">Reading time:</span>
          <span class="reading-time__value">{{ estimatedReadingTime }}</span>
        </div>
        
        <div 
          v-if="enableSharing"
          class="social-sharing"
          data-testid="social-sharing"
        >
          <span class="sharing__label">Share:</span>
          <div class="sharing__buttons">
            <button 
              class="share-btn share-btn--twitter"
              @click="shareContent('twitter')"
              aria-label="Share on Twitter"
            >
              Twitter
            </button>
            <button 
              class="share-btn share-btn--linkedin"
              @click="shareContent('linkedin')"
              aria-label="Share on LinkedIn"
            >
              LinkedIn
            </button>
            <button 
              class="share-btn share-btn--email"
              @click="shareContent('email')"
              aria-label="Share via Email"
            >
              Email
            </button>
          </div>
        </div>
      </aside>
    </ccmBaseSection>

    <!-- Related Content Section -->
    <section 
      v-if="relationships && relationships.length > 0"
      class="content-detail__related"
      data-testid="related-content"
    >
      <ccmBaseSection>
        <h2 class="related__heading">Related Content</h2>
        <div class="related__items">
          <div
            v-for="relationship in displayedRelationships"
            :key="`${relationship.target_type}-${relationship.target_slug}`"
            class="related-item"
            @click="handleRelationshipClick(relationship)"
          >
            <div class="related-item__content">
              <span class="related-item__type">
                {{ relationship.target_type === 'blog' ? 'Blog Post' : 'Case Study' }}
              </span>
              <h3 class="related-item__title">
                {{ relationship.target_slug }}
              </h3>
              <p class="related-item__reason">
                {{ relationship.computed_reason }}
              </p>
              <div class="related-item__strength">
                Relevance: {{ Math.round(relationship.strength * 100) }}%
              </div>
            </div>
          </div>
        </div>
        
        <button 
          v-if="relationships.length > maxRelatedItems"
          class="show-more-btn"
          @click="showAllRelated = !showAllRelated"
        >
          {{ showAllRelated ? 'Show Less' : `Show All ${relationships.length} Related Items` }}
        </button>
      </ccmBaseSection>
    </section>

    <!-- Navigation Section -->
    <nav 
      v-if="showNavigation"
      class="content-detail__navigation"
      data-testid="content-navigation"
    >
      <ccmBaseSection>
        <div class="nav-buttons">
          <button 
            v-if="previousContent"
            class="nav-btn nav-btn--prev"
            @click="navigateToContent(previousContent)"
          >
            ← Previous
          </button>
          <button 
            v-if="nextContent"
            class="nav-btn nav-btn--next"  
            @click="navigateToContent(nextContent)"
          >
            Next →
          </button>
        </div>
      </ccmBaseSection>
    </nav>
  </article>
</template>

<script setup lang="ts">
import type { ContentDetailProps } from '~/types/components'
import type { BlogPost, CaseStudy, ContentRelationship, ContentItem } from '~/types/content'

// Props with defaults
const props = withDefaults(defineProps<ContentDetailProps>(), {
  relationships: () => [],
  showToc: false,
  enableSharing: true,
  showNavigation: false,
  showReadingTime: true,
  loading: false
})

// Emits for parent interaction
const emit = defineEmits<{
  'content-share': [content: ContentItem, platform: string]
  'relationship-click': [relationship: ContentRelationship]
  'navigation': [direction: 'prev' | 'next', content: ContentItem]
}>()

// Reactive state
const showAllRelated = ref(false)
const maxRelatedItems = 3

// Content type detection
const contentType = computed(() => {
  return 'tags' in props.content ? 'blog' : 'case_study'
})

// Table of Contents (basic implementation)
const tocItems = computed(() => {
  if (!props.showToc || !props.content.content) return []
  
  // Extract headings from HTML content (basic implementation)
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h[2-6]>/gi
  const headings = []
  let match
  let counter = 0
  
  while ((match = headingRegex.exec(props.content.content)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].replace(/<[^>]*>/g, ''), // Strip HTML tags
      id: `heading-${counter++}`
    })
  }
  
  return headings
})

// Reading time estimation
const estimatedReadingTime = computed(() => {
  if (!props.content.content) return '1 min read'
  
  const wordsPerMinute = 200
  const wordCount = props.content.content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .split(/\s+/)
    .length
  
  const minutes = Math.max(1, Math.round(wordCount / wordsPerMinute))
  return `${minutes} min read`
})

// Related content display
const displayedRelationships = computed(() => {
  if (!props.relationships) return []
  
  const sorted = [...props.relationships]
    .sort((a, b) => b.strength - a.strength)
  
  return showAllRelated.value 
    ? sorted 
    : sorted.slice(0, maxRelatedItems)
})

// Navigation (placeholder - would need to be provided by parent)
const previousContent = computed(() => {
  // This would typically be provided by the parent component
  // or computed based on content ordering
  return null
})

const nextContent = computed(() => {
  // This would typically be provided by the parent component
  // or computed based on content ordering
  return null
})

// Methods
function shareContent(platform: string) {
  emit('content-share', props.content, platform)
  
  // Basic sharing implementation
  const url = window.location.href
  const title = props.content.title
  const text = 'excerpt' in props.content ? props.content.excerpt : 'challenge' in props.content ? props.content.challenge : ''
  
  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
      break
    case 'linkedin':
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
      break
    case 'email':
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`
      break
  }
}

function handleRelationshipClick(relationship: ContentRelationship) {
  emit('relationship-click', relationship)
}

function navigateToContent(content: ContentItem) {
  // Implementation would depend on routing setup
  console.log('Navigate to:', content.slug)
}
</script>

<style scoped>
.content-detail {
  max-width: 100%;
}

.content-detail__header {
  margin-bottom: var(--space-l);
}

.content-detail__toc {
  margin-bottom: var(--space-xl);
  padding: var(--space-m);
  background: var(--color-background-subtle, #f9f9f9);
  border-radius: var(--border-radius-m, 8px);
}

.toc__heading {
  font-size: var(--size-0);
  margin-bottom: var(--space-s);
  font-weight: 600;
}

.toc__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc__item {
  margin-bottom: var(--space-xs);
}

.toc__link {
  color: var(--color-primary, #0066cc);
  text-decoration: none;
  font-size: var(--size--1);
  transition: color 0.2s ease;
}

.toc__link:hover {
  color: var(--color-primary-dark, #0052a3);
  text-decoration: underline;
}

.content-detail__body {
  margin-bottom: var(--space-xl);
}

.content-detail__content {
  max-width: 65ch; /* Optimal reading width */
  line-height: var(--line-height-relaxed);
}

.prose-content {
  font-size: var(--size-0);
  color: var(--color-text);
}

.prose-content h2,
.prose-content h3,
.prose-content h4 {
  margin-top: var(--space-l);
  margin-bottom: var(--space-s);
  font-weight: 600;
}

.prose-content p {
  margin-bottom: var(--space-m);
}

.case-study-section {
  margin-bottom: var(--space-xl);
}

.case-study-section h2 {
  font-size: var(--size-1);
  font-weight: 700;
  margin-bottom: var(--space-s);
  color: var(--color-primary, #0066cc);
}

.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-s);
  list-style: none;
  padding: 0;
  margin: var(--space-s) 0;
}

.service-item {
  padding: var(--space-s);
  background: var(--color-background-subtle, #f9f9f9);
  border-radius: var(--border-radius-s, 4px);
  font-size: var(--size--1);
  font-weight: 500;
}

.content-detail__meta-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
  margin-top: var(--space-l);
  padding-top: var(--space-m);
  border-top: 1px solid var(--color-border-subtle, #e5e5e5);
}

.reading-time,
.social-sharing {
  display: flex;
  align-items: center;
  gap: var(--space-s);
  font-size: var(--size--1);
}

.reading-time__label,
.sharing__label {
  font-weight: 600;
  color: var(--color-text-secondary, #666);
}

.sharing__buttons {
  display: flex;
  gap: var(--space-xs);
}

.share-btn {
  padding: var(--space-xs) var(--space-s);
  border: 1px solid var(--color-border, #ccc);
  background: white;
  color: var(--color-text);
  border-radius: var(--border-radius-s, 4px);
  cursor: pointer;
  font-size: var(--size--2);
  transition: all 0.2s ease;
}

.share-btn:hover {
  background: var(--color-primary, #0066cc);
  color: white;
  border-color: var(--color-primary, #0066cc);
}

.content-detail__related {
  margin-bottom: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 2px solid var(--color-border-subtle, #e5e5e5);
}

.related__heading {
  font-size: var(--size-1);
  margin-bottom: var(--space-l);
  font-weight: 700;
}

.related__items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-m);
  margin-bottom: var(--space-m);
}

.related-item {
  padding: var(--space-m);
  border: 1px solid var(--color-border-subtle, #e5e5e5);
  border-radius: var(--border-radius-m, 8px);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.related-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.related-item__type {
  font-size: var(--size--2);
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-accent, #666);
  letter-spacing: 0.05em;
}

.related-item__title {
  font-size: var(--size-0);
  font-weight: 600;
  margin: var(--space-xs) 0 var(--space-s);
}

.related-item__reason {
  font-size: var(--size--1);
  color: var(--color-text-secondary, #666);
  margin-bottom: var(--space-s);
}

.related-item__strength {
  font-size: var(--size--2);
  color: var(--color-primary, #0066cc);
  font-weight: 500;
}

.show-more-btn,
.nav-btn {
  padding: var(--space-s) var(--space-m);
  border: 1px solid var(--color-border, #ccc);
  background: white;
  color: var(--color-text);
  border-radius: var(--border-radius-s, 4px);
  cursor: pointer;
  font-size: var(--size--1);
  transition: all 0.2s ease;
}

.show-more-btn:hover,
.nav-btn:hover {
  background: var(--color-background-subtle, #f9f9f9);
}

.content-detail__navigation {
  padding-top: var(--space-l);
  border-top: 1px solid var(--color-border-subtle, #e5e5e5);
}

.nav-buttons {
  display: flex;
  justify-content: space-between;
  gap: var(--space-m);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-detail__meta-sidebar {
    flex-direction: column;
  }
  
  .sharing__buttons {
    flex-wrap: wrap;
  }
  
  .related__items {
    grid-template-columns: 1fr;
  }
  
  .nav-buttons {
    flex-direction: column;
  }
}
</style>