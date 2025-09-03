/**
 * Static Routes Composable Tests
 * Tests route generation logic for static content
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useStaticRoutes } from '~/composables/useStaticRoutes'
import type { ProcessedContent } from '~/types/pipeline'
import type { BlogPost, CaseStudy } from '~/types/content'

describe('useStaticRoutes', () => {
  let routeService: ReturnType<typeof useStaticRoutes>
  let mockContent: ProcessedContent
  
  beforeEach(() => {
    routeService = useStaticRoutes()
    
    const mockBlogPosts: BlogPost[] = [
      {
        brow: 'Digital Strategy',
        title: 'Mobile-First Research Reports',
        tagline: 'Transform research impact',
        date: new Date('2025-01-27'),
        author: 'CCM Team',
        categories: ['Digital Strategy'],
        tags: ['mobile-first design'],
        seo_tags: ['mobile research'],
        excerpt: 'Mobile-first approach to research communication',
        content: '<p>Research accessibility content</p>',
        slug: 'mobile-first-research-reports',
        relationships: []
      },
      {
        brow: 'Leadership',
        title: 'Executive Communication Strategies',
        tagline: 'Strategic frameworks for leadership',
        date: new Date('2025-08-27'),
        author: 'CCM Strategy Team',
        categories: ['Leadership'],
        tags: ['executive communication'],
        seo_tags: ['executive buy-in'],
        excerpt: 'Strategic communication for executives',
        content: '<p>Executive communication content</p>',
        slug: 'executive-communication-strategies',
        relationships: []
      }
    ]
    
    const mockCaseStudies: CaseStudy[] = [
      {
        title: 'Policy Research: Federalism Analysis',
        client: 'Policy Research Organization',
        challenge: 'Make complex analysis accessible',
        solution: 'Visual storytelling approach',
        impact: 'Increased audience engagement',
        sector: 'Policy Research',
        services: ['research communication'],
        content: '<p>Policy research case study</p>',
        slug: 'policy-research-federalism',
        relationships: []
      }
    ]
    
    mockContent = {
      blogPosts: mockBlogPosts,
      caseStudies: mockCaseStudies,
      relationships: [
        {
          source_type: 'blog',
          source_slug: 'mobile-first-research-reports',
          target_type: 'case_study',
          target_slug: 'policy-research-federalism',
          relationship_type: 'shared_tags',
          strength: 0.7,
          computed_reason: 'Shared research communication focus'
        }
      ],
      metadata: {
        totalPosts: 2,
        totalCaseStudies: 1,
        categories: ['Digital Strategy', 'Leadership'],
        tags: ['mobile-first design', 'executive communication'],
        authors: ['CCM Team', 'CCM Strategy Team'],
        lastUpdated: new Date('2025-08-27'),
        buildTimestamp: new Date(),
        buildVersion: '1.0.0',
        contentHash: 'test123'
      },
      processingTimestamp: new Date()
    }
  })
  
  describe('generateContentRoutes', () => {
    it('generates blog post routes correctly', async () => {
      const result = await routeService.generateContentRoutes(mockContent)
      
      expect(result.success).toBe(true)
      expect(result.routes.length).toBeGreaterThanOrEqual(2) // At least 2 blog posts
      
      const blogRoutes = result.routes.filter(r => r.path.startsWith('/blog/'))
      expect(blogRoutes).toHaveLength(2)
      
      const firstBlogRoute = blogRoutes[0]
      expect(firstBlogRoute.path).toBe('/blog/mobile-first-research-reports')
      expect(firstBlogRoute.component).toBe('BlogPostDetail')
      expect(firstBlogRoute.props.post).toBeDefined()
      expect(firstBlogRoute.metadata.title).toBe('Mobile-First Research Reports')
      expect(firstBlogRoute.metadata.priority).toBe(0.8)
    })
    
    it('generates case study routes correctly', async () => {
      const result = await routeService.generateContentRoutes(mockContent)
      
      expect(result.success).toBe(true)
      
      const caseStudyRoutes = result.routes.filter(r => r.path.startsWith('/case-studies/'))
      expect(caseStudyRoutes).toHaveLength(1)
      
      const caseStudyRoute = caseStudyRoutes[0]
      expect(caseStudyRoute.path).toBe('/case-studies/policy-research-federalism')
      expect(caseStudyRoute.component).toBe('CaseStudyDetail')
      expect(caseStudyRoute.props.study).toBeDefined()
      expect(caseStudyRoute.metadata.title).toBe('Policy Research: Federalism Analysis')
      expect(caseStudyRoute.metadata.priority).toBe(0.9) // Case studies have higher priority
    })
    
    it('includes related content in route props', async () => {
      const result = await routeService.generateContentRoutes(mockContent)
      
      const blogRoute = result.routes.find(r => r.path === '/blog/mobile-first-research-reports')
      expect(blogRoute).toBeDefined()
      expect(blogRoute!.props.relationships).toBeDefined()
      expect(Array.isArray(blogRoute!.props.relationships)).toBe(true)
    })
    
    it('handles route generation errors gracefully', async () => {
      const problematicContent = {
        ...mockContent,
        blogPosts: [
          { ...mockContent.blogPosts[0], slug: '' } // Invalid slug
        ]
      }
      
      const result = await routeService.generateContentRoutes(problematicContent)
      
      // Should handle errors but continue processing
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0)
        expect(result.errors[0].type).toBe('generation_failure')
      }
    })
  })
  
  describe('generateIndexRoutes', () => {
    it('generates blog index route', () => {
      const indexRoutes = routeService.generateIndexRoutes(mockContent)
      
      const blogIndexRoute = indexRoutes.find(r => r.path === '/blog')
      expect(blogIndexRoute).toBeDefined()
      expect(blogIndexRoute!.component).toBe('BlogIndex')
      expect(blogIndexRoute!.props.posts).toHaveLength(2)
      expect(blogIndexRoute!.props.metadata).toBeDefined()
      expect(blogIndexRoute!.metadata.title).toBe('Blog')
      expect(blogIndexRoute!.metadata.priority).toBe(0.9)
    })
    
    it('generates case study index route', () => {
      const indexRoutes = routeService.generateIndexRoutes(mockContent)
      
      const caseStudyIndexRoute = indexRoutes.find(r => r.path === '/case-studies')
      expect(caseStudyIndexRoute).toBeDefined()
      expect(caseStudyIndexRoute!.component).toBe('CaseStudyIndex')
      expect(caseStudyIndexRoute!.props.studies).toHaveLength(1)
      expect(caseStudyIndexRoute!.props.metadata).toBeDefined()
      expect(caseStudyIndexRoute!.metadata.title).toBe('Case Studies')
    })
    
    it('uses correct metadata for index routes', () => {
      const indexRoutes = routeService.generateIndexRoutes(mockContent)
      
      const blogIndex = indexRoutes.find(r => r.path === '/blog')
      expect(blogIndex!.metadata.lastModified).toBe(mockContent.metadata.lastUpdated)
      
      const caseStudyIndex = indexRoutes.find(r => r.path === '/case-studies')
      expect(caseStudyIndex!.metadata.lastModified).toBe(mockContent.metadata.buildTimestamp)
    })
  })
  
  describe('generateSEORoutes', () => {
    it('generates SEO routes for all content', () => {
      const seoRoutes = routeService.generateSEORoutes(mockContent)
      
      // Should have routes for: 2 blog posts + 1 case study + 2 index pages = 5 routes
      expect(seoRoutes).toHaveLength(5)
      
      // All routes should have SEO properties
      seoRoutes.forEach(route => {
        expect(route.sitemap).toBe(true)
        expect(route.robots).toBe('index')
        expect(route.canonicalUrl).toContain('https://ccm-website.com')
      })
    })
    
    it('generates correct canonical URLs', () => {
      const seoRoutes = routeService.generateSEORoutes(mockContent)
      
      const blogRoute = seoRoutes.find(r => r.path === '/blog/mobile-first-research-reports')
      expect(blogRoute!.canonicalUrl).toBe('https://ccm-website.com/blog/mobile-first-research-reports')
      
      const caseStudyRoute = seoRoutes.find(r => r.path === '/case-studies/policy-research-federalism')
      expect(caseStudyRoute!.canonicalUrl).toBe('https://ccm-website.com/case-studies/policy-research-federalism')
      
      const blogIndexRoute = seoRoutes.find(r => r.path === '/blog')
      expect(blogIndexRoute!.canonicalUrl).toBe('https://ccm-website.com/blog')
    })
    
    it('sets appropriate priorities for SEO', () => {
      const seoRoutes = routeService.generateSEORoutes(mockContent)
      
      const blogRoutes = seoRoutes.filter(r => r.path.startsWith('/blog/'))
      blogRoutes.forEach(route => {
        expect(route.metadata.priority).toBe(0.8)
      })
      
      const caseStudyRoutes = seoRoutes.filter(r => r.path.startsWith('/case-studies/'))
      caseStudyRoutes.forEach(route => {
        expect(route.metadata.priority).toBe(0.9)
      })
      
      const indexRoutes = seoRoutes.filter(r => !r.path.includes('/') || r.path.match(/^\/[^\/]+$/))
      indexRoutes.forEach(route => {
        expect(route.metadata.priority).toBe(0.9)
      })
    })
    
    it('includes proper metadata for search engines', () => {
      const seoRoutes = routeService.generateSEORoutes(mockContent)
      
      const blogRoute = seoRoutes.find(r => r.path === '/blog/mobile-first-research-reports')
      expect(blogRoute!.metadata.title).toBe('Mobile-First Research Reports')
      expect(blogRoute!.metadata.description).toBe('Mobile-first approach to research communication')
      expect(blogRoute!.metadata.lastModified).toBeInstanceOf(Date)
      
      const blogIndexRoute = seoRoutes.find(r => r.path === '/blog')
      expect(blogIndexRoute!.metadata.title).toBe('Blog - Research Communication Insights')
      expect(blogIndexRoute!.metadata.description).toContain('research communication')
    })
  })
  
  describe('error handling and validation', () => {
    it('handles empty content gracefully', async () => {
      const emptyContent: ProcessedContent = {
        blogPosts: [],
        caseStudies: [],
        relationships: [],
        metadata: mockContent.metadata,
        processingTimestamp: new Date()
      }
      
      const result = await routeService.generateContentRoutes(emptyContent)
      
      expect(result.success).toBe(true)
      expect(result.routes).toHaveLength(0)
      expect(result.errors).toHaveLength(0)
    })
    
    it('validates route structure', async () => {
      const result = await routeService.generateContentRoutes(mockContent)
      
      result.routes.forEach(route => {
        expect(route.path).toBeDefined()
        expect(route.component).toBeDefined()
        expect(route.props).toBeDefined()
        expect(route.metadata).toBeDefined()
        expect(route.metadata.title).toBeDefined()
        expect(route.metadata.priority).toBeGreaterThan(0)
        expect(route.metadata.priority).toBeLessThanOrEqual(1)
      })
    })
  })
})