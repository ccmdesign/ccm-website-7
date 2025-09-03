/**
 * Content type definitions for ccm-website
 * Based on architecture/data-models.md specifications
 */

export type RelationshipType = 'same_category' | 'shared_tags' | 'same_client' | 'similar_services' | 'content_mention';

/**
 * BlogPost interface from architecture/data-models.md#blogpost
 */
export interface BlogPost {
  /** Category descriptor displayed above title */
  brow: string;
  /** Primary heading optimized for SEO */
  title: string;
  /** Extended subtitle with context */
  tagline: string;
  /** Publication date for chronological organization */
  date: Date;
  /** Attribution for academic credibility */
  author: string;
  /** High-level content classification */
  categories: string[];
  /** Granular keywords for discovery */
  tags: string[];
  /** SEO-optimized keywords */
  seo_tags: string[];
  /** Summary for index pages */
  excerpt: string;
  /** Full markdown content processed into HTML */
  content: string;
  /** URL-friendly identifier from filename */
  slug: string;
  /** Computed connections to other content */
  relationships: ContentRelationship[];
}

/**
 * CaseStudy interface from architecture/data-models.md#casestudy
 */
export interface CaseStudy {
  /** Project name and client context */
  title: string;
  /** Organization name for credibility */
  client: string;
  /** Problem description */
  challenge: string;
  /** Approach and methodology */
  solution: string;
  /** Results and outcomes */
  impact: string;
  /** Industry classification */
  sector: string;
  /** Service categories provided */
  services: string[];
  /** Full narrative content */
  content: string;
  /** URL identifier for static routing */
  slug: string;
  /** Hero image path */
  featured_image?: string;
  /** Additional project images */
  gallery?: string[];
  /** Computed connections to other content */
  relationships: ContentRelationship[];
}

/**
 * ContentRelationship interface from architecture/data-models.md#contentrelationship
 */
export interface ContentRelationship {
  /** Content initiating relationship */
  source_type: 'blog' | 'case_study';
  /** Identifier of source content */
  source_slug: string;
  /** Type of related content */
  target_type: 'blog' | 'case_study';
  /** Identifier of related content */
  target_slug: string;
  /** Nature of connection */
  relationship_type: RelationshipType;
  /** Relevance score (0-1) for ranking */
  strength: number;
  /** Explanation of relationship */
  computed_reason: string;
}