# Data Models

## BlogPost

**Purpose:** Represents blog post content with rich metadata for research communication and engagement tracking.

**Key Attributes:**
- `brow`: string - Category descriptor displayed above title for content classification
- `title`: string - Primary heading optimized for both SEO and academic credibility  
- `tagline`: string - Extended subtitle providing context and value proposition
- `date`: Date - Publication date for chronological organization and freshness indicators
- `author`: string - Attribution for academic credibility and expertise positioning
- `categories`: string[] - High-level content classification for navigation and filtering
- `tags`: string[] - Granular keywords for content discovery and relationship mapping
- `seo_tags`: string[] - SEO-optimized keywords for search engine optimization
- `excerpt`: string - Summary for index pages and social sharing previews
- `content`: string - Full markdown content processed into HTML during generation
- `slug`: string - URL-friendly identifier derived from filename for static routing
- `relationships`: ContentRelationship[] - Computed connections to case studies and related posts

### TypeScript Interface
```typescript
interface BlogPost {
  brow: string;
  title: string;
  tagline: string;
  date: Date;
  author: string;
  categories: string[];
  tags: string[];
  seo_tags: string[];
  excerpt: string;
  content: string;
  slug: string;
  relationships: ContentRelationship[];
}
```

### Relationships
- **Has Many** Case Studies (via tag matching and content analysis)
- **Belongs To** Author profile (for future expansion)
- **Related To** Other BlogPosts (via category and tag similarity)

## CaseStudy

**Purpose:** Represents client work and project case studies with structured narrative format for portfolio presentation.

**Key Attributes:**
- `title`: string - Project name and client context for clear identification
- `client`: string - Organization name for credibility and sector classification
- `challenge`: string - Problem description establishing project context and complexity
- `solution`: string - Approach and methodology demonstrating expertise and process
- `impact`: string - Results and outcomes showcasing value delivered
- `sector`: string - Industry classification for filtering and expertise demonstration
- `services`: string[] - Service categories provided for capability mapping
- `content`: string - Full narrative content processed from markdown
- `slug`: string - URL identifier for static routing and cross-references
- `featured_image`: string - Hero image path for visual portfolio presentation
- `gallery`: string[] - Additional images showcasing project work

### TypeScript Interface
```typescript
interface CaseStudy {
  title: string;
  client: string;
  challenge: string;
  solution: string;
  impact: string;
  sector: string;
  services: string[];
  content: string;
  slug: string;
  featured_image?: string;
  gallery?: string[];
  relationships: ContentRelationship[];
}
```

### Relationships
- **Related To** BlogPosts (via service and sector matching)
- **Belongs To** Client profile (for client portfolio grouping)
- **Has Many** Project deliverables (for future expansion)

## ContentRelationship

**Purpose:** Represents computed relationships between content pieces for cross-references and content discovery.

**Key Attributes:**
- `source_type`: 'blog' | 'case_study' - Type of content initiating the relationship
- `source_slug`: string - Identifier of the source content piece
- `target_type`: 'blog' | 'case_study' - Type of related content
- `target_slug`: string - Identifier of the related content piece
- `relationship_type`: RelationshipType - Nature of the connection
- `strength`: number - Computed relevance score (0-1) for relationship ranking
- `computed_reason`: string - Explanation of why items are related

### TypeScript Interface
```typescript
type RelationshipType = 'same_category' | 'shared_tags' | 'same_client' | 'similar_services' | 'content_mention';

interface ContentRelationship {
  source_type: 'blog' | 'case_study';
  source_slug: string;
  target_type: 'blog' | 'case_study';
  target_slug: string;
  relationship_type: RelationshipType;
  strength: number;
  computed_reason: string;
}
```

### Relationships
- **Connects** Any content type to any other content type
- **Computed During** Build process using content analysis algorithms
- **Used By** Related content components for cross-promotion
