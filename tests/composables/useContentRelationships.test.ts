/**
 * Content Relationships Composable Tests
 * Tests relationship computation accuracy with sample content fixtures
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useContentRelationships } from '~/composables/useContentRelationships'
import type { ProcessedContent } from '~/types/pipeline'
import type { BlogPost, CaseStudy } from '~/types/content'

describe('useContentRelationships', () => {
  let relationshipService: ReturnType<typeof useContentRelationships>
  let mockContent: ProcessedContent
  
  beforeEach(() => {
    relationshipService = useContentRelationships()
    
    const mockBlogPosts: BlogPost[] = [
      {
        brow: 'Digital Strategy',
        title: 'Mobile-First Research Reports',
        tagline: 'Transform research impact',
        date: new Date('2025-01-27'),
        author: 'CCM Team',
        categories: ['Digital Strategy', 'Research Communication'],
        tags: ['mobile-first design', 'research accessibility'],
        seo_tags: ['mobile research'],
        excerpt: 'Mobile-first approach',
        content: 'Research accessibility is crucial for stakeholder engagement',
        slug: 'mobile-first-research-reports',
        relationships: []
      },
      {
        brow: 'Leadership',
        title: 'Executive Communication',
        tagline: 'Strategic frameworks',
        date: new Date('2025-08-27'),
        author: 'CCM Team',
        categories: ['Leadership', 'Research Communication'],
        tags: ['executive communication', 'stakeholder engagement'],
        seo_tags: ['executive buy-in'],
        excerpt: 'Executive stakeholder communication',
        content: 'Stakeholder engagement requires strategic communication frameworks',
        slug: 'executive-communication',
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
        services: ['research communication', 'design strategy'],
        content: 'Research accessibility through design thinking',
        slug: 'policy-research-federalism',
        featured_image: '/images/policy.jpg',
        gallery: [],
        relationships: []
      },
      {
        title: 'Harvard Tech: Innovation Leadership',
        client: 'Harvard Technology',
        challenge: 'Communicate tech research',
        solution: 'Strategic narrative framework',
        impact: 'Enhanced research visibility',
        sector: 'Higher Education',
        services: ['research accessibility', 'stakeholder engagement'],
        content: 'Technology research communication and stakeholder engagement',
        slug: 'harvard-tech-innovation',
        relationships: []
      }
    ]
    
    mockContent = {
      blogPosts: mockBlogPosts,
      caseStudies: mockCaseStudies,
      relationships: [],
      metadata: {
        totalPosts: 2,
        totalCaseStudies: 2,
        categories: ['Digital Strategy', 'Research Communication', 'Leadership'],
        tags: ['mobile-first design', 'research accessibility'],
        authors: ['CCM Team'],
        lastUpdated: new Date(),
        buildTimestamp: new Date(),
        buildVersion: '1.0.0',
        contentHash: 'test123'
      },
      processingTimestamp: new Date()
    }
  })
  
  describe('computeRelationships', () => {
    it('computes tag similarity relationships correctly', async () => {
      const result = await relationshipService.computeRelationships(mockContent, {
        algorithms: ['tag_similarity'],
        minStrength: 0.1,
        maxRelationsPerContent: 5
      })
      
      expect(result.success).toBe(true)
      expect(result.relationships.length).toBeGreaterThan(0)
      expect(result.algorithmMetrics).toHaveLength(1)
      expect(result.algorithmMetrics[0].algorithm).toBe('tag_similarity')
    })
    
    it('computes category matching relationships', async () => {
      const result = await relationshipService.computeRelationships(mockContent, {
        algorithms: ['category_match'],
        minStrength: 0.1,
        maxRelationsPerContent: 5
      })
      
      expect(result.success).toBe(true)
      
      // Should find relationships based on shared 'Research Communication' category
      const categoryRelationships = result.relationships.filter(
        rel => rel.relationship_type === 'same_category'
      )
      expect(categoryRelationships.length).toBeGreaterThan(0)
    })
    
    it('applies multiple algorithms simultaneously', async () => {
      const result = await relationshipService.computeRelationships(mockContent, {
        algorithms: ['tag_similarity', 'category_match', 'content_analysis'],
        minStrength: 0.05,
        maxRelationsPerContent: 10
      })
      
      expect(result.success).toBe(true)
      expect(result.algorithmMetrics).toHaveLength(3)
      
      // Should have different relationship types
      const relationshipTypes = new Set(result.relationships.map(r => r.relationship_type))
      expect(relationshipTypes.size).toBeGreaterThan(1)
    })
    
    it('handles timeout scenarios', async () => {
      const result = await relationshipService.computeRelationships(mockContent, {
        algorithms: ['tag_similarity'],
        minStrength: 0.1,
        maxRelationsPerContent: 5,
        timeoutMs: 1 // Very short timeout
      })
      
      // Should either succeed quickly or timeout gracefully
      expect(result.success).toBeDefined()
      if (!result.success) {
        expect(result.errors.some(e => e.type === 'timeout')).toBe(true)
      }
    })
    
    it('filters relationships by minimum strength', async () => {
      const highThreshold = await relationshipService.computeRelationships(mockContent, {
        algorithms: ['tag_similarity'],
        minStrength: 0.8, // Very high threshold
        maxRelationsPerContent: 5
      })
      
      const lowThreshold = await relationshipService.computeRelationships(mockContent, {
        algorithms: ['tag_similarity'],
        minStrength: 0.1, // Low threshold
        maxRelationsPerContent: 5
      })
      
      expect(lowThreshold.relationships.length).toBeGreaterThanOrEqual(highThreshold.relationships.length)
      expect(highThreshold.relationships.every(r => r.strength >= 0.8)).toBe(true)
    })
  })
  
  describe('scoreRelationship', () => {
    it('calculates tag similarity scores correctly', () => {
      const blog = mockContent.blogPosts[0]
      const caseStudy = mockContent.caseStudies[0]
      
      const score = relationshipService.scoreRelationship(blog, caseStudy, 'tag_similarity')
      
      expect(score.score).toBeGreaterThanOrEqual(0)
      expect(score.score).toBeLessThanOrEqual(1)
      expect(score.confidence).toBeGreaterThanOrEqual(0)
      expect(score.reason).toBeDefined()
    })
    
    it('calculates category match scores', () => {
      const blog1 = mockContent.blogPosts[0] // Digital Strategy, Research Communication
      const blog2 = mockContent.blogPosts[1] // Leadership, Research Communication
      
      const score = relationshipService.scoreRelationship(blog1, blog2, 'category_match')
      
      expect(score.score).toBeGreaterThan(0) // Should find shared 'Research Communication'
      expect(score.reason).toContain('Research Communication')
    })
    
    it('handles content with no shared elements', () => {
      const mockBlog: BlogPost = {
        ...mockContent.blogPosts[0],
        categories: ['Unique Category'],
        tags: ['unique-tag']
      }
      
      const score = relationshipService.scoreRelationship(
        mockBlog, 
        mockContent.blogPosts[1], 
        'tag_similarity'
      )
      
      expect(score.score).toBe(0)
      expect(score.reason).toContain('No shared')
    })
  })
  
  describe('filterRelationships', () => {
    it('filters by minimum strength correctly', () => {
      const mockRelationships = [
        {
          source_type: 'blog' as const,
          source_slug: 'test1',
          target_type: 'case_study' as const,
          target_slug: 'test2',
          relationship_type: 'shared_tags' as const,
          strength: 0.8,
          computed_reason: 'High similarity'
        },
        {
          source_type: 'blog' as const,
          source_slug: 'test2',
          target_type: 'case_study' as const,
          target_slug: 'test3',
          relationship_type: 'shared_tags' as const,
          strength: 0.3,
          computed_reason: 'Low similarity'
        }
      ]
      
      const filtered = relationshipService.filterRelationships(mockRelationships, [
        { type: 'min_strength', value: 0.5 }
      ])
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].strength).toBe(0.8)
    })
    
    it('sorts relationships by strength descending', () => {
      const mockRelationships = [
        {
          source_type: 'blog' as const,
          source_slug: 'test1',
          target_type: 'case_study' as const,
          target_slug: 'test2',
          relationship_type: 'shared_tags' as const,
          strength: 0.3,
          computed_reason: 'Low'
        },
        {
          source_type: 'blog' as const,
          source_slug: 'test2',
          target_type: 'case_study' as const,
          target_slug: 'test3',
          relationship_type: 'shared_tags' as const,
          strength: 0.8,
          computed_reason: 'High'
        }
      ]
      
      const filtered = relationshipService.filterRelationships(mockRelationships, [])
      
      expect(filtered[0].strength).toBeGreaterThan(filtered[1].strength)
      expect(filtered[0].strength).toBe(0.8)
    })
  })
  
  describe('algorithm accuracy', () => {
    it('identifies strong relationships correctly', async () => {
      // Create content with obvious relationships
      const strongContent: ProcessedContent = {
        ...mockContent,
        blogPosts: [{
          ...mockContent.blogPosts[0],
          tags: ['research accessibility', 'stakeholder engagement', 'design strategy']
        }],
        caseStudies: [{
          ...mockContent.caseStudies[0],
          services: ['research accessibility', 'design strategy', 'stakeholder engagement']
        }]
      }
      
      const result = await relationshipService.computeRelationships(strongContent, {
        algorithms: ['tag_similarity'],
        minStrength: 0.1,
        maxRelationsPerContent: 5
      })
      
      expect(result.success).toBe(true)
      expect(result.relationships.length).toBeGreaterThan(0)
      
      // Should find high-strength relationships
      const strongRelationships = result.relationships.filter(r => r.strength > 0.5)
      expect(strongRelationships.length).toBeGreaterThan(0)
    })
  })
})