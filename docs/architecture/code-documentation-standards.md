# Code Documentation Standards

## JSDoc Documentation Requirements

**All composables, components, and utility functions must include comprehensive JSDoc comments following these standards:**

```typescript
/**
 * Content pipeline service that transforms markdown files into typed data structures
 * during static generation. Handles content processing, relationship computation,
 * and metadata generation with comprehensive error recovery.
 * 
 * @example
 * ```typescript
 * const { processAllContent } = useContentPipeline();
 * const result = await processAllContent({ 
 *   skipRelationships: false,
 *   timeoutMs: 30000 
 * });
 * if (result.success) {
 *   console.log(`Processed ${result.content.blogPosts.length} blog posts`);
 * }
 * ```
 * 
 * @since 1.0.0
 * @see {@link IContentPipelineService} for interface definition
 */
export const useContentPipeline = (): IContentPipelineService => {
  
  /**
   * Processes all content during build with comprehensive error handling
   * and performance monitoring. Supports timeout protection and graceful
   * degradation for relationship computation failures.
   * 
   * @param options - Processing configuration options
   * @param options.skipRelationships - Skip relationship computation to improve build time
   * @param options.validateOnly - Only validate content structure without processing
   * @param options.timeoutMs - Maximum processing time before timeout (default: 30000)
   * 
   * @returns Promise resolving to processing result with content, errors, and metrics
   * 
   * @throws {ContentProcessingError} When critical errors prevent content processing
   * 
   * @example
   * ```typescript
   * // Process all content with relationship computation
   * const result = await processAllContent();
   * 
   * // Skip relationships for faster builds
   * const fastResult = await processAllContent({ skipRelationships: true });
   * 
   * // Validation-only mode
   * const validation = await processAllContent({ validateOnly: true });
   * ```
   */
  const processAllContent = async (options: ProcessingOptions = {}): Promise<ContentProcessingResult> => {
    // Implementation with inline comments for complex logic
    const startTime = Date.now();
    
    // Step 1: Load content with timeout protection to prevent build hangs
    const timeoutMs = options.timeoutMs || 30000;
    // ... rest of implementation
  };
```

## Vue Component Documentation Standards

**All Vue components must include comprehensive documentation:**

```vue
<template>
  <!-- Component template with semantic HTML -->
  <article class="content-meta" :class="{ 'is-featured': content.featured }">
    <header class="content-meta__header">
      <!-- Brow text provides content categorization context -->
      <span class="content-meta__brow" data-testid="brow">{{ content.brow }}</span>
      
      <!-- Main title with SEO optimization -->
      <h1 class="content-meta__title" data-testid="title">{{ content.title }}</h1>
    </header>
  </article>
</template>

<script setup lang="ts">
/**
 * Content metadata display component that renders rich content information
 * including categorization, titles, authors, and publication dates with
 * semantic HTML structure optimized for SEO and accessibility.
 * 
 * Used across all content types (blog posts, case studies) to provide
 * consistent metadata presentation with responsive design and screen
 * reader support.
 * 
 * @component ccmContentMeta
 * @example
 * ```vue
 * <ccmContentMeta 
 *   :content="blogPost" 
 *   :show-author="true"
 *   @author-click="handleAuthorClick" 
 * />
 * ```
 * 
 * @since 1.0.0
 * @see {@link BlogPost} for content data structure
 * @see {@link CaseStudy} for case study data structure
 */

import type { BlogPost, CaseStudy } from '~/types/content';

interface Props {
  /** Content item to display metadata for */
  content: BlogPost | CaseStudy;
  
  /** Whether to show author information (default: true) */
  showAuthor?: boolean;
  
  /** Whether to show publication date (default: true) */
  showDate?: boolean;
  
  /** Additional CSS classes for styling customization */
  class?: string;
}

interface Emits {
  /** Emitted when author name is clicked for author page navigation */
  (e: 'author-click', author: string): void;
  
  /** Emitted when content title is clicked for content navigation */
  (e: 'title-click', content: BlogPost | CaseStudy): void;
}

/**
 * Component props with default values and validation
 */
const props = withDefaults(defineProps<Props>(), {
  showAuthor: true,
  showDate: true
});

/**
 * Component event emissions for parent component communication
 */
const emit = defineEmits<Emits>();

/**
 * Computed property to determine if content is a blog post
 * Used for conditional rendering of blog-specific metadata
 */
const isBlogPost = computed(() => 'date' in props.content);

/**
 * Handles author click events with proper event emission
 * Provides navigation support for author profile pages
 */
const handleAuthorClick = () => {
  if ('author' in props.content) {
    emit('author-click', props.content.author);
  }
};
</script>
```

## Inline Comment Standards

**Complex logic must include explanatory comments:**

