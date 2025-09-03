# CCM Website Implementation Plan

## Current State Analysis

### What We Have:
- **Blog Index** (`/blog/index.vue`) - Very basic list of links only
- **Case Study Index** (`/case-studies/index.vue`) - Very basic list of links only  
- **Homepage** (`/index.vue`) - Better structured with preview cards and styling
- **Individual Pages** - Functional with `ccmPostHero` and `ContentRenderer`

### Content Available:
- **5 Blog Posts** with rich metadata (brow, tagline, author, categories, tags, seo_tags, date, excerpt)
- **6 Case Studies** with client/challenge/solution/impact structure
- **Static Pages** (about, contact, what-we-do)

### Current Problems:
1. **Blog/Case Study indexes are too basic** - Just bare links, no content preview
2. **Homepage has better structure** - But duplicates logic that should be componentized
3. **Rich metadata not being used** - Blog posts have 15+ fields but only showing title
4. **Inconsistent presentations** - Homepage previews vs index pages vs individual pages
5. **No filtering/search** - Large amount of content with no discovery tools
6. **Missing PX methodology** - No strategic CTAs or prospect flow

---

## Implementation Plan: 4 Focused Phases

### Phase 1: Foundation Components (Week 1)
**Goal:** Replace basic index pages with rich content previews

#### Components to Build:
1. **`ccmCard`** - Generic content card component
   - Props: title, excerpt, metadata array, badges array, primaryAction
   - Slots: content, actions, metadata
   - Usage: Blog posts, case studies, any content preview

2. **`ccmBadgeList`** - Collection of badges/tags
   - Props: badges array, variant (tags, categories, services)
   - Usage: Tags, categories, client industries, service types

#### Pages to Update:
- **`/blog/index.vue`** - Replace bare links with ccmCard showing:
  - Title, excerpt, author, date, tags, "Read More" CTA
- **`/case-studies/index.vue`** - Replace bare links with ccmCard showing:
  - Title, challenge excerpt, client, industry, "View Results" CTA

#### Success Criteria:
- Blog and case study indexes show rich previews instead of bare links
- Content is consistently presented across different index pages
- Rich metadata from frontmatter is actually being displayed

---

### Phase 2: Homepage Integration (Week 2)  
**Goal:** Replace homepage duplicate logic with reusable components

#### Components to Build:
3. **`ccmContentPreview`** - Enhanced version of ccmCard for homepage
   - Extends ccmCard with featured/highlight variants
   - Props: featured boolean, layout variant
   - Usage: Homepage featured content, "latest posts" sections

#### Pages to Update:
- **`/index.vue`** - Replace duplicate card logic with:
  - ccmContentPreview for latest blog posts
  - ccmContentPreview for featured case studies
  - Consistent styling through components instead of scoped CSS

#### Success Criteria:
- Homepage uses same components as index pages
- No duplicate card HTML/CSS logic
- Consistent content presentation across all pages

---

### Phase 3: Individual Page Enhancement (Week 3)
**Goal:** Add proper CTAs and related content to single pages

#### Components to Build:
4. **`ccmButton`** - Generic button with PX methodology support
   - Props: variant (primary, secondary, buyer), pxMode, action
   - Usage: CTAs throughout site, form submissions, navigation

5. **`ccmRelatedContent`** - Related/suggested content section
   - Props: items, title, layout variant
   - Usage: "Related articles", "Similar case studies", "You might also like"

#### Pages to Update:
- **`/blog/[...slug].vue`** - Add:
  - Proper CTA buttons (Subscribe, Contact, Related Services)
  - Related articles section using ccmRelatedContent
  - Enhanced metadata display
- **`/case-studies/[...slug].vue`** - Add:
  - "Get Similar Results" CTA using ccmButton
  - Related services links (not other case studies - PX methodology)
  - Client testimonial if available

#### Success Criteria:
- Every content page has clear primary CTA (PX methodology)
- Related content helps guide prospects through positioning flow
- Consistent button styling and behavior across site

---

### Phase 4: Content Discovery (Week 4)
**Goal:** Add filtering and search capabilities for content discovery

#### Components to Build:
6. **`ccmFilterPanel`** - Content filtering interface
   - Props: filterOptions, activeFilters, layout
   - Usage: Blog category filtering, case study industry filtering

7. **`ccmSearchBox`** - Search input with suggestions
   - Props: placeholder, suggestions, searchFunction
   - Usage: Content search, client search, tag search

#### Pages to Update:
- **`/blog/index.vue`** - Add filtering by:
  - Categories, tags, author, date range
- **`/case-studies/index.vue`** - Add filtering by:
  - Industry, services, client type, project size
- **Add search functionality** across all content types

#### Success Criteria:
- Users can find relevant content through filtering
- Search works across blog posts, case studies, and clients
- Content discovery supports prospect research phase (PX methodology)

---

## Component Development Strategy

### Development Order:
Each component follows this progression:
1. **Basic HTML structure** - Semantic markup only
2. **Props interface** - TypeScript definitions
3. **Core functionality** - Vue Composition API logic
4. **Test with real content** - Use actual blog posts/case studies
5. **Refine based on usage** - Add features as needed

### CSS Strategy:
- **Preserve existing CSS classes** where they exist (homepage has some styling)
- **Add NO new CSS** - components provide HTML structure only
- **Maintain existing class patterns** - `component-name | utility-classes | prose`

### Data Strategy:
- **Use existing Nuxt Content structure** - Work with current `queryCollection` patterns
- **Leverage rich metadata** - Blog posts have 15+ frontmatter fields
- **Support PX methodology** - Components guide prospects through positioning flow

---

## Implementation Details

### Week 1: ccmCard Component

**File:** `components/ccmCard.vue`

**Props Interface:**
```typescript
interface CardProps {
  title: string
  excerpt?: string
  metadata?: Array<{label: string, value: string}>
  badges?: string[]
  primaryAction?: {text: string, href: string, action?: string}
  secondaryActions?: Array<{text: string, href: string}>
}
```

**Usage in Blog Index:**
```vue
<ccmCard 
  v-for="post in blogPosts"
  :key="post._path"
  :title="post.title"
  :excerpt="post.excerpt"
  :metadata="[
    {label: 'Author', value: post.author},
    {label: 'Date', value: formatDate(post.date)}
  ]"
  :badges="post.tags"
  :primaryAction="{text: 'Read More', href: post._path}"
/>
```

**Usage in Case Study Index:**
```vue
<ccmCard 
  v-for="study in caseStudies"
  :key="study._path"
  :title="study.title"
  :excerpt="extractChallenge(study.content)"
  :metadata="[
    {label: 'Client', value: study.client},
    {label: 'Industry', value: study.industry}
  ]"
  :badges="study.services"
  :primaryAction="{text: 'View Results', href: study._path}"
/>
```

### Success Metrics:
- **Immediate impact** - Index pages show rich content instead of bare links
- **Reusability proven** - Same component works for different content types
- **Maintenance reduced** - Single component to update instead of multiple page templates
- **Foundation established** - Other components can build on ccmCard patterns

---

## Future Considerations (Post-Phase 4)

Once core functionality is stable:
- **Client portfolio pages** - Show all projects for specific clients
- **Service landing pages** - PX methodology positioning pages  
- **Advanced search** - Full-text search across all content
- **Analytics integration** - Track prospect engagement and flow progression
- **CRM integration** - Lead capture and qualification forms

This plan focuses on solving immediate problems with existing content while establishing patterns for future growth.