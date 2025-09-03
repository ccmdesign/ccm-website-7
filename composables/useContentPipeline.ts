/**
 * Content Pipeline Composable
 * Processes all Nuxt Content during static generation
 * Based on architecture/api-specification.md
 */

// Nuxt Content import - will be available at runtime in Nuxt environment
declare const queryContent: any
import type { 
  IContentPipelineService, 
  ProcessingOptions, 
  ContentProcessingResult,
  ValidationResult,
  TransformationResult,
  ProcessedContent,
  ProcessingError,
  ProcessingWarning,
  ProcessingMetrics,
  RawContent,
  ContentMetadata
} from '~/types/pipeline'
import type { BlogPost, CaseStudy } from '~/types/content'

/**
 * Main content processing composable that transforms markdown files
 * into typed data structures during build time
 */
export const useContentPipeline = (): IContentPipelineService => {
  
  /**
   * Process all content with timeout protection and error recovery
   */
  const processAllContent = async (options: ProcessingOptions = {}): Promise<ContentProcessingResult> => {
    const startTime = Date.now()
    const errors: ProcessingError[] = []
    const warnings: ProcessingWarning[] = []
    
    try {
      // Step 1: Load raw content with timeout protection
      const timeoutMs = options.timeoutMs || 30000
      const contentPromise = Promise.race([
        Promise.all([
          queryContent('blog').find(),
          queryContent('case-studies').find()
        ]),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Content loading timeout')), timeoutMs)
        )
      ])
      
      const [blogPosts, caseStudies] = await contentPromise as any[]
      
      // Step 2: Validate content structure
      const validationResults = validateContent([...blogPosts, ...caseStudies])
      validationResults.forEach(result => {
        if (result.severity === 'error') {
          errors.push(...result.errors)
        }
        if (result.severity === 'warning') {
          warnings.push(...result.warnings)
        }
      })
      
      // Step 3: Transform to typed interfaces with error recovery
      const transformationResult = transformContent([...blogPosts, ...caseStudies])
      errors.push(...transformationResult.errors)
      warnings.push(...transformationResult.warnings)
      
      // Step 4: Generate metadata
      const metadata = generateContentMetadata({
        blogPosts: transformationResult.processedBlogs,
        caseStudies: transformationResult.processedCases,
        relationships: [], // Will be populated by useContentRelationships
        metadata: {} as ContentMetadata,
        processingTimestamp: new Date()
      })
      
      const endTime = Date.now()
      const metrics: ProcessingMetrics = {
        totalProcessingTime: endTime - startTime,
        contentTransformTime: transformationResult.transformTime,
        relationshipComputeTime: 0, // Will be set by relationship composable
        routeGenerationTime: 0, // Will be set by route composable
        memoryUsage: process.memoryUsage ? process.memoryUsage().heapUsed : 0
      }
      
      return {
        success: errors.filter(e => e.type === 'critical').length === 0,
        content: {
          blogPosts: transformationResult.processedBlogs,
          caseStudies: transformationResult.processedCases,
          relationships: [], // Will be populated by relationship service
          metadata,
          processingTimestamp: new Date()
        },
        errors,
        warnings,
        metrics
      }
      
    } catch (error) {
      errors.push({
        type: 'critical',
        source: 'content_pipeline',
        message: error instanceof Error ? error.message : 'Unknown error',
        recoveryAction: 'Check content structure and try again',
        timestamp: new Date()
      })
      
      return {
        success: false,
        errors,
        warnings,
        metrics: {
          totalProcessingTime: Date.now() - startTime,
          contentTransformTime: 0,
          relationshipComputeTime: 0,
          routeGenerationTime: 0,
          memoryUsage: process.memoryUsage ? process.memoryUsage().heapUsed : 0
        }
      }
    }
  }
  
  /**
   * Validate content structure and metadata
   */
  const validateContent = (rawContent: RawContent[]): ValidationResult[] => {
    return rawContent.map(content => validateSingleContent(content))
  }
  
  /**
   * Transform raw markdown content to typed interfaces
   */
  const transformContent = (rawContent: RawContent[]): TransformationResult => {
    const startTime = Date.now()
    const processedBlogs: BlogPost[] = []
    const processedCases: CaseStudy[] = []
    const errors: ProcessingError[] = []
    const warnings: ProcessingWarning[] = []
    
    rawContent.forEach(content => {
      try {
        if (content._path?.includes('/blog/')) {
          const blogPost = transformToBlogPost(content)
          if (blogPost) {
            processedBlogs.push(blogPost)
          }
        } else if (content._path?.includes('/case-studies/')) {
          const caseStudy = transformToCaseStudy(content)
          if (caseStudy) {
            processedCases.push(caseStudy)
          }
        }
      } catch (error) {
        errors.push({
          type: 'transformation',
          source: content._path || 'unknown',
          message: error instanceof Error ? error.message : 'Transformation failed',
          recoveryAction: 'Use fallback content structure',
          timestamp: new Date()
        })
      }
    })
    
    return {
      processedBlogs,
      processedCases,
      errors,
      warnings,
      transformTime: Date.now() - startTime
    }
  }
  
  return { processAllContent, validateContent, transformContent }
}

