# CCM Website Content Skeleton & Data Piping Brownfield Enhancement PRD

## Intro Project Analysis and Context

### Existing Project Overview

**Analysis Source**: IDE-based fresh analysis (project loaded in Claude Code)

**Current Project State**: This is a Nuxt 3 website project with client-side rendering (SSR disabled) that uses Vue 3 composition API. The project follows a component-based architecture with custom CSS using CSS layers and is CMS agnostic. It includes Nuxt Content for file-based content management.

### Available Documentation Analysis

**Using existing project analysis from CLAUDE.md:**

Available Documentation:
- ✅ Tech Stack Documentation (Nuxt 3, Vue 3, TypeScript, PostCSS)
- ✅ Source Tree/Architecture (component-based with ccm prefix naming)
- ✅ Coding Standards (Vue 3 Composition API, CSS layers methodology)
- ✅ API Documentation (Nuxt Content integration)
- ❌ External API Documentation 
- ❌ UX/UI Guidelines (beyond CSS layer structure)
- ❌ Technical Debt Documentation

### Enhancement Scope Definition

**Enhancement Description**: 
Build a content skeleton system with data piping components that transforms raw Nuxt Content into properly structured static HTML pages. Create bare-bones components with minimal HTML tags and the logic necessary to pull content from Nuxt Content and pipe it between components for static site generation. Focus exclusively on making content flow work without any visual styling.

**Enhancement Type**: ✅ New Feature Addition (content skeleton and data piping system)

**Impact Assessment**: ✅ Significant Impact (substantial existing code changes) - This will add content piping components and composables while preserving existing patterns.

### Goals and Background Context

**Goals**:
• Create content skeleton that pipes data from Nuxt Content to static HTML pages
• Build data piping components with bare-bones HTML and content flow logic
• Implement composables for content fetching, filtering, and relationship mapping at build time
• Generate static pages for all content types (blog posts, case studies, client profiles)
• Enable content relationships and cross-references in static site generation

**Background Context**: 
CCM website has foundational Nuxt Content integration but needs a content skeleton system to properly pipe rich content data to static HTML pages. Current system has basic components but lacks the data piping logic needed to transform Nuxt Content into structured static pages for blog posts (15+ metadata fields), case studies, and client portfolios. The skeleton must work as static generation before visual design is applied.

### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|---------|
| Architecture Update | 2025-01-02 | v1.1 | Updated from client-side rendering to static site generation | John (PM) |
| Initial Creation | 2025-01-02 | v1.0 | Created brownfield enhancement PRD for content component ecosystem | John (PM) |

## Requirements

### Functional Requirements

**FR1**: The system will create **data piping components** with bare-bones HTML structure and logic to pull content from Nuxt Content and pass it between components during static site generation

**FR2**: Content fetching composables will leverage **Nuxt's `generate` command** to pre-process all content queries, relationships, and transformations at build time, creating static HTML for all content types

**FR3**: **Content skeleton components** will handle blog posts, case studies, and client profiles with minimal HTML tags and the specific logic needed to pipe content data through the static generation process

**FR4**: **Build-time composables** (useContentPipeline, useContentRelationships, useStaticRoutes) will process content during generation and provide data structures to piping components

**FR5**: **Content relationship mapping** will pre-compute connections between posts, case studies, clients, and projects during build time and embed them in static HTML structure

**FR6**: **Static page generation** will create all content index pages, detail pages, and cross-reference pages using the content piping components without runtime content queries

### Non-Functional Requirements

**NFR1**: All data piping components must be **SSG-compatible** with bare-bones HTML output and no runtime content queries - all processing happens during `nuxt generate` command

**NFR2**: Content skeleton must generate **clean, semantic HTML** structure that works without JavaScript and provides foundation for future CSS implementation

**NFR3**: Build process must handle complete content piping and generate all static pages with embedded content relationships

**NFR4**: Components must use minimal HTML tags with only the logic necessary to pipe content data between components during static generation

### Compatibility Requirements

**CR1**: Must integrate with **Nuxt's `nuxt generate`** command to produce fully static website deployable to any static hosting service

**CR2**: All content piping must use **Nuxt Content's static generation capabilities** rather than runtime API calls

**CR3**: Data piping components must work with existing ccm component naming conventions and preserve current CSS class structures

**CR4**: Content skeleton must support **future CSS implementation** without breaking the HTML structure or data piping logic

## Technical Constraints and Integration Requirements

### Existing Technology Stack

**Languages**: JavaScript/TypeScript, Vue 3 SFC, Markdown (content files)
**Frameworks**: Nuxt 3 with **Static Site Generation** (`nuxt generate`), Vue 3 Composition API
**Content Management**: Nuxt Content with file-based CMS (Markdown + YAML frontmatter)
**Build Tools**: Vite, PostCSS, TypeScript compiler
**Static Generation**: Nuxt's built-in SSG capabilities for complete pre-rendering
**Deployment**: Static file output compatible with Netlify, Vercel, GitHub Pages, or any CDN

### Integration Approach

**Static Generation Strategy**: All content processing happens at build time using `nuxt generate` command
- Content queries execute during build to create static HTML for all pages
- Related content relationships pre-calculated and embedded in static markup
- All filtering/pagination options become separate static routes
- No runtime API calls or client-side content fetching

**Component Integration Strategy**: Components designed for SSG with progressive enhancement
- Server-rendered HTML structure with semantic markup
- Client-side JavaScript adds interactivity on top of functional static content
- All PX methodology logic baked into static HTML structure
- Progressive enhancement for non-essential interactive features

**Content Processing Strategy**: Build-time optimization for all content relationships
- Nuxt Content processes all Markdown files during `nuxt generate`
- Frontmatter relationships mapped to static route generation
- Client-project associations pre-computed into static HTML
- Search/filtering implemented as static route generation rather than dynamic queries

