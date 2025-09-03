/**
 * Content processing pipeline interfaces
 * Based on architecture/api-specification.md specifications
 */

import type { BlogPost, CaseStudy, ContentRelationship, RelationshipType } from './content'

// ============================================================================
// PROCESSING OPTIONS AND CONFIGURATIONS
// ============================================================================

export interface ProcessingOptions {
  skipRelationships?: boolean;
  validateOnly?: boolean;
  timeoutMs?: number;
}

export interface RelationshipOptions {
  algorithms: RelationshipAlgorithm[];
  minStrength: number;
  maxRelationsPerContent: number;
  timeoutMs?: number;
}

export type RelationshipAlgorithm = 'tag_similarity' | 'category_match' | 'content_analysis' | 'semantic_similarity';

// ============================================================================
// PROCESSED CONTENT AND METADATA
// ============================================================================

export interface ProcessedContent {
  blogPosts: BlogPost[];
  caseStudies: CaseStudy[];
  relationships: ContentRelationship[];
  metadata: ContentMetadata;
  processingTimestamp: Date;
}

export interface ContentMetadata {
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

export interface ProcessingMetrics {
  totalProcessingTime: number;
  contentTransformTime: number;
  relationshipComputeTime: number;
  routeGenerationTime: number;
  memoryUsage: number;
}

// ============================================================================
// ROUTING INTERFACES
// ============================================================================

export interface StaticRoute {
  path: string;
  component: string;
  props: Record<string, any>;
  metadata: RouteMetadata;
}

export interface RouteMetadata {
  title: string;
  description?: string;
  lastModified: Date;
  priority: number;
}

export interface SEORoute extends StaticRoute {
  sitemap: boolean;
  robots: 'index' | 'noindex';
  canonicalUrl?: string;
}

// ============================================================================
// ERROR HANDLING INTERFACES
// ============================================================================

export interface ProcessingError {
  type: 'critical' | 'content' | 'transformation';
  source: string;
  message: string;
  recoveryAction: string;
  timestamp: Date;
}

export interface ProcessingWarning {
  type: 'validation' | 'metadata' | 'relationship';
  source: string;
  message: string;
  timestamp: Date;
}

export interface RelationshipError {
  type: 'algorithm_failure' | 'timeout' | 'data_integrity';
  algorithm?: RelationshipAlgorithm;
  sourceContent: string;
  targetContent?: string;
  message: string;
}

export interface RouteError {
  type: 'generation_failure' | 'duplicate_route' | 'invalid_props';
  route: string;
  message: string;
  resolution: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ProcessingError[];
  warnings: ProcessingWarning[];
  severity: 'error' | 'warning' | 'info';
}

export interface TransformationResult {
  processedBlogs: BlogPost[];
  processedCases: CaseStudy[];
  errors: ProcessingError[];
  warnings: ProcessingWarning[];
  transformTime: number;
}

// ============================================================================
// RESULT INTERFACES
// ============================================================================

export interface ContentProcessingResult {
  success: boolean;
  content?: ProcessedContent;
  errors: ProcessingError[];
  warnings: ProcessingWarning[];
  metrics: ProcessingMetrics;
}

export interface RelationshipResult {
  success: boolean;
  relationships: ContentRelationship[];
  errors: RelationshipError[];
  algorithmMetrics: AlgorithmMetrics[];
}

export interface RouteGenerationResult {
  success: boolean;
  routes: StaticRoute[];
  indexRoutes: StaticRoute[];
  seoRoutes: SEORoute[];
  errors: RouteError[];
}

export interface RelationshipScore {
  score: number;
  confidence: number;
  reason: string;
}

export interface AlgorithmMetrics {
  algorithm: RelationshipAlgorithm;
  processingTime: number;
  relationshipsGenerated: number;
}

export interface RelationshipFilter {
  type: 'min_strength' | 'max_per_content' | 'content_type';
  value: number | string;
}

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IContentPipelineService {
  processAllContent(options?: ProcessingOptions): Promise<ContentProcessingResult>;
  validateContent(rawContent: RawContent[]): ValidationResult[];
  transformContent(rawContent: RawContent[]): TransformationResult;
}

export interface IContentRelationshipService {
  computeRelationships(content: ProcessedContent, options?: RelationshipOptions): Promise<RelationshipResult>;
  scoreRelationship(source: BlogPost | CaseStudy, target: BlogPost | CaseStudy, algorithm: RelationshipAlgorithm): RelationshipScore;
  filterRelationships(relationships: ContentRelationship[], filters: RelationshipFilter[]): ContentRelationship[];
}

export interface IStaticRouteService {
  generateContentRoutes(content: ProcessedContent): Promise<RouteGenerationResult>;
  generateIndexRoutes(content: ProcessedContent): StaticRoute[];
  generateSEORoutes(content: ProcessedContent): SEORoute[];
}

// ============================================================================
// RAW CONTENT INTERFACE (Nuxt Content)
// ============================================================================

export interface RawContent {
  _path?: string;
  title: string;
  body?: {
    html?: string;
  };
  [key: string]: any; // For flexible frontmatter fields
}