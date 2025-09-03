# API Specification

Since the tech stack uses **build-time composables** rather than runtime APIs, this section defines the content processing interfaces that operate during static generation.

## Build-Time Content Processing Interface

The content pipeline operates through composables that process markdown content during `nuxt generate`, transforming raw files into typed data structures for component consumption.

### Content Pipeline Service Interfaces

**Service Boundary Definitions**: Each composable has clearly defined responsibilities with explicit input/output contracts and error handling.

```typescript
// ============================================================================
// PRIMARY CONTENT PROCESSING SERVICE
// ============================================================================
interface IContentPipelineService {
  // Core content transformation
  processAllContent(options?: ProcessingOptions): Promise<ContentProcessingResult>;
  
  // Content validation and sanitization
  validateContent(rawContent: RawContent[]): ValidationResult[];
  
  // Content transformation with error recovery
  transformContent(rawContent: RawContent[]): TransformationResult;
}

interface ProcessingOptions {
  skipRelationships?: boolean;
  validateOnly?: boolean;
  timeoutMs?: number;
}

interface ContentProcessingResult {
  success: boolean;
  content?: ProcessedContent;
  errors: ProcessingError[];
  warnings: ProcessingWarning[];
  metrics: ProcessingMetrics;
}

// ============================================================================
// RELATIONSHIP COMPUTATION SERVICE  
// ============================================================================
interface IContentRelationshipService {
  // Primary relationship computation with configurable algorithms
  computeRelationships(
    content: ProcessedContent, 
    options?: RelationshipOptions
  ): Promise<RelationshipResult>;
  
  // Relationship scoring with multiple algorithms
  scoreRelationship(
    source: BlogPost | CaseStudy, 
    target: BlogPost | CaseStudy,
    algorithm: RelationshipAlgorithm
  ): RelationshipScore;
  
  // Relationship validation and filtering
  filterRelationships(
    relationships: ContentRelationship[], 
    filters: RelationshipFilter[]
  ): ContentRelationship[];
}

interface RelationshipOptions {
  algorithms: RelationshipAlgorithm[];
  minStrength: number;
  maxRelationsPerContent: number;
  timeoutMs?: number;
}

interface RelationshipResult {
  success: boolean;
  relationships: ContentRelationship[];
  errors: RelationshipError[];
  algorithmMetrics: AlgorithmMetrics[];
}

type RelationshipAlgorithm = 'tag_similarity' | 'category_match' | 'content_analysis' | 'semantic_similarity';

// ============================================================================
// STATIC ROUTE GENERATION SERVICE
// ============================================================================
interface IStaticRouteService {
  // Generate all content-based routes
  generateContentRoutes(content: ProcessedContent): Promise<RouteGenerationResult>;
  
  // Generate index and listing pages  
  generateIndexRoutes(content: ProcessedContent): StaticRoute[];
  
  // Generate sitemap and SEO routes
  generateSEORoutes(content: ProcessedContent): SEORoute[];
}

interface RouteGenerationResult {
  success: boolean;
  routes: StaticRoute[];
  indexRoutes: StaticRoute[];
  seoRoutes: SEORoute[];
  errors: RouteError[];
}

// ============================================================================
// CONTENT METADATA SERVICE
// ============================================================================
interface IContentMetadataService {
  // Generate comprehensive build metadata
  generateMetadata(content: ProcessedContent): Promise<ContentMetadata>;
  
  // Content statistics and analytics
  generateContentStats(content: ProcessedContent): ContentStats;
  
  // Build performance metrics
  generateBuildMetrics(processingResults: ContentProcessingResult[]): BuildMetrics;
}

// ============================================================================
// SHARED DATA STRUCTURES
// ============================================================================
interface ProcessedContent {
  blogPosts: BlogPost[];
  caseStudies: CaseStudy[];
  relationships: ContentRelationship[];
  metadata: ContentMetadata;
  processingTimestamp: Date;
}

interface StaticRoute {
  path: string;
  component: string;
  props: Record<string, any>;
  metadata: RouteMetadata;
}

interface RouteMetadata {
  title: string;
  description?: string;
  lastModified: Date;
  priority: number;
}

interface SEORoute extends StaticRoute {
  sitemap: boolean;
  robots: 'index' | 'noindex';
  canonicalUrl?: string;
}

interface ContentMetadata {
  totalPosts: number;
  totalCaseStudies: number;
  categories: string[];
  tags: string[];
  authors: string[];
  lastUpdated: Date;
  buildTimestamp: Date;
  buildVersion: string;
  contentHash: string;
}

interface ProcessingMetrics {
  totalProcessingTime: number;
  contentTransformTime: number;
  relationshipComputeTime: number;
  routeGenerationTime: number;
  memoryUsage: number;
}

// ============================================================================
// ERROR HANDLING INTERFACES
// ============================================================================
interface ProcessingError {
  type: 'critical' | 'content' | 'transformation';
  source: string;
  message: string;
  recoveryAction: string;
  timestamp: Date;
}

interface RelationshipError {
  type: 'algorithm_failure' | 'timeout' | 'data_integrity';
  algorithm?: RelationshipAlgorithm;
  sourceContent: string;
  targetContent?: string;
  message: string;
}

interface RouteError {
  type: 'generation_failure' | 'duplicate_route' | 'invalid_props';
  route: string;
  message: string;
  resolution: string;
}
```

