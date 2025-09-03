/**
 * ccmContentMeta Component Tests
 * Tests metadata display with semantic HTML structure
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ccmContentMeta from '~/components/ccmContentMeta.vue'
import type { BlogPost, CaseStudy } from '~/types/content'

// Mock ccmBaseSection component
const ccmBaseSection = {
  template: '<div class="base-section"><slot /></div>'
}

const globalComponents = {
  ccmBaseSection
}

describe('ccmContentMeta', () => {
  let mockBlogPost: BlogPost
  let mockCaseStudy: CaseStudy

  beforeEach(() => {
    mockBlogPost = {
      brow: 'Digital Strategy',
      title: 'Mobile-First Research Reports',
      tagline: 'Transform research impact through progressive disclosure methodology',
      date: new Date('2025-01-27'),
      author: 'CCM Design Team',
      categories: ['Digital Strategy', 'Research Communication'],
      tags: ['mobile-first design', 'research accessibility'],
      seo_tags: ['mobile research reports'],
      excerpt: 'Mobile-first approach to research communication',
      content: '<p>Research accessibility content</p>',
      slug: 'mobile-first-research-reports',
      relationships: []
    }

    mockCaseStudy = {
      title: 'Policy Research: Federalism Analysis',
      client: 'Policy Research Organization',
      challenge: 'Make complex analysis accessible',
      solution: 'Visual storytelling approach',
      impact: 'Increased audience engagement',
      sector: 'Policy Research',
      services: ['research communication', 'design strategy'],
      content: '<p>Policy research case study</p>',
      slug: 'policy-research-federalism',
      relationships: []
    }
  })

  describe('Blog Post Rendering', () => {
    it('renders blog post metadata correctly', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="brow"]').text()).toBe('Digital Strategy')
      expect(wrapper.find('[data-testid="title"]').text()).toBe('Mobile-First Research Reports')
      expect(wrapper.find('[data-testid="tagline"]').text()).toBe('Transform research impact through progressive disclosure methodology')
      expect(wrapper.find('[data-testid="author"]').text()).toBe('by CCM Design Team')
      expect(wrapper.find('[data-testid="content-type"]').text()).toBe('Blog Post')
    })

    it('formats blog post date correctly', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost, dateFormat: 'short' },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="date"]').text()).toBe('Jan 27, 2025')
    })

    it('shows categories for blog posts', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost, showCategories: true },
        global: { components: globalComponents }
      })

      const categories = wrapper.find('[data-testid="categories"]')
      expect(categories.exists()).toBe(true)
      expect(categories.text()).toContain('Digital Strategy')
      expect(categories.text()).toContain('Research Communication')
    })

    it('renders compact mode for blog posts', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost, compact: true },
        global: { components: globalComponents }
      })

      // Compact mode should use h2 instead of h1
      expect(wrapper.find('h1').exists()).toBe(false)
      expect(wrapper.find('h2').exists()).toBe(true)
      
      // Tagline should not show in compact mode
      expect(wrapper.find('[data-testid="tagline"]').exists()).toBe(false)
    })
  })

  describe('Case Study Rendering', () => {
    it('renders case study metadata correctly', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockCaseStudy },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="brow"]').text()).toBe('Policy Research')
      expect(wrapper.find('[data-testid="title"]').text()).toBe('Policy Research: Federalism Analysis')
      expect(wrapper.find('[data-testid="tagline"]').text()).toBe('Make complex analysis accessible')
      expect(wrapper.find('[data-testid="author"]').text()).toBe('by Policy Research Organization')
      expect(wrapper.find('[data-testid="content-type"]').text()).toBe('Case Study')
    })

    it('shows sector as category for case studies', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockCaseStudy, showCategories: true },
        global: { components: globalComponents }
      })

      const categories = wrapper.find('[data-testid="categories"]')
      expect(categories.exists()).toBe(true)
      expect(categories.text()).toContain('Policy Research')
    })
  })

  describe('Date Formatting', () => {
    it('formats dates with long format', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost, dateFormat: 'long' },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="date"]').text()).toContain('Monday, January 27, 2025')
    })

    it('formats dates with relative format for recent dates', () => {
      const recentPost = {
        ...mockBlogPost,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      }

      const wrapper = mount(ccmContentMeta, {
        props: { content: recentPost, dateFormat: 'relative' },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="date"]').text()).toBe('1 day ago')
    })

    it('includes datetime attribute for accessibility', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      const timeElement = wrapper.find('[data-testid="date"]')
      expect(timeElement.attributes('datetime')).toBe('2025-01-27')
    })
  })

  describe('Props and Options', () => {
    it('hides author when showAuthor is false', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost, showAuthor: false },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="author"]').exists()).toBe(false)
    })

    it('hides categories when showCategories is false', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost, showCategories: false },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="categories"]').exists()).toBe(false)
    })

    it('applies custom CSS class', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost, class: 'custom-meta' },
        global: { components: globalComponents }
      })

      expect(wrapper.classes()).toContain('custom-meta')
    })
  })

  describe('Semantic HTML', () => {
    it('uses proper heading hierarchy', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      // Default should use h1 for title
      expect(wrapper.find('h1').exists()).toBe(true)
      expect(wrapper.find('h1').text()).toBe(mockBlogPost.title)
    })

    it('uses time element for dates', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      const timeElement = wrapper.find('time')
      expect(timeElement.exists()).toBe(true)
      expect(timeElement.attributes('datetime')).toBeTruthy()
    })

    it('uses header element for metadata grouping', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      expect(wrapper.find('header.content-meta__header').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('includes proper data-testid attributes', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="brow"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="title"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="tagline"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="author"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="date"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="content-type"]').exists()).toBe(true)
    })

    it('provides meaningful text content for screen readers', () => {
      const wrapper = mount(ccmContentMeta, {
        props: { content: mockBlogPost },
        global: { components: globalComponents }
      })

      // Author should include "by" prefix
      expect(wrapper.find('[data-testid="author"]').text()).toContain('by')
      
      // Content type should be clear
      expect(wrapper.find('[data-testid="content-type"]').text()).toBe('Blog Post')
    })
  })

  describe('Error Handling', () => {
    it('handles missing optional fields gracefully', () => {
      const minimalPost = {
        ...mockBlogPost,
        brow: '',
        tagline: '',
        categories: []
      }

      const wrapper = mount(ccmContentMeta, {
        props: { content: minimalPost },
        global: { components: globalComponents }
      })

      // Should still render title and basic metadata
      expect(wrapper.find('[data-testid="title"]').text()).toBe(minimalPost.title)
      expect(wrapper.find('[data-testid="author"]').text()).toBe('by CCM Design Team')
      
      // Optional fields should not appear
      expect(wrapper.find('[data-testid="brow"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="tagline"]').exists()).toBe(false)
    })

    it('handles invalid date gracefully', () => {
      const postWithBadDate = {
        ...mockBlogPost,
        date: 'invalid-date' as any
      }

      const wrapper = mount(ccmContentMeta, {
        props: { content: postWithBadDate },
        global: { components: globalComponents }
      })

      // Should still render without crashing
      expect(wrapper.find('[data-testid="date"]').exists()).toBe(true)
    })
  })
})