### Code Organization and Standards

**Static Generation File Structure**: 
- `/content/` - Markdown files processed at build time
- `/components/` - SSG-compatible Vue components with ccm prefix
- `/composables/` - Build-time utilities for content processing
- `/pages/` - Route definitions that generate static HTML files
- `nuxt.config.ts` - SSG configuration with `nitro: { prerender: { routes: [...] } }`

**Build-Time Component Standards**:
- Components must work with Nuxt's server-side rendering during generation
- All data dependencies resolved at build time through composables
- No runtime content API calls or dynamic imports
- Progressive enhancement pattern for any client-side interactivity

### Deployment and Operations

**Static Build Process**: 
- `nuxt generate` produces complete static site in `dist/` directory
- All content relationships pre-computed during build
- Generated site contains no server dependencies
- Build process handles incremental updates when content changes

**Deployment Strategy**: 
- Deploy static files to CDN/static hosting service
- No server-side runtime required
- Perfect caching since all content is static
- Build process triggered by content changes in repository

**Performance Monitoring**: 
- Lighthouse scores for static site performance
- Build time monitoring for content processing efficiency
- Static asset optimization during generation process

### Risk Assessment and Mitigation

**Build Complexity Risks**: 
- Complex content relationships may increase build time significantly
- Solution: Optimize content queries and implement incremental builds

**Static Generation Limitations**: 
- No dynamic content filtering without JavaScript
- Solution: Pre-generate all filter combinations as static routes

**Content Update Workflow**: 
- Content changes require full site rebuild and redeployment
- Solution: Implement automated build/deploy pipeline triggered by content commits

**SEO and Performance Benefits**: 
- Perfect SEO since all content is pre-rendered HTML
- Excellent performance scores with static delivery
- No runtime content loading delays

## Epic and Story Structure

### Epic Approach

**Epic Structure Decision**: Single comprehensive epic with sequential story implementation to minimize risk to existing system while building integrated component ecosystem.

## Epic 1: Content Skeleton & Data Piping for Static Site Generation

**Epic Goal**: Create a content skeleton system with data piping components that transforms Nuxt Content into structured static HTML pages. Build the minimal components and composables needed to pipe content data through static generation without any visual styling.

**Integration Requirements**: All data piping components must integrate with existing ccm components and preserve current CSS class structures while adding the content flow logic needed for static site generation.

### Story 1.1: Build-Time Content Pipeline Foundation

As a developer,
I want build-time composables that process content during static generation,
so that all content queries and transformations happen at build time rather than runtime.

#### Acceptance Criteria
1. Create `useContentPipeline` composable that processes all Nuxt Content during `nuxt generate`
2. Implement `useContentRelationships` for build-time mapping between posts, case studies, and clients
3. Build `useStaticRoutes` for generating all content-based routes during build
4. All composables provide clean data structures for piping to components

#### Integration Verification
- IV1: Existing Nuxt Content integration continues working without modification
- IV2: `nuxt generate` completes successfully with new composables
- IV3: Generated static site contains all processed content relationships

### Story 1.2: Basic Data Piping Components

As a content author,
I want bare-bones components that pipe content data from composables to HTML,
so that content appears in structured static pages without styling.

#### Acceptance Criteria
1. Create `ccmContentMeta`, `ccmContentList`, `ccmContentDetail` data piping components
2. Components use minimal HTML tags (headings, lists, articles) with content piping logic
3. Components accept content data from build-time composables and render semantic HTML
4. Preserve existing ccm naming conventions and CSS class structures

#### Integration Verification
- IV1: Components integrate with existing ccm components without breaking layouts
- IV2: Static generation produces clean, semantic HTML for all content types
- IV3: Content flows correctly from Nuxt Content through composables to components

### Story 1.3: Content Relationship Components

As a content author,
I want components that pipe related content connections,
so that content relationships appear in static HTML without runtime queries.

#### Acceptance Criteria
1. Create `ccmRelatedPosts`, `ccmClientPortfolio`, `ccmProjectLinks` relationship components
2. Components use data from `useContentRelationships` composable to render HTML lists
3. Handle blog-to-case-study, client-to-project, and post-to-tag relationships
4. Generate static HTML with all relationships pre-computed

#### Integration Verification
- IV1: Relationship components work with existing page templates
- IV2: Static generation includes all content relationships in HTML
- IV3: Related content links work correctly in static site

### Story 1.4: Content Index Page Generation

As a site visitor,
I want index pages that list all content of each type,
so that I can browse blog posts, case studies, and client work in generated static pages.

#### Acceptance Criteria
1. Create `ccmBlogIndex`, `ccmCaseStudyIndex`, `ccmClientIndex` page components
2. Components use `useContentPipeline` to generate static HTML lists during build
3. Each index page includes content metadata and links to detail pages
4. All index pages generate as static HTML files during `nuxt generate`

#### Integration Verification
- IV1: Index pages work with existing layout components (layouts/default.vue)
- IV2: Static generation creates all index pages without build errors
- IV3: Index page navigation links work correctly in static site

### Story 1.5: Complete Content Skeleton Integration

As a content author,
I want all content types to flow through the complete skeleton system,
so that blog posts, case studies, and client profiles generate as structured static pages.

#### Acceptance Criteria
1. Integrate all piping components with existing page templates (blog/[...slug].vue, etc.)
2. Ensure `useContentPipeline` provides data to all existing and new page routes
3. Generate complete static site with all content relationships and indexes
4. Test that existing content displays correctly through new piping system

#### Integration Verification
- IV1: All existing pages work with new content piping without breaking
- IV2: `nuxt generate` produces complete static site with all content types
- IV3: Generated site maintains existing navigation and footer functionality

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>