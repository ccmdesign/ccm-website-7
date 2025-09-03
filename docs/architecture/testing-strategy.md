# Testing Strategy

## Testing Pyramid
```
E2E Tests (Playwright)
/              \
Integration Tests (Component + Content)
/                              \
Unit Tests (Components)    Unit Tests (Composables)
```

## Test Organization

**Frontend Tests:**
```
tests/
├── components/
│   ├── ccmContentMeta.test.ts      # Metadata display testing
│   ├── ccmContentList.test.ts      # Content listing with relationships
│   ├── ccmRelatedPosts.test.ts     # Related content algorithms
│   └── ccmMasterGrid.test.ts       # Layout system integration
├── composables/
│   ├── useContentPipeline.test.ts  # Content processing logic
│   ├── useContentRelationships.test.ts # Relationship computation
│   └── useStaticRoutes.test.ts     # Route generation logic
└── fixtures/
    ├── sample-blog-posts.json      # Test content data
    └── sample-case-studies.json    # Test portfolio data
```

**Backend Tests:**
```
tests/
├── build-process/
│   ├── content-parsing.test.ts     # Markdown processing validation
│   ├── relationship-engine.test.ts # Content relationship accuracy
│   └── static-generation.test.ts   # Build output verification
├── content-validation/
│   ├── frontmatter-schema.test.ts  # Metadata validation rules
│   └── markdown-processing.test.ts # Content transformation testing
└── performance/
    ├── build-time.test.ts          # Build performance benchmarks
    └── relationship-algorithms.test.ts # Algorithm efficiency testing
```

**E2E Tests:**
```
tests/e2e/
├── content-discovery.spec.ts       # User content navigation flows
├── related-content.spec.ts         # Cross-content relationship testing
├── seo-validation.spec.ts          # SEO metadata and structure
└── performance.spec.ts             # Core Web Vitals and loading times
```

## Test Examples

**Frontend Component Test:**
```typescript
// tests/components/ccmContentMeta.test.ts
import { mount } from '@vue/test-utils'
import ccmContentMeta from '~/components/ccmContentMeta.vue'
import type { BlogPost } from '~/types/content'

describe('ccmContentMeta', () => {
  const mockBlogPost: BlogPost = {
    brow: 'Research Communication',
    title: 'Test Blog Post',
    tagline: 'Sample tagline for testing',
    date: new Date('2025-01-01'),
    author: 'Test Author',
    categories: ['Digital Transformation'],
    tags: ['research', 'communication'],
    seo_tags: ['test-seo'],
    excerpt: 'Test excerpt',
    content: '<p>Test content</p>',
    slug: 'test-blog-post',
    relationships: []
  }

  it('renders blog post metadata correctly', () => {
    const wrapper = mount(ccmContentMeta, {
      props: { content: mockBlogPost }
    })
    
    expect(wrapper.find('[data-testid="brow"]').text()).toBe('Research Communication')
    expect(wrapper.find('[data-testid="title"]').text()).toBe('Test Blog Post')
    expect(wrapper.find('[data-testid="author"]').text()).toBe('Test Author')
  })
  
  it('formats date correctly', () => {
    const wrapper = mount(ccmContentMeta, {
      props: { content: mockBlogPost }
    })
    
    expect(wrapper.find('[data-testid="date"]').text()).toContain('Jan 1, 2025')
  })
})
```

**Backend API Test:**
```typescript
// tests/composables/useContentPipeline.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useContentPipeline } from '~/composables/useContentPipeline'

describe('useContentPipeline', () => {
  it('processes blog posts correctly', async () => {
    const { processContent } = useContentPipeline()
    
    // Mock Nuxt Content query
    vi.mock('@nuxt/content', () => ({
      queryContent: vi.fn().mockReturnValue({
        find: vi.fn().mockResolvedValue([
          {
            title: 'Test Post',
            date: '2025-01-01',
            tags: ['test'],
            body: { html: '<p>Test content</p>' }
          }
        ])
      })
    }))
    
    const result = await processContent()
    
    expect(result.blogPosts).toHaveLength(1)
    expect(result.blogPosts[0].title).toBe('Test Post')
    expect(result.blogPosts[0].date).toBeInstanceOf(Date)
  })
  
  it('computes relationships correctly', async () => {
    // Test relationship computation logic
    const { processContent } = useContentPipeline()
    const result = await processContent()
    
    expect(result.relationships).toBeDefined()
    expect(result.relationships.length).toBeGreaterThanOrEqual(0)
  })
})
```

**E2E Test:**
```typescript
// tests/e2e/content-discovery.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Content Discovery Flow', () => {
  test('user can navigate from blog post to related case study', async ({ page }) => {
    await page.goto('/blog/stanford-research-center-400-percent-engagement')
    
    // Verify blog post loads
    await expect(page.locator('[data-testid="blog-title"]')).toBeVisible()
    
    // Find and click related case study
    const relatedContent = page.locator('[data-testid="related-content"]')
    await expect(relatedContent).toBeVisible()
    
    const relatedCaseStudy = relatedContent.locator('a').first()
    await relatedCaseStudy.click()
    
    // Verify case study loads
    await expect(page.locator('[data-testid="case-study-title"]')).toBeVisible()
    
    // Verify back-relationship exists
    const backRelated = page.locator('[data-testid="related-content"]')
    await expect(backRelated).toBeVisible()
  })
  
  test('content index pages load all content', async ({ page }) => {
    await page.goto('/blog')
    
    // Verify blog index loads
    await expect(page.locator('[data-testid="blog-list"]')).toBeVisible()
    
    // Count blog posts
    const blogPosts = page.locator('[data-testid="blog-item"]')
    await expect(blogPosts).toHaveCount.greaterThan(0)
    
    // Test case study index
    await page.goto('/case-studies')
    await expect(page.locator('[data-testid="case-study-list"]')).toBeVisible()
  })
})
```
