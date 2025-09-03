# Epic 1: Content Skeleton & Data Piping for Static Site Generation

**Epic Goal**: Create a content skeleton system with data piping components that transforms Nuxt Content into structured static HTML pages. Build the minimal components and composables needed to pipe content data through static generation without any visual styling.

**Integration Requirements**: All data piping components must integrate with existing ccm components and preserve current CSS class structures while adding the content flow logic needed for static site generation.

## Story 1.1: Build-Time Content Pipeline Foundation

As a developer,
I want build-time composables that process content during static generation,
so that all content queries and transformations happen at build time rather than runtime.

### Acceptance Criteria
1. Create `useContentPipeline` composable that processes all Nuxt Content during `nuxt generate`
2. Implement `useContentRelationships` for build-time mapping between posts, case studies, and clients
3. Build `useStaticRoutes` for generating all content-based routes during build
4. All composables provide clean data structures for piping to components

### Integration Verification
- IV1: Existing Nuxt Content integration continues working without modification
- IV2: `nuxt generate` completes successfully with new composables
- IV3: Generated static site contains all processed content relationships

## Story 1.2: Basic Data Piping Components

As a content author,
I want bare-bones components that pipe content data from composables to HTML,
so that content appears in structured static pages without styling.

### Acceptance Criteria
1. Create `ccmContentMeta`, `ccmContentList`, `ccmContentDetail` data piping components
2. Components use minimal HTML tags (headings, lists, articles) with content piping logic
3. Components accept content data from build-time composables and render semantic HTML
4. Preserve existing ccm naming conventions and CSS class structures

### Integration Verification
- IV1: Components integrate with existing ccm components without breaking layouts
- IV2: Static generation produces clean, semantic HTML for all content types
- IV3: Content flows correctly from Nuxt Content through composables to components

## Story 1.3: Content Relationship Components

As a content author,
I want components that pipe related content connections,
so that content relationships appear in static HTML without runtime queries.

### Acceptance Criteria
1. Create `ccmRelatedPosts`, `ccmClientPortfolio`, `ccmProjectLinks` relationship components
2. Components use data from `useContentRelationships` composable to render HTML lists
3. Handle blog-to-case-study, client-to-project, and post-to-tag relationships
4. Generate static HTML with all relationships pre-computed

### Integration Verification
- IV1: Relationship components work with existing page templates
- IV2: Static generation includes all content relationships in HTML
- IV3: Related content links work correctly in static site

## Story 1.4: Content Index Page Generation

As a site visitor,
I want index pages that list all content of each type,
so that I can browse blog posts, case studies, and client work in generated static pages.

### Acceptance Criteria
1. Create `ccmBlogIndex`, `ccmCaseStudyIndex`, `ccmClientIndex` page components
2. Components use `useContentPipeline` to generate static HTML lists during build
3. Each index page includes content metadata and links to detail pages
4. All index pages generate as static HTML files during `nuxt generate`

### Integration Verification
- IV1: Index pages work with existing layout components (layouts/default.vue)
- IV2: Static generation creates all index pages without build errors
- IV3: Index page navigation links work correctly in static site

## Story 1.5: Complete Content Skeleton Integration

As a content author,
I want all content types to flow through the complete skeleton system,
so that blog posts, case studies, and client profiles generate as structured static pages.

### Acceptance Criteria
1. Integrate all piping components with existing page templates (blog/[...slug].vue, etc.)
2. Ensure `useContentPipeline` provides data to all existing and new page routes
3. Generate complete static site with all content relationships and indexes
4. Test that existing content displays correctly through new piping system

### Integration Verification
- IV1: All existing pages work with new content piping without breaking
- IV2: `nuxt generate` produces complete static site with all content types
- IV3: Generated site maintains existing navigation and footer functionality

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>