### Service Implementation Examples

```typescript
// ============================================================================
// CONTENT PIPELINE SERVICE IMPLEMENTATION
// ============================================================================
export const useContentPipeline = (): IContentPipelineService => {
  const processAllContent = async (options: ProcessingOptions = {}): Promise<ContentProcessingResult> => {
    const startTime = Date.now();
    const errors: ProcessingError[] = [];
    const warnings: ProcessingWarning[] = [];
    
    try {
      // Step 1: Load raw content with timeout protection
      const timeoutMs = options.timeoutMs || 30000;
      const contentPromise = Promise.race([
        Promise.all([
          queryContent('blog').find(),
          queryContent('case-studies').find()
        ]),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Content loading timeout')), timeoutMs)
        )
      ]);
      
      const [blogPosts, caseStudies] = await contentPromise as any[];
      
      // Step 2: Validate content structure
      const validationResults = validateContent([...blogPosts, ...caseStudies]);
      validationResults.forEach(result => {
        if (result.severity === 'error') errors.push(result);
        if (result.severity === 'warning') warnings.push(result);
      });
      
      // Step 3: Transform to typed interfaces with error recovery
      const transformationResult = transformContent([...blogPosts, ...caseStudies]);
      errors.push(...transformationResult.errors);
      warnings.push(...transformationResult.warnings);
      
      // Step 4: Compute relationships (unless skipped)
      let relationships: ContentRelationship[] = [];
      if (!options.skipRelationships) {
        const relationshipService = useContentRelationships();
        const relationshipResult = await relationshipService.computeRelationships({
          blogPosts: transformationResult.processedBlogs,
          caseStudies: transformationResult.processedCases,
          relationships: [],
          metadata: {} as ContentMetadata,
          processingTimestamp: new Date()
        }, {
          algorithms: ['tag_similarity', 'category_match'],
          minStrength: 0.1,
          maxRelationsPerContent: 5
        });
        
        if (relationshipResult.success) {
          relationships = relationshipResult.relationships;
        } else {
          errors.push(...relationshipResult.errors.map(e => ({
            type: 'content' as const,
            source: 'relationship_computation',
            message: e.message,
            recoveryAction: 'Continue without relationships',
            timestamp: new Date()
          })));
        }
      }
      
      // Step 5: Generate metadata
      const metadataService = useContentMetadata();
      const metadata = await metadataService.generateMetadata({
        blogPosts: transformationResult.processedBlogs,
        caseStudies: transformationResult.processedCases,
        relationships,
        metadata: {} as ContentMetadata,
        processingTimestamp: new Date()
      });
      
      const endTime = Date.now();
      const metrics: ProcessingMetrics = {
        totalProcessingTime: endTime - startTime,
        contentTransformTime: transformationResult.transformTime,
        relationshipComputeTime: relationships.length > 0 ? 1000 : 0, // Placeholder
        routeGenerationTime: 0,
        memoryUsage: process.memoryUsage().heapUsed
      };
      
      return {
        success: errors.filter(e => e.type === 'critical').length === 0,
        content: {
          blogPosts: transformationResult.processedBlogs,
          caseStudies: transformationResult.processedCases,
          relationships,
          metadata,
          processingTimestamp: new Date()
        },
        errors,
        warnings,
        metrics
      };
      
    } catch (error) {
      errors.push({
        type: 'critical',
        source: 'content_pipeline',
        message: error instanceof Error ? error.message : 'Unknown error',
        recoveryAction: 'Check content structure and try again',
        timestamp: new Date()
      });
      
      return {
        success: false,
        errors,
        warnings,
        metrics: {
          totalProcessingTime: Date.now() - startTime,
          contentTransformTime: 0,
          relationshipComputeTime: 0,
          routeGenerationTime: 0,
          memoryUsage: process.memoryUsage().heapUsed
        }
      };
    }
  };
  
  const validateContent = (rawContent: RawContent[]): ValidationResult[] => {
    // Implementation for content validation
    return rawContent.map(content => validateSingleContent(content)).flat();
  };
  
  const transformContent = (rawContent: RawContent[]): TransformationResult => {
    // Implementation for content transformation with error recovery
    const startTime = Date.now();
    const processedBlogs: BlogPost[] = [];
    const processedCases: CaseStudy[] = [];
    const errors: ProcessingError[] = [];
    const warnings: ProcessingWarning[] = [];
    
    rawContent.forEach(content => {
      try {
        if (content._path?.includes('/blog/')) {
          processedBlogs.push(transformToBlogPost(content));
        } else if (content._path?.includes('/case-studies/')) {
          processedCases.push(transformToCaseStudy(content));
        }
      } catch (error) {
        errors.push({
          type: 'transformation',
          source: content._path || 'unknown',
          message: error instanceof Error ? error.message : 'Transformation failed',
          recoveryAction: 'Use fallback content structure',
          timestamp: new Date()
        });
      }
    });
    
    return {
      processedBlogs,
      processedCases,
      errors,
      warnings,
      transformTime: Date.now() - startTime
    };
  };
  
  return { processAllContent, validateContent, transformContent };
};

// ============================================================================
// RELATIONSHIP SERVICE IMPLEMENTATION  
// ============================================================================
export const useContentRelationships = (): IContentRelationshipService => {
  const computeRelationships = async (
    content: ProcessedContent,
    options: RelationshipOptions = {
      algorithms: ['tag_similarity'],
      minStrength: 0.1,
      maxRelationsPerContent: 3
    }
  ): Promise<RelationshipResult> => {
    const startTime = Date.now();
    const errors: RelationshipError[] = [];
    const relationships: ContentRelationship[] = [];
    
    try {
      // Apply each algorithm with timeout protection
      for (const algorithm of options.algorithms) {
        const algorithmPromise = applyRelationshipAlgorithm(content, algorithm, options);
        const timeoutPromise = new Promise<ContentRelationship[]>((_, reject) =>
          setTimeout(() => reject(new Error(`${algorithm} timeout`)), options.timeoutMs || 10000)
        );
        
        try {
          const algorithmResults = await Promise.race([algorithmPromise, timeoutPromise]);
          relationships.push(...algorithmResults);
        } catch (error) {
          errors.push({
            type: 'timeout',
            algorithm,
            sourceContent: 'multiple',
            message: `Algorithm ${algorithm} timed out`,
          });
        }
      }
      
      // Filter and sort relationships
      const filteredRelationships = filterRelationships(relationships, [
        { type: 'min_strength', value: options.minStrength },
        { type: 'max_per_content', value: options.maxRelationsPerContent }
      ]);
      
      return {
        success: true,
        relationships: filteredRelationships,
        errors,
        algorithmMetrics: options.algorithms.map(alg => ({
          algorithm: alg,
          processingTime: Date.now() - startTime,
          relationshipsGenerated: relationships.filter(r => r.relationship_type.includes(alg.split('_')[0])).length
        }))
      };
      
    } catch (error) {
      return {
        success: false,
        relationships: [],
        errors: [{
          type: 'algorithm_failure',
          sourceContent: 'pipeline',
          message: error instanceof Error ? error.message : 'Unknown relationship error'
        }],
        algorithmMetrics: []
      };
    }
  };
  
  const scoreRelationship = (
    source: BlogPost | CaseStudy,
    target: BlogPost | CaseStudy,
    algorithm: RelationshipAlgorithm
  ): RelationshipScore => {
    // Implementation for relationship scoring based on algorithm
    switch (algorithm) {
      case 'tag_similarity':
        return calculateTagSimilarity(source, target);
      case 'category_match':
        return calculateCategoryMatch(source, target);
      default:
        return { score: 0, confidence: 0, reason: 'Unknown algorithm' };
    }
  };
  
  const filterRelationships = (
    relationships: ContentRelationship[],
    filters: RelationshipFilter[]
  ): ContentRelationship[] => {
    return relationships.filter(relationship => {
      return filters.every(filter => applyRelationshipFilter(relationship, filter));
    });
  };
  
  return { computeRelationships, scoreRelationship, filterRelationships };
};

// ============================================================================
// STATIC ROUTE SERVICE IMPLEMENTATION
// ============================================================================
export const useStaticRoutes = (): IStaticRouteService => {
  const generateContentRoutes = async (content: ProcessedContent): Promise<RouteGenerationResult> => {
    const routes: StaticRoute[] = [];
    const errors: RouteError[] = [];
    
    try {
      // Generate blog post routes
      content.blogPosts.forEach(post => {
        try {
          routes.push({
            path: `/blog/${post.slug}`,
            component: 'BlogPostDetail',
            props: { 
              post, 
              relationships: getRelatedContent(post, content) 
            },
            metadata: {
              title: post.title,
              description: post.excerpt,
              lastModified: post.date,
              priority: 0.8
            }
          });
        } catch (error) {
          errors.push({
            type: 'generation_failure',
            route: `/blog/${post.slug}`,
            message: error instanceof Error ? error.message : 'Route generation failed',
            resolution: 'Check post data structure'
          });
        }
      });
      
      // Generate case study routes
      content.caseStudies.forEach(study => {
        try {
          routes.push({
            path: `/case-studies/${study.slug}`,
            component: 'CaseStudyDetail',
            props: { 
              study, 
              relationships: getRelatedContent(study, content) 
            },
            metadata: {
              title: study.title,
              description: study.challenge,
              lastModified: new Date(), // Case studies don't have dates
              priority: 0.9
            }
          });
        } catch (error) {
          errors.push({
            type: 'generation_failure',
            route: `/case-studies/${study.slug}`,
            message: error instanceof Error ? error.message : 'Route generation failed',
            resolution: 'Check case study data structure'
          });
        }
      });
      
      const indexRoutes = generateIndexRoutes(content);
      const seoRoutes = generateSEORoutes(content);
      
      return {
        success: errors.length === 0,
        routes,
        indexRoutes,
        seoRoutes,
        errors
      };
      
    } catch (error) {
      return {
        success: false,
        routes: [],
        indexRoutes: [],
        seoRoutes: [],
        errors: [{
          type: 'generation_failure',
          route: 'multiple',
          message: error instanceof Error ? error.message : 'Route generation failed',
          resolution: 'Check content processing pipeline'
        }]
      };
    }
  };
  
  const generateIndexRoutes = (content: ProcessedContent): StaticRoute[] => {
    return [
      {
        path: '/blog',
        component: 'BlogIndex',
        props: { posts: content.blogPosts },
        metadata: {
          title: 'Blog',
          description: 'Latest insights and research communication',
          lastModified: new Date(),
          priority: 0.9
        }
      },
      {
        path: '/case-studies',
        component: 'CaseStudyIndex', 
        props: { studies: content.caseStudies },
        metadata: {
          title: 'Case Studies',
          description: 'Our portfolio of successful projects',
          lastModified: new Date(),
          priority: 0.9
        }
      }
    ];
  };
  
  const generateSEORoutes = (content: ProcessedContent): SEORoute[] => {
    // Generate sitemap and SEO-specific routes
    const allRoutes = [
      ...content.blogPosts.map(post => ({
        path: `/blog/${post.slug}`,
        component: 'BlogPostDetail',
        props: { post },
        metadata: {
          title: post.title,
          description: post.excerpt,
          lastModified: post.date,
          priority: 0.8
        },
        sitemap: true,
        robots: 'index' as const,
        canonicalUrl: `https://ccm-website.com/blog/${post.slug}`
      }))
    ];
    
    return allRoutes;
  };
  
  return { generateContentRoutes, generateIndexRoutes, generateSEORoutes };
};
```

### Build-Time Data Transformation

```typescript
// Transform markdown content to typed interfaces
const transformToBlogPost = (rawPost: any): BlogPost => ({
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
  slug: rawPost._path?.replace('/blog/', '') || '',
  relationships: [] // Populated during relationship computation
});

const transformToCaseStudy = (rawStudy: any): CaseStudy => ({
  title: rawStudy.title,
  client: extractClientFromTitle(rawStudy.title),
  challenge: rawStudy.challenge || '',
  solution: rawStudy.solution || '',
  impact: rawStudy.impact || '',
  sector: rawStudy.sector || 'General',
  services: rawStudy.services || [],
  content: rawStudy.body?.html || '',
  slug: rawStudy._path?.replace('/case-studies/', '') || '',
  featured_image: rawStudy.featured_image,
  gallery: rawStudy.gallery || [],
  relationships: []
});
```
