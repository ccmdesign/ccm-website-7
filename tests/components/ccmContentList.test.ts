/**
 * ccmContentList Component Tests
 * Tests content listing with relationships and filtering
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ccmContentList from '~/components/ccmContentList.vue'
import type { BlogPost, CaseStudy } from '~/types/content'
import type { ContentItem } from '~/types/components'

// Mock components
const ccmBaseSection = {
  template: '<div class="base-section"><slot /></div>'
}

const ccmContentMeta = {
  template: '<div class="mock-meta">{{ content.title }}</div>',
  props: ['content', 'compact', 'showAuthor', 'showCategories', 'dateFormat']
}

const globalComponents = {
  ccmBaseSection,
  ccmContentMeta
}

describe('ccmContentList', () => {
  let mockBlogPosts: BlogPost[]
  let mockCaseStudies: CaseStudy[]
  let mixedContent: ContentItem[]

  beforeEach(() => {
    mockBlogPosts = [
      {
        brow: 'Digital Strategy',
        title: 'Mobile-First Research Reports',
        tagline: 'Transform research impact',
        date: new Date('2025-01-27'),
        author: 'CCM Design Team',
        categories: ['Digital Strategy', 'Research Communication'],
        tags: ['mobile-first design', 'research accessibility'],
        seo_tags: ['mobile research'],
        excerpt: 'Mobile-first approach to research communication',
        content: '<p>Research accessibility content</p>',
        slug: 'mobile-first-research-reports',
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
        ]
      },
      {
        brow: 'Leadership',
        title: 'Executive Communication Strategies',
        tagline: 'Strategic frameworks for leadership',
        date: new Date('2025-08-27'),
        author: 'CCM Strategy Team',
        categories: ['Leadership', 'Communication'],
        tags: ['executive communication', 'strategy'],
        seo_tags: ['executive leadership'],
        excerpt: 'Strategic communication for executives',
        content: '<p>Executive communication content</p>',
        slug: 'executive-communication-strategies',
        relationships: []
      }
    ]

    mockCaseStudies = [
      {
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
    ]

    mixedContent = [...mockBlogPosts, ...mockCaseStudies]
  })

  describe('Basic Rendering', () => {
    it('renders content items correctly', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent },
        global: { components: globalComponents }
      })

      const items = wrapper.findAll('[data-testid="content-item"]')
      expect(items).toHaveLength(3)
    })

    it('renders list heading when provided', () => {
      const wrapper = mount(ccmContentList, {
        props: { 
          items: mixedContent, 
          heading: 'Latest Content',
          headingLevel: 2
        },
        global: { components: globalComponents }
      })

      const heading = wrapper.find('[data-testid="list-heading"]')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBe('Latest Content')
      expect(heading.element.tagName).toBe('H2')
    })

    it('displays correct item count', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, heading: 'Content' },
        global: { components: globalComponents }
      })

      const count = wrapper.find('[data-testid="item-count"]')
      expect(count.text()).toBe('3 items')
    })

    it('displays correct item count labels for different content types', () => {
      const blogOnlyWrapper = mount(ccmContentList, {
        props: { items: mockBlogPosts, heading: 'Content' },
        global: { components: globalComponents }
      })

      const blogCount = blogOnlyWrapper.find('[data-testid="item-count"]')
      expect(blogCount.text()).toBe('2 posts')

      const caseStudyOnlyWrapper = mount(ccmContentList, {
        props: { items: mockCaseStudies, heading: 'Content' },
        global: { components: globalComponents }
      })

      const caseCount = caseStudyOnlyWrapper.find('[data-testid="item-count"]')
      expect(caseCount.text()).toBe('1 case study')
    })
  })

  describe('Display Variants', () => {
    it('applies correct CSS classes for default variant', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, variant: 'default' },
        global: { components: globalComponents }
      })

      expect(wrapper.find('.content-list__items--default').exists()).toBe(true)
      expect(wrapper.find('.content-item--default').exists()).toBe(true)
    })

    it('applies correct CSS classes for compact variant', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, variant: 'compact' },
        global: { components: globalComponents }
      })

      expect(wrapper.find('.content-list__items--compact').exists()).toBe(true)
      expect(wrapper.find('.content-item--compact').exists()).toBe(true)
    })

    it('applies correct CSS classes for grid variant', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, variant: 'grid' },
        global: { components: globalComponents }
      })

      expect(wrapper.find('.content-list__items--grid').exists()).toBe(true)
      expect(wrapper.find('.content-item--grid').exists()).toBe(true)
    })
  })

  describe('Filtering', () => {
    it('shows filter controls when filterable is true', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, filterable: true },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="filter-controls"]').exists()).toBe(true)
      expect(wrapper.find('#type-filter').exists()).toBe(true)
      expect(wrapper.find('#category-filter').exists()).toBe(true)
    })

    it('hides filter controls when filterable is false', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, filterable: false },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="filter-controls"]').exists()).toBe(false)
    })

    it('filters by content type correctly', async () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, filterable: true },
        global: { components: globalComponents }
      })

      const typeFilter = wrapper.find('#type-filter')
      await typeFilter.setValue('blog')

      // Should show only blog posts
      const items = wrapper.findAll('[data-testid="content-item"]')
      expect(items).toHaveLength(2)
    })

    it('filters by category correctly', async () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, filterable: true },
        global: { components: globalComponents }
      })

      const categoryFilter = wrapper.find('#category-filter')
      await categoryFilter.setValue('Digital Strategy')

      // Should show only items with Digital Strategy category
      const items = wrapper.findAll('[data-testid="content-item"]')
      expect(items).toHaveLength(1)
    })

    it('emits filter-change event when filters are applied', async () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, filterable: true },
        global: { components: globalComponents }
      })

      const typeFilter = wrapper.find('#type-filter')
      await typeFilter.setValue('blog')

      expect(wrapper.emitted('filter-change')).toBeTruthy()
    })

    it('shows reset filters button when no results', async () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, filterable: true },
        global: { components: globalComponents }
      })

      const categoryFilter = wrapper.find('#category-filter')
      await categoryFilter.setValue('NonexistentCategory')

      expect(wrapper.find('[data-testid="no-results"]').exists()).toBe(true)
      expect(wrapper.find('.reset-filters-btn').exists()).toBe(true)
    })

    it('resets filters when reset button is clicked', async () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, filterable: true },
        global: { components: globalComponents }
      })

      // Apply filter that shows no results
      const categoryFilter = wrapper.find('#category-filter')
      await categoryFilter.setValue('NonexistentCategory')

      // Click reset button
      const resetBtn = wrapper.find('.reset-filters-btn')
      await resetBtn.trigger('click')

      // Should show all items again
      const items = wrapper.findAll('[data-testid="content-item"]')
      expect(items).toHaveLength(3)
    })
  })

  describe('Relationship Display', () => {
    it('shows relationship indicators when enabled', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, showRelationships: true },
        global: { components: globalComponents }
      })

      const relationshipIndicators = wrapper.findAll('[data-testid="relationship-indicators"]')
      expect(relationshipIndicators).toHaveLength(1) // Only one item has relationships
    })

    it('hides relationship indicators when disabled', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, showRelationships: false },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="relationship-indicators"]').exists()).toBe(false)
    })

    it('displays correct relationship count', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, showRelationships: true },
        global: { components: globalComponents }
      })

      const relationshipText = wrapper.find('[data-testid="relationship-indicators"]')
      expect(relationshipText.text()).toBe('1 related item')
    })
  })

  describe('Limit and Pagination', () => {
    it('limits displayed items when limit prop is set', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, limit: 2 },
        global: { components: globalComponents }
      })

      const items = wrapper.findAll('[data-testid="content-item"]')
      expect(items).toHaveLength(2)
    })

    it('shows all items when no limit is set', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent },
        global: { components: globalComponents }
      })

      const items = wrapper.findAll('[data-testid="content-item"]')
      expect(items).toHaveLength(3)
    })
  })

  describe('Interaction Events', () => {
    it('emits content-click event when item is clicked', async () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent },
        global: { components: globalComponents }
      })

      const firstItem = wrapper.find('[data-testid="content-item"]')
      await firstItem.trigger('click')

      expect(wrapper.emitted('content-click')).toBeTruthy()
      expect(wrapper.emitted('content-click')![0][0]).toEqual(mixedContent[0])
    })
  })

  describe('Empty States', () => {
    it('shows empty state when no items provided', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: [] },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="empty-state"]').text()).toContain('No content available')
    })

    it('shows no results state when filters return empty results', async () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, filterable: true },
        global: { components: globalComponents }
      })

      const categoryFilter = wrapper.find('#category-filter')
      await categoryFilter.setValue('NonexistentCategory')

      expect(wrapper.find('[data-testid="no-results"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="no-results"]').text()).toContain('No content matches')
    })
  })

  describe('Accessibility', () => {
    it('includes proper data-testid attributes', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, heading: 'Content', filterable: true },
        global: { components: globalComponents }
      })

      expect(wrapper.find('[data-testid="list-heading"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="item-count"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="filter-controls"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="content-items"]').exists()).toBe(true)
    })

    it('uses proper semantic HTML structure', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, heading: 'Content', headingLevel: 2 },
        global: { components: globalComponents }
      })

      // Should use proper heading element
      expect(wrapper.find('h2').exists()).toBe(true)
      
      // Items should be in article elements
      expect(wrapper.findAll('article')).toHaveLength(3)
    })

    it('provides proper form labels for filter controls', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, filterable: true },
        global: { components: globalComponents }
      })

      const typeLabel = wrapper.find('label[for="type-filter"]')
      const categoryLabel = wrapper.find('label[for="category-filter"]')

      expect(typeLabel.exists()).toBe(true)
      expect(categoryLabel.exists()).toBe(true)
    })
  })

  describe('Custom CSS Classes', () => {
    it('applies custom CSS class from props', () => {
      const wrapper = mount(ccmContentList, {
        props: { items: mixedContent, class: 'custom-list-class' },
        global: { components: globalComponents }
      })

      expect(wrapper.find('.custom-list-class').exists()).toBe(true)
    })
  })
})