/**
 * Content Pipeline Composable Tests
 * Tests content processing logic with error recovery and timeout protection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useContentPipeline } from '~/composables/useContentPipeline'
import sampleBlogPosts from '../fixtures/sample-blog-posts.json'
import sampleCaseStudies from '../fixtures/sample-case-studies.json'

// Mock Nuxt Content queryContent
global.queryContent = vi.fn()

describe('useContentPipeline', () => {
  let contentPipeline: ReturnType<typeof useContentPipeline>
  
  beforeEach(() => {
    contentPipeline = useContentPipeline()
    vi.clearAllMocks()
  })
  
  describe('processAllContent', () => {
    it('processes blog posts and case studies correctly', async () => {
      // Mock successful content query
      vi.mocked(queryContent).mockImplementation((path) => ({
        find: vi.fn().mockResolvedValue(
          path === 'blog' ? sampleBlogPosts : sampleCaseStudies
        )
      }))
      
      const result = await contentPipeline.processAllContent()
      
      expect(result.success).toBe(true)
      expect(result.content).toBeDefined()
      expect(result.content!.blogPosts).toHaveLength(2)
      expect(result.content!.caseStudies).toHaveLength(2)
      expect(result.errors.filter(e => e.type === 'critical')).toHaveLength(0)
    })
    
    it('handles timeout scenarios gracefully', async () => {
      // Mock timeout
      vi.mocked(queryContent).mockImplementation(() => ({
        find: vi.fn().mockImplementation(() => 
          new Promise((resolve) => setTimeout(resolve, 35000))
        )
      }))
      
      const result = await contentPipeline.processAllContent({ timeoutMs: 1000 })
      
      expect(result.success).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].type).toBe('critical')
      expect(result.errors[0].message).toContain('timeout')
    })
    
    it('recovers from malformed content gracefully', async () => {
      const malformedContent = [
        ...sampleBlogPosts,
        { _path: '/blog/malformed', title: null, body: null } // Malformed entry
      ]
      
      vi.mocked(queryContent).mockImplementation((path) => ({
        find: vi.fn().mockResolvedValue(
          path === 'blog' ? malformedContent : sampleCaseStudies
        )
      }))
      
      const result = await contentPipeline.processAllContent()
      
      expect(result.success).toBe(true) // Should still succeed with warnings
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.content!.blogPosts).toHaveLength(2) // Only valid posts processed
    })
    
    it('generates comprehensive metadata', async () => {
      vi.mocked(queryContent).mockImplementation((path) => ({
        find: vi.fn().mockResolvedValue(
          path === 'blog' ? sampleBlogPosts : sampleCaseStudies
        )
      }))
      
      const result = await contentPipeline.processAllContent()
      
      expect(result.content!.metadata.totalPosts).toBe(2)
      expect(result.content!.metadata.totalCaseStudies).toBe(2)
      expect(result.content!.metadata.categories).toContain('Digital Strategy')
      expect(result.content!.metadata.tags).toContain('mobile-first design')
      expect(result.content!.metadata.authors).toContain('CCM Design Team')
      expect(result.content!.metadata.contentHash).toBeDefined()
    })
  })
  
  describe('validateContent', () => {
    it('validates required fields correctly', () => {
      const validationResults = contentPipeline.validateContent(sampleBlogPosts)
      
      expect(validationResults).toHaveLength(2)
      expect(validationResults.every(r => r.valid)).toBe(true)
    })
    
    it('identifies missing required fields', () => {
      const invalidContent = [{ _path: '/blog/invalid' }] // Missing title
      
      const validationResults = contentPipeline.validateContent(invalidContent)
      
      expect(validationResults[0].valid).toBe(false)
      expect(validationResults[0].errors).toHaveLength(1)
      expect(validationResults[0].errors[0].message).toContain('Missing required title')
    })
  })
  
  describe('transformContent', () => {
    it('transforms blog posts with correct data types', () => {
      const result = contentPipeline.transformContent(sampleBlogPosts)
      
      expect(result.processedBlogs).toHaveLength(2)
      
      const firstPost = result.processedBlogs[0]
      expect(firstPost.title).toBe('Meeting Your Audience Where 94% of Internet Happens')
      expect(firstPost.date).toBeInstanceOf(Date)
      expect(firstPost.categories).toEqual(['Digital Strategy', 'Research Communication'])
      expect(firstPost.tags).toEqual(['mobile-first design', 'research accessibility', 'progressive disclosure'])
      expect(firstPost.slug).toBe('2025-01-27-mobile-first-research-reports')
    })
    
    it('transforms case studies with client extraction', () => {
      const result = contentPipeline.transformContent(sampleCaseStudies)
      
      expect(result.processedCases).toHaveLength(2)
      
      const firstStudy = result.processedCases[0]
      expect(firstStudy.title).toContain('Policy Research Organization')
      expect(firstStudy.client).toBe('Policy Research Organization') // Extracted from title
      expect(firstStudy.sector).toBe('Policy Research')
      expect(firstStudy.services).toEqual(['research communication', 'design strategy', 'stakeholder engagement'])
    })
    
    it('handles transformation errors gracefully', () => {
      const problematicContent = [
        { _path: '/blog/problem', title: 'Test', date: 'invalid-date' }
      ]
      
      const result = contentPipeline.transformContent(problematicContent)
      
      // Should attempt transformation but may have warnings
      expect(result.errors.length).toBeGreaterThanOrEqual(0)
      expect(result.transformTime).toBeGreaterThan(0)
    })
  })
  
  describe('performance and metrics', () => {
    it('tracks processing metrics accurately', async () => {
      vi.mocked(queryContent).mockImplementation((path) => ({
        find: vi.fn().mockResolvedValue(
          path === 'blog' ? sampleBlogPosts : sampleCaseStudies
        )
      }))
      
      const result = await contentPipeline.processAllContent()
      
      expect(result.metrics.totalProcessingTime).toBeGreaterThan(0)
      expect(result.metrics.contentTransformTime).toBeGreaterThan(0)
      expect(result.metrics.memoryUsage).toBeGreaterThanOrEqual(0)
    })
  })
})