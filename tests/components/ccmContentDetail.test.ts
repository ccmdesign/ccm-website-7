/**
 * ccmContentDetail Component Tests
 * Tests full content presentation with all features
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ccmContentDetail from '~/components/ccmContentDetail.vue'
import type { BlogPost, CaseStudy, ContentRelationship } from '~/types/content'

// Mock components
const ccmBaseSection = {
  template: '<div class="base-section"><slot /></div>'
}

const ccmContentMeta = {
  template: '<div class="mock-content-meta">{{ content.title }}</div>',
  props: ['content', 'showAuthor', 'showCategories', 'dateFormat']
}

const globalComponents = {
  ccmBaseSection,
  ccmContentMeta
}

// Mock window methods
const mockWindow = {
  open: vi.fn(),
  location: {
    href: 'http://localhost:3000/test-content',
    assign: vi.fn()
  }
}

// @ts-ignore
global.window = mockWindow

describe('ccmContentDetail', () => {
  let mockBlogPost: BlogPost
  let mockCaseStudy: CaseStudy
  let mockRelationships: ContentRelationship[]

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockBlogPost = {
      brow: 'Digital Strategy',
      title: 'Mobile-First Research Reports',
      tagline: 'Transform research impact through progressive disclosure methodology',
      date: new Date('2025-01-27'),
      author: 'CCM Design Team',
      categories: ['Digital Strategy', 'Research Communication'],
      tags: ['mobile-first design', 'research accessibility'],
      seo_tags: ['mobile research'],
      excerpt: 'Mobile-first approach to research communication',
      content: '<h2>Introduction</h2><p>This is the main content with <strong>HTML formatting</strong>.</p><h3>Key Benefits</h3><p>Multiple sections for comprehensive coverage.</p>',
      slug: 'mobile-first-research-reports',
      relationships: []
    }

    mockCaseStudy = {
      title: 'Policy Research: Federalism Analysis',
      client: 'Policy Research Organization',
      challenge: 'Make complex analysis accessible to broader audiences',
      solution: 'Visual storytelling approach with progressive disclosure',
      impact: 'Increased audience engagement by 150% and citation rates by 200%',
      sector: 'Policy Research',
      services: ['research communication', 'design strategy', 'visual storytelling'],
      content: '<h2>Project Overview</h2><p>Detailed project content with implementation details.</p>',
      slug: 'policy-research-federalism',
      relationships: []
    }

    mockRelationships = [
      {
        source_type: 'blog',
        source_slug: 'mobile-first-research-reports',
        target_type: 'case_study',
        target_slug: 'policy-research-federalism',
        relationship_type: 'shared_tags',
        strength: 0.85,
        computed_reason: 'Shared focus on research communication and accessibility'
      },
      {
        source_type: 'blog',
        source_slug: 'mobile-first-research-reports',
        target_type: 'blog',
        target_slug: 'design-systems-research',
        relationship_type: 'similar_content',
        strength: 0.72,
        computed_reason: 'Both discuss design methodologies for research presentation'
      }
    ]
  })

  describe('Blog Post Rendering', () => {
    it('renders blog post detail correctly', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="detail-meta"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="main-content"]').exists()).toBe(true)
      expect(wrapper.find('.prose-content').exists()).toBe(true)
      expect(wrapper.find('.prose-content').html()).toContain(mockBlogPost.content)
    })

    it('displays table of contents when enabled', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showToc: true
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="table-of-contents"]').exists()).toBe(true)
      expect(wrapper.find('.toc__heading').text()).toBe('Table of Contents')
      
      // Should extract headings from content
      const tocLinks = wrapper.findAll('.toc__link')
      expect(tocLinks.length).toBeGreaterThan(0)
    })

    it('calculates reading time correctly', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showReadingTime: true
        },
        global: { components: globalComponents }
      })

      const readingTime = wrapper.find('.reading-time__value')
      expect(readingTime.exists()).toBe(true)
      expect(readingTime.text()).toMatch(/\d+ min read/)
    })
  })

  describe('Case Study Rendering', () => {
    it('renders case study sections correctly', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { content: mockCaseStudy },
        global: { components: globalComponents }
      })

      expect(wrapper.find('#challenge').exists()).toBe(true)
      expect(wrapper.find('#solution').exists()).toBe(true)
      expect(wrapper.find('#impact').exists()).toBe(true)
      expect(wrapper.find('#services').exists()).toBe(true)

      expect(wrapper.find('#challenge p').text()).toBe(mockCaseStudy.challenge)
      expect(wrapper.find('#solution p').text()).toBe(mockCaseStudy.solution)
      expect(wrapper.find('#impact p').text()).toBe(mockCaseStudy.impact)
    })

    it('displays services list correctly', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { content: mockCaseStudy },
        global: { components: globalComponents }
      })

      const serviceItems = wrapper.findAll('.service-item')
      expect(serviceItems).toHaveLength(mockCaseStudy.services.length)
      
      mockCaseStudy.services.forEach((service, index) => {
        expect(serviceItems[index].text()).toBe(service)
      })
    })

    it('renders project details when content is available', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { content: mockCaseStudy },
        global: { components: globalComponents }
      })

      expect(wrapper.find('#details').exists()).toBe(true)
      expect(wrapper.find('#details .prose-content').html()).toContain(mockCaseStudy.content)
    })
  })

  describe('Social Sharing', () => {
    it('shows sharing buttons when enabled', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          enableSharing: true
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="social-sharing"]').exists()).toBe(true)
      expect(wrapper.find('.share-btn--twitter').exists()).toBe(true)
      expect(wrapper.find('.share-btn--linkedin').exists()).toBe(true)
      expect(wrapper.find('.share-btn--email').exists()).toBe(true)
    })

    it('hides sharing buttons when disabled', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          enableSharing: false
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="social-sharing"]').exists()).toBe(false)
    })

    it('emits share event and opens correct URLs', async () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          enableSharing: true
        },
        global: { components: globalComponents }
      })

      // Test Twitter sharing
      await wrapper.find('.share-btn--twitter').trigger('click')
      expect(wrapper.emitted('content-share')).toBeTruthy()
      expect(wrapper.emitted('content-share')![0]).toEqual([mockBlogPost, 'twitter'])
      expect(mockWindow.open).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet')
      )

      // Test LinkedIn sharing
      await wrapper.find('.share-btn--linkedin').trigger('click')
      expect(mockWindow.open).toHaveBeenCalledWith(
        expect.stringContaining('linkedin.com/sharing')
      )

      // Test Email sharing
      await wrapper.find('.share-btn--email').trigger('click')
      expect(mockWindow.location.href).toContain('mailto:')
    })
  })

  describe('Related Content', () => {
    it('shows related content when relationships exist', () => {
      const contentWithRelationships = {
        ...mockBlogPost,
        relationships: mockRelationships
      }

      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: contentWithRelationships,
          relationships: mockRelationships
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="related-content"]').exists()).toBe(true)
      expect(wrapper.find('.related__heading').text()).toBe('Related Content')
      
      const relatedItems = wrapper.findAll('.related-item')
      expect(relatedItems).toHaveLength(2)
    })

    it('displays relationship information correctly', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          relationships: mockRelationships
        },
        global: { components: globalComponents }
      })

      const firstRelated = wrapper.find('.related-item')
      expect(firstRelated.find('.related-item__type').text()).toBe('Case Study')
      expect(firstRelated.find('.related-item__reason').text()).toBe(mockRelationships[0].computed_reason)
      expect(firstRelated.find('.related-item__strength').text()).toBe('Relevance: 85%')
    })

    it('shows expand button when more than max relationships', () => {
      const manyRelationships = [
        ...mockRelationships,
        { ...mockRelationships[0], target_slug: 'extra-1', strength: 0.6 },
        { ...mockRelationships[0], target_slug: 'extra-2', strength: 0.5 },
        { ...mockRelationships[0], target_slug: 'extra-3', strength: 0.4 }
      ]

      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          relationships: manyRelationships
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('.show-more-btn').exists()).toBe(true)
      expect(wrapper.find('.show-more-btn').text()).toContain('Show All 5 Related Items')
    })

    it('emits relationship click events', async () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          relationships: mockRelationships
        },
        global: { components: globalComponents }
      })

      await wrapper.find('.related-item').trigger('click')
      expect(wrapper.emitted('relationship-click')).toBeTruthy()
      expect(wrapper.emitted('relationship-click')![0][0]).toEqual(mockRelationships[0])
    })
  })

  describe('Table of Contents', () => {
    it('extracts headings from content correctly', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showToc: true
        },
        global: { components: globalComponents }
      })

      const tocItems = wrapper.findAll('.toc__item')
      expect(tocItems.length).toBe(2) // h2 and h3 from mock content
      
      expect(tocItems[0].find('.toc__link').text()).toBe('Introduction')
      expect(tocItems[1].find('.toc__link').text()).toBe('Key Benefits')
    })

    it('hides TOC when showToc is false', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showToc: false
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="table-of-contents"]').exists()).toBe(false)
    })

    it('hides TOC when no content available', () => {
      const contentWithoutHTML = { ...mockBlogPost, content: '' }
      
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: contentWithoutHTML,
          showToc: true
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="table-of-contents"]').exists()).toBe(false)
    })
  })

  describe('Navigation', () => {
    it('shows navigation when enabled', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showNavigation: true
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="content-navigation"]').exists()).toBe(true)
      expect(wrapper.find('.nav-buttons').exists()).toBe(true)
    })

    it('hides navigation when disabled', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showNavigation: false
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="content-navigation"]').exists()).toBe(false)
    })
  })

  describe('Sidebar Features', () => {
    it('shows reading time when enabled', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showReadingTime: true
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('.reading-time').exists()).toBe(true)
      expect(wrapper.find('.reading-time__label').text()).toBe('Reading time:')
      expect(wrapper.find('.reading-time__value').text()).toMatch(/\d+ min read/)
    })

    it('hides sidebar when no sidebar features enabled', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showReadingTime: false,
          enableSharing: false
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="content-sidebar"]').exists()).toBe(false)
    })
  })

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      // Main content should be in article element
      expect(wrapper.find('article.content-detail').exists()).toBe(true)
      
      // Should use proper header structure
      expect(wrapper.find('header.content-detail__header').exists()).toBe(true)
      
      // Navigation should use nav element
      const wrapper2 = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showToc: true,
          showNavigation: true
        },
        global: { components: globalComponents }
      })
      
      expect(wrapper2.findAll('nav')).toHaveLength(2) // TOC nav + content nav
    })

    it('provides proper ARIA labels for share buttons', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          enableSharing: true
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('.share-btn--twitter').attributes('aria-label')).toBe('Share on Twitter')
      expect(wrapper.find('.share-btn--linkedin').attributes('aria-label')).toBe('Share on LinkedIn')
      expect(wrapper.find('.share-btn--email').attributes('aria-label')).toBe('Share via Email')
    })

    it('includes proper data-testid attributes', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { 
          content: mockBlogPost,
          showToc: true,
          enableSharing: true,
          showNavigation: true,
          relationships: mockRelationships
        },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="detail-meta"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="table-of-contents"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="main-content"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="content-sidebar"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="social-sharing"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="related-content"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="content-navigation"]').exists()).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('handles missing content gracefully', () => {
      const minimalContent = {
        ...mockBlogPost,
        content: ''
      }

      const wrapper = mount(ccmContentDetail, {
        props: { content: minimalContent },
        global: { components: globalComponents }
      })

      // Should still render without crashing
      expect(wrapper.find('article.content-detail').exists()).toBe(true)
      expect(wrapper.find('[data-testid="main-content"]').exists()).toBe(true)
    })

    it('handles case study without services', () => {
      const caseStudyNoServices = {
        ...mockCaseStudy,
        services: []
      }

      const wrapper = mount(ccmContentDetail, {
        props: { content: caseStudyNoServices },
        global: { components: globalComponents }
      })

      expect(wrapper.find('#services').exists()).toBe(false)
      expect(wrapper.find('#challenge').exists()).toBe(true)
      expect(wrapper.find('#solution').exists()).toBe(true)
      expect(wrapper.find('#impact').exists()).toBe(true)
    })
  })

  describe('Content Type Detection', () => {
    it('correctly identifies blog post content type', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      expect(wrapper.find('.prose-content').exists()).toBe(true)
      expect(wrapper.find('.case-study-content').exists()).toBe(false)
    })

    it('correctly identifies case study content type', () => {
      const wrapper = mount(ccmContentDetail, {
        props: { content: mockCaseStudy },
        global: { components: globalComponents }
      })

      expect(wrapper.find('.case-study-content').exists()).toBe(true)
      expect(wrapper.find('.prose-content').exists()).toBe(false)
    })
  })
})