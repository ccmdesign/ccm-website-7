# Core Workflows

Key system workflows illustrating content processing, static generation, and user interactions:

## Content Publication Workflow

```mermaid
sequenceDiagram
    participant E as Editor
    participant G as Git Repository
    participant N as Netlify Build
    participant CP as Content Pipeline
    participant SG as Static Generator
    participant CDN as Netlify CDN
    participant U as User
    
    E->>G: Commit new markdown content
    G->>N: Trigger build webhook
    N->>CP: Initialize content processing
    CP->>CP: Parse all markdown files
    CP->>CP: Transform to typed interfaces
    CP->>CP: Compute content relationships
    CP->>SG: Processed content + relationships
    SG->>SG: Generate static routes
    SG->>SG: Render all pages with content
    SG->>CDN: Deploy static HTML files
    CDN->>U: Serve optimized content
```

## Content Relationship Computation

```mermaid
sequenceDiagram
    participant CP as Content Pipeline
    participant RE as Relationship Engine
    participant BP as BlogPost[]
    participant CS as CaseStudy[]
    participant R as Relationships[]
    
    CP->>RE: Request relationship computation
    RE->>BP: Analyze blog metadata
    RE->>CS: Analyze case study metadata
    RE->>RE: Compare tags vs services
    RE->>RE: Score relationship strength
    RE->>RE: Filter by minimum threshold
    RE->>R: Generate relationship objects
    R->>CP: Return computed relationships
    CP->>CP: Embed relationships in content
```

## Static Page Generation Flow

```mermaid
sequenceDiagram
    participant SG as Static Generator
    participant C as Content Data
    participant R as Router
    participant T as Templates
    participant H as HTML Output
    
    SG->>C: Request all processed content
    C->>SG: BlogPosts + CaseStudies + Relationships
    SG->>R: Generate dynamic routes
    loop For each content piece
        SG->>T: Select appropriate template
        T->>T: Render with content + relationships
        T->>H: Generate static HTML file
    end
    SG->>H: Generate index pages
    SG->>H: Generate sitemap + SEO files
```

## User Content Discovery Journey

```mermaid
sequenceDiagram
    participant U as User
    participant CDN as Static Site
    participant P as Page
    participant RC as Related Content
    participant N as Navigation
    
    U->>CDN: Visit blog post
    CDN->>P: Serve static HTML with embedded data
    P->>RC: Display computed related content
    U->>RC: Click related case study
    CDN->>P: Serve case study with relationships
    P->>RC: Show related blog posts
    U->>N: Navigate to content index
    CDN->>P: Serve categorized content list
```

## Build-Time Error Handling

```mermaid
sequenceDiagram
    participant N as Netlify Build
    participant CP as Content Pipeline
    participant E as Error Handler
    participant L as Build Log
    participant A as Admin Alert
    
    N->>CP: Start content processing
    CP->>CP: Parse markdown file
    alt Malformed frontmatter
        CP->>E: ValidationError
        E->>L: Log detailed error
        E->>A: Send admin notification
        E->>N: Fail build with clear message
    else Missing required fields
        CP->>E: MissingFieldError
        E->>CP: Use default values
        E->>L: Log warning
        CP->>CP: Continue processing
    else Relationship computation failure
        CP->>E: RelationshipError
        E->>CP: Skip relationships for affected content
        E->>L: Log warning with content identifiers
        CP->>CP: Continue with remaining content
    else Content transformation error
        CP->>E: TransformationError
        E->>CP: Use fallback content structure
        E->>L: Log error with recovery action
        CP->>CP: Continue processing
    else Valid content
        CP->>CP: Process normally
    end
```

## Content Processing Resilience Strategy

**Error Recovery Hierarchy:**
1. **Critical Errors** (Fail Build): Malformed project structure, missing required dependencies
2. **Content Errors** (Skip & Continue): Individual content piece processing failures
3. **Relationship Errors** (Degrade Gracefully): Relationship computation failures don't block content
4. **Validation Warnings** (Log & Continue): Missing optional metadata, formatting issues

**Specific Failure Scenarios:**

**Relationship Computation Failures:**
- **Scenario**: Algorithm fails to compute relationships for specific content pair
- **Recovery**: Skip affected relationships, continue processing remaining content
- **Logging**: Log content identifiers and relationship type that failed
- **User Impact**: Content still publishes, just without some related content suggestions

**Content Transformation Errors:**
- **Scenario**: Markdown processing fails for individual post/case study
- **Recovery**: Use fallback content structure with title/date only
- **Logging**: Log transformation error with specific content file path
- **User Impact**: Content publishes with minimal metadata instead of full rich data

**Build Performance Degradation:**
- **Scenario**: Relationship algorithms timeout with large content volumes
- **Recovery**: Implement timeout limits, fallback to simpler relationship scoring
- **Logging**: Performance metrics and timeout warnings
- **User Impact**: Reduced relationship accuracy but site still builds

**Content Validation Pipeline:**
```typescript
// Enhanced error handling in content pipeline
interface ContentProcessingResult {
  success: boolean;
  content?: ProcessedContent;
  errors: ContentError[];
  warnings: ContentWarning[];
}

interface ContentError {
  type: 'critical' | 'content' | 'relationship' | 'validation';
  source: string;
  message: string;
  recoveryAction: string;
}
```