```typescript
// ============================================================================
// RELATIONSHIP COMPUTATION ALGORITHM
// ============================================================================

/**
 * Computes content relationships using multiple algorithms with timeout protection.
 * Each algorithm runs independently to prevent single algorithm failures from
 * blocking the entire relationship computation process.
 */
const computeRelationships = async (content: ProcessedContent, options: RelationshipOptions) => {
  const relationships: ContentRelationship[] = [];
  
  // Process each algorithm with independent timeout handling
  for (const algorithm of options.algorithms) {
    try {
      // Race condition: algorithm execution vs timeout
      // This prevents any single algorithm from blocking the build process
      const algorithmPromise = applyRelationshipAlgorithm(content, algorithm, options);
      const timeoutPromise = new Promise<ContentRelationship[]>((_, reject) =>
        setTimeout(() => reject(new Error(`${algorithm} timeout`)), options.timeoutMs || 10000)
      );
      
      const algorithmResults = await Promise.race([algorithmPromise, timeoutPromise]);
      relationships.push(...algorithmResults);
      
    } catch (error) {
      // Log algorithm failure but continue processing other algorithms
      // This ensures partial relationship computation rather than complete failure
      console.warn(`Algorithm ${algorithm} failed:`, error);
      // Continue with next algorithm...
    }
  }
  
  // Filter relationships by strength threshold
  // Lower threshold = more relationships but potentially less relevant
  // Higher threshold = fewer but more precise relationships
  return relationships.filter(rel => rel.strength >= options.minStrength);
};
```

## TypeScript Interface Documentation

**All interfaces must include comprehensive property documentation:**

```typescript
/**
 * Represents a blog post with rich metadata for research communication
 * and engagement tracking. Includes SEO optimization fields and content
 * relationship data for cross-content discovery.
 * 
 * @interface BlogPost
 * @since 1.0.0
 * @see {@link CaseStudy} for portfolio content structure
 */
interface BlogPost {
  /** 
   * Category descriptor displayed above title for content classification.
   * Provides immediate context about content type (e.g., "Research Communication")
   * 
   * @example "Research Communication Case Study"
   */
  brow: string;
  
  /** 
   * Primary heading optimized for both SEO and academic credibility.
   * Should be descriptive and include target keywords for search optimization.
   * 
   * @example "How Stanford Research Center Achieved 400% Engagement Through Personalized Reports"
   */
  title: string;
  
  /** 
   * Extended subtitle providing context and value proposition.
   * Appears below title to elaborate on the main content focus.
   * 
   * @example "Strategic technology implementation transforms research impact while maintaining academic integrity"
   */
  tagline: string;
  
  /** 
   * Publication date for chronological organization and freshness indicators.
   * Used for content sorting and "last updated" display to users.
   */
  date: Date;
  
  /** 
   * Computed relationships to other content pieces for cross-promotion.
   * Generated during build process using relationship algorithms.
   * Empty array if no relationships found or computation skipped.
   * 
   * @see {@link ContentRelationship} for relationship data structure
   */
  relationships: ContentRelationship[];
}
```

## Error Handling Documentation

**All error handling must be documented with recovery strategies:**

```typescript
try {
  const result = await processContent(content);
  return result;
  
} catch (error) {
  // Categorize error type for appropriate handling strategy
  if (error instanceof ValidationError) {
    // Content structure errors - log and use fallback structure
    // Recovery: Continue with minimal content data to prevent build failure
    console.warn(`Content validation failed for ${content.path}:`, error.message);
    return createFallbackContent(content);
    
  } else if (error instanceof TimeoutError) {
    // Processing timeout - likely content volume or algorithm complexity
    // Recovery: Skip complex processing and use basic content structure  
    console.error(`Content processing timeout for ${content.path}:`, error.message);
    return createBasicContent(content);
    
  } else {
    // Unknown error - log details and re-throw to prevent silent failures
    // This ensures critical errors are not hidden but logged for debugging
    console.error(`Unexpected content processing error:`, error);
    throw new ContentProcessingError(`Failed to process content: ${error.message}`, { cause: error });
  }
}
```

## Documentation Validation Rules

1. **Mandatory Documentation**: All public functions, components, and interfaces must have JSDoc
2. **Examples Required**: Complex functions must include usage examples
3. **Parameter Documentation**: All parameters must document type, purpose, and constraints  
4. **Return Documentation**: All return values must document structure and possible states
5. **Error Documentation**: All thrown errors must be documented with recovery strategies
6. **Since Tags**: All new code must include @since version tags
7. **See References**: Related code must be cross-referenced with @see tags
8. **Inline Comments**: Complex algorithms must include step-by-step explanations

## ESLint Documentation Rules

```javascript
// eslint.config.mjs additions for documentation enforcement
export default [
  {
    rules: {
      // Enforce JSDoc comments for all functions
      'jsdoc/require-jsdoc': ['error', {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: true
        }
      }],
      
      // Require parameter documentation
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param-type': 'error',
      
      // Require return documentation
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-returns-type': 'error',
      
      // Enforce example documentation for complex functions
      'jsdoc/require-example': ['warn', {
        contexts: ['FunctionDeclaration', 'MethodDefinition']
      }]
    }
  }
];
```