/**
 * Validate individual content piece
 */
function validateSingleContent(content: RawContent): ValidationResult {
  const errors: ProcessingError[] = []
  const warnings: ProcessingWarning[] = []
  
  // Required fields validation
  if (!content.title) {
    errors.push({
      type: 'content',
      source: content._path || 'unknown',
      message: 'Missing required title field',
      recoveryAction: 'Add title to frontmatter',
      timestamp: new Date()
    })
  }
  
  // Path validation
  if (!content._path) {
    warnings.push({
      type: 'metadata',
      source: 'unknown',
      message: 'Missing _path field',
      timestamp: new Date()
    })
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    severity: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'info'
  }
}

/**
 * Transform raw content to BlogPost interface
 */
function transformToBlogPost(rawPost: any): BlogPost | null {
  try {
    return {
      brow: rawPost.brow || '',
      title: rawPost.title,
      tagline: rawPost.tagline || '',
      date: new Date(rawPost.date),
      author: rawPost.author || 'CCM Team',
      categories: rawPost.categories || [],
      tags: rawPost.tags || [],
      seo_tags: rawPost.seo_tags || [],
      excerpt: rawPost.excerpt || '',
      content: rawPost.body?.html || '',
      slug: extractSlugFromPath(rawPost._path || ''),
      relationships: [] // Will be populated by relationship service
    }
  } catch (error) {
    console.error('Failed to transform blog post:', rawPost._path, error)
    return null
  }
}

/**
 * Transform raw content to CaseStudy interface
 */
function transformToCaseStudy(rawStudy: any): CaseStudy | null {
  try {
    return {
      title: rawStudy.title,
      client: extractClientFromTitle(rawStudy.title || ''),
      challenge: rawStudy.challenge || '',
      solution: rawStudy.solution || '',
      impact: rawStudy.impact || '',
      sector: rawStudy.sector || 'General',
      services: rawStudy.services || [],
      content: rawStudy.body?.html || '',
      slug: extractSlugFromPath(rawStudy._path || ''),
      featured_image: rawStudy.featured_image,
      gallery: rawStudy.gallery || [],
      relationships: [] // Will be populated by relationship service
    }
  } catch (error) {
    console.error('Failed to transform case study:', rawStudy._path, error)
    return null
  }
}

/**
 * Extract slug from content path
 */
function extractSlugFromPath(path: string): string {
  return path.split('/').pop()?.replace('.md', '') || ''
}

/**
 * Extract client name from case study title
 */
function extractClientFromTitle(title: string): string {
  // Basic extraction - could be enhanced based on content patterns
  const colonIndex = title.indexOf(':')
  if (colonIndex > 0) {
    return title.substring(0, colonIndex).trim()
  }
  return 'Client'
}

/**
 * Generate comprehensive content metadata
 */
function generateContentMetadata(content: ProcessedContent): ContentMetadata {
  const allCategories = new Set<string>()
  const allTags = new Set<string>()
  const allAuthors = new Set<string>()
  let latestDate = new Date(0)
  
  // Aggregate from blog posts
  content.blogPosts.forEach(post => {
    post.categories.forEach(cat => allCategories.add(cat))
    post.tags.forEach(tag => allTags.add(tag))
    allAuthors.add(post.author)
    if (post.date > latestDate) latestDate = post.date
  })
  
  // Generate content hash for cache invalidation
  const contentString = JSON.stringify([
    content.blogPosts.map(p => ({ title: p.title, date: p.date })),
    content.caseStudies.map(c => ({ title: c.title, slug: c.slug }))
  ])
  const contentHash = createSimpleHash(contentString)
  
  return {
    totalPosts: content.blogPosts.length,
    totalCaseStudies: content.caseStudies.length,
    categories: Array.from(allCategories),
    tags: Array.from(allTags),
    authors: Array.from(allAuthors),
    lastUpdated: latestDate,
    buildTimestamp: new Date(),
    buildVersion: '1.0.0',
    contentHash
  }
}

/**
 * Create simple hash for content tracking
 */
function createSimpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}