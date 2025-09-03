/**
 * Component prop definitions for ccm content piping components
 * Based on Story 1.2 requirements for data piping components
 */

import type { BlogPost, CaseStudy, ContentRelationship } from './content'

// Union type for all content types
export type ContentItem = BlogPost | CaseStudy

// Base props interface for content display components
export interface BaseContentProps {
  /** Content item to display (BlogPost or CaseStudy) */
  content: ContentItem
  /** Optional CSS class override */
  class?: string
  /** Show loading state */
  loading?: boolean
}

/**
 * Props for ccmContentMeta component
 * Renders rich metadata (brow, title, tagline, author, date) with semantic markup
 */
export interface ContentMetaProps extends BaseContentProps {
  content: BlogPost | CaseStudy
  /** Show abbreviated metadata (title and date only) */
  compact?: boolean
  /** Date format preference */
  dateFormat?: 'short' | 'long' | 'relative'
  /** Show author byline */
  showAuthor?: boolean
  /** Show content categories/sectors */
  showCategories?: boolean
}

/**
 * Props for ccmContentList component
 * Displays content collections with filtering and relationship highlighting
 */
export interface ContentListProps {
  /** Array of content items to display */
  items: ContentItem[]
  /** List display mode */
  variant?: 'default' | 'compact' | 'grid'
  /** Maximum number of items to show */
  limit?: number
  /** Enable filtering controls */
  filterable?: boolean
  /** Show content relationships */
  showRelationships?: boolean
  /** Optional heading for the list */
  heading?: string
  /** Heading level for semantic structure */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /** Optional CSS class override */
  class?: string
}

/**
 * Props for ccmContentDetail component  
 * Full content presentation with embedded related content sections
 */
export interface ContentDetailProps extends BaseContentProps {
  content: BlogPost | CaseStudy
  /** Related content items to display */
  relationships?: ContentRelationship[]
  /** Show table of contents */
  showToc?: boolean
  /** Enable social sharing */
  enableSharing?: boolean
  /** Show navigation (previous/next) */
  showNavigation?: boolean
  /** Reading time estimation */
  showReadingTime?: boolean
}

/**
 * Emits interface for content interaction events
 */
export interface ContentInteractionEvents {
  /** User clicked on content item */
  'content-click': [content: ContentItem]
  /** User filtered content */
  'filter-change': [filters: ContentFilters]
  /** User shared content */
  'content-share': [content: ContentItem, platform: string]
  /** User navigated to related content */
  'relationship-click': [relationship: ContentRelationship]
}

/**
 * Content filtering options
 */
export interface ContentFilters {
  /** Filter by content type */
  type?: 'blog' | 'case_study' | 'all'
  /** Filter by categories (blog) or sectors (case studies) */
  categories?: string[]
  /** Filter by tags (blog) or services (case studies) */
  tags?: string[]
  /** Filter by author */
  author?: string
  /** Filter by date range */
  dateRange?: {
    from: Date
    to: Date
  }
}

/**
 * Content display options
 */
export interface ContentDisplayOptions {
  /** Show excerpts in lists */
  showExcerpts?: boolean
  /** Show featured images */
  showImages?: boolean
  /** Show metadata */
  showMetadata?: boolean
  /** Show relationship indicators */
  showRelationships?: boolean
  /** Truncate long content */
  truncateAt?: number
}

/**
 * Computed content properties for template usage
 */
export interface ComputedContentProps {
  /** Formatted publication date */
  formattedDate: string
  /** Content type indicator */
  contentType: 'blog' | 'case_study'
  /** Categories or sectors for display */
  displayCategories: string[]
  /** Tags or services for display */
  displayTags: string[]
  /** Related content count */
  relationshipCount: number
  /** Estimated reading time */
  readingTime?: string
}

/**
 * Component state interfaces for reactive data
 */
export interface ContentComponentState {
  /** Currently applied filters */
  activeFilters: ContentFilters
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: string | null
  /** Currently selected/highlighted content */
  selectedContent: ContentItem | null
  /** Visibility state for sections */
  visibleSections: Record<string, boolean>
}