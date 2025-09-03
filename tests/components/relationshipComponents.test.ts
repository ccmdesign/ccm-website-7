/**
 * Component integration tests for Story 1.3 relationship components
 * Tests ccmRelatedPosts, ccmClientPortfolio, and ccmProjectLinks components
 * with relationship data integration and static generation compatibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import type { BlogPost, CaseStudy, ContentRelationship } from '~/types/content'
import ccmRelatedPosts from '~/components/ccmRelatedPosts.vue'
import ccmClientPortfolio from '~/components/ccmClientPortfolio.vue' 
import ccmProjectLinks from '~/components/ccmProjectLinks.vue'

// Mock Nuxt components
vi.mock('#components', () => ({
  ccmBaseSection: {
    name: 'ccmBaseSection',
    template: '<section class="base-section"><slot /></section>'
  },
  ccmMasterGrid: {
    name: 'ccmMasterGrid', 
    template: '<div class="master-grid"><slot /></div>'
  }
}))

// Mock NuxtLink component
vi.mock('#app', () => ({
  NuxtLink: {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  }
}))

// Test fixtures
const mockBlogPost: BlogPost = {
  brow: 'Research Communication',
  title: 'Stanford Research Center Case Study',
  tagline: 'How technology transforms research impact',
  date: new Date('2025-08-27'),
  author: 'John Doe',
  categories: ['research', 'technology'],
  tags: ['engagement', 'reports', 'personalization'],
  seo_tags: ['research-communication', 'stanford'],
  excerpt: 'A detailed case study on research transformation',
  content: '<p>Full content here</p>',
  slug: 'stanford-research-center-case-study',
  relationships: []
}

const mockCaseStudy: CaseStudy = {
  title: 'BFNA Federalism in Crisis Project',
  client: 'Brennan Center for Justice',
  challenge: 'Complex democracy communication challenges',
  solution: 'Strategic design and development approach',
  impact: 'Improved civic engagement and understanding',
  sector: 'Civic Technology',
  services: ['research', 'design', 'development'],
  content: '<p>Full case study content</p>',
  slug: 'bfna-federalism-in-crisis',
  featured_image: '/images/bfna-hero.jpg',
  gallery: ['/images/bfna-1.jpg', '/images/bfna-2.jpg'],
  relationships: []
}

const mockRelationships: ContentRelationship[] = [
  {
    source_type: 'blog',
    source_slug: 'stanford-research-center-case-study',
    target_type: 'case_study',
    target_slug: 'bfna-federalism-in-crisis',
    relationship_type: 'shared_tags',
    strength: 0.85,
    computed_reason: 'Both focus on research communication and civic engagement'
  },
  {
    source_type: 'blog',
    source_slug: 'stanford-research-center-case-study', 
    target_type: 'blog',
    target_slug: 'mobile-first-research-reports',
    relationship_type: 'same_category',
    strength: 0.72,
    computed_reason: 'Similar research methodology and audience'
  },
  {
    source_type: 'case_study',
    source_slug: 'bfna-federalism-in-crisis',
    target_type: 'blog',
    target_slug: 'stanford-research-center-case-study',
    relationship_type: 'similar_services',
    strength: 0.68,
    computed_reason: 'Both involve research analysis and strategic communication'
  }
]

const mockClientProjects: CaseStudy[] = [
  {
    ...mockCaseStudy,
    title: 'Democracy Reform Initiative',
    slug: 'democracy-reform-initiative',
    challenge: 'Making complex policy accessible',
    impact: 'Increased public understanding of democracy issues'
  },
  {
    ...mockCaseStudy,
    title: 'Voting Rights Campaign',
    slug: 'voting-rights-campaign',
    challenge: 'Engaging diverse communities in voting rights',
    impact: 'Higher civic participation across demographics'
  }
]

describe('ccmRelatedPosts Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders related posts with proper structure', () => {
    const wrapper = mount(ccmRelatedPosts, {
      props: {
        currentItem: mockBlogPost,
        relationships: mockRelationships,
        limit: 3,
        variant: 'inline'
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('[data-testid="related-posts"]').exists()).toBe(true)
    expect(wrapper.find('.related-posts__heading').text()).toBe('Related Posts')
    expect(wrapper.find('.related-posts__list').exists()).toBe(true)
  })

  it('filters relationships by current item slug', () => {
    const wrapper = mount(ccmRelatedPosts, {
      props: {
        currentItem: mockBlogPost,
        relationships: mockRelationships,
        variant: 'sidebar'
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    // Should only show relationships where current item is the source
    const relationshipItems = wrapper.findAll('.related-posts__item')
    expect(relationshipItems).toHaveLength(2) // 2 relationships from blog post
  })

  it('applies variant-specific styling classes', () => {
    const wrapper = mount(ccmRelatedPosts, {
      props: {
        currentItem: mockBlogPost,
        relationships: mockRelationships,
        variant: 'footer'
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('.related-posts--footer').exists()).toBe(true)
    expect(wrapper.find('.related-posts__heading').text()).toBe('You Might Also Like')
  })

  it('respects limit prop for number of relationships displayed', () => {
    const wrapper = mount(ccmRelatedPosts, {
      props: {
        currentItem: mockBlogPost,
        relationships: mockRelationships,
        limit: 1
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const relationshipItems = wrapper.findAll('.related-posts__item')
    expect(relationshipItems).toHaveLength(1)
  })

  it('displays relationship strength indicators', () => {
    const wrapper = mount(ccmRelatedPosts, {
      props: {
        currentItem: mockBlogPost,
        relationships: mockRelationships
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const strengthIndicator = wrapper.find('.related-posts__strength')
    expect(strengthIndicator.exists()).toBe(true)
    expect(strengthIndicator.attributes('data-strength')).toBe('high') // 0.85 strength
  })

  it('does not render when no relationships exist', () => {
    const wrapper = mount(ccmRelatedPosts, {
      props: {
        currentItem: mockBlogPost,
        relationships: []
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('[data-testid="related-posts"]').exists()).toBe(false)
  })
})

describe('ccmClientPortfolio Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders client portfolio with project grid', () => {
    const wrapper = mount(ccmClientPortfolio, {
      props: {
        clientName: 'Brennan Center for Justice',
        projects: mockClientProjects,
        relationships: mockRelationships,
        variant: 'grid',
        showImages: true
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          ccmMasterGrid: { template: '<div class="grid"><slot /></div>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('[data-testid="client-portfolio"]').exists()).toBe(true)
    expect(wrapper.find('.client-portfolio__heading').text()).toContain('Brennan Center for Justice Portfolio')
    expect(wrapper.find('.client-portfolio__grid').exists()).toBe(true)
  })

  it('displays correct number of project items', () => {
    const wrapper = mount(ccmClientPortfolio, {
      props: {
        clientName: 'Brennan Center for Justice',
        projects: mockClientProjects,
        relationships: mockRelationships
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          ccmMasterGrid: { template: '<div><slot /></div>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const portfolioItems = wrapper.findAll('.client-portfolio__item')
    expect(portfolioItems).toHaveLength(mockClientProjects.length)
  })

  it('shows portfolio description with project count', () => {
    const wrapper = mount(ccmClientPortfolio, {
      props: {
        clientName: 'Brennan Center for Justice',
        projects: mockClientProjects,
        relationships: mockRelationships
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          ccmMasterGrid: { template: '<div><slot /></div>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const description = wrapper.find('.client-portfolio__description')
    expect(description.text()).toContain('2 projects in Civic Technology')
  })

  it('conditionally renders featured images based on showImages prop', () => {
    const wrapperWithImages = mount(ccmClientPortfolio, {
      props: {
        clientName: 'Test Client',
        projects: mockClientProjects,
        relationships: mockRelationships,
        showImages: true
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          ccmMasterGrid: { template: '<div><slot /></div>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const wrapperWithoutImages = mount(ccmClientPortfolio, {
      props: {
        clientName: 'Test Client',
        projects: mockClientProjects,
        relationships: mockRelationships,
        showImages: false
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          ccmMasterGrid: { template: '<div><slot /></div>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapperWithImages.find('.client-portfolio__image').exists()).toBe(true)
    expect(wrapperWithoutImages.find('.client-portfolio__image').exists()).toBe(false)
  })

  it('applies variant-specific CSS classes', () => {
    const wrapper = mount(ccmClientPortfolio, {
      props: {
        clientName: 'Test Client',
        projects: mockClientProjects,
        relationships: mockRelationships,
        variant: 'list'
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          ccmMasterGrid: { template: '<div><slot /></div>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('.client-portfolio--list').exists()).toBe(true)
  })

  it('displays service tags for each project', () => {
    const wrapper = mount(ccmClientPortfolio, {
      props: {
        clientName: 'Test Client',
        projects: mockClientProjects,
        relationships: mockRelationships
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          ccmMasterGrid: { template: '<div><slot /></div>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const serviceTags = wrapper.findAll('[data-testid="service-tag"]')
    expect(serviceTags.length).toBeGreaterThan(0)
    expect(serviceTags[0].text()).toBe('research')
  })
})

describe('ccmProjectLinks Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders project links with cross-references', () => {
    const wrapper = mount(ccmProjectLinks, {
      props: {
        sourceContent: mockBlogPost,
        crossReferences: mockRelationships,
        variant: 'related',
        showReasons: true
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('[data-testid="project-links"]').exists()).toBe(true)
    expect(wrapper.find('.project-links__heading').exists()).toBe(true)
    expect(wrapper.find('.project-links__list').exists()).toBe(true)
  })

  it('filters cross-references by source content slug', () => {
    const wrapper = mount(ccmProjectLinks, {
      props: {
        sourceContent: mockBlogPost,
        crossReferences: mockRelationships,
        variant: 'related'
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const linkItems = wrapper.findAll('.project-links__item')
    expect(linkItems).toHaveLength(2) // Only relationships where blog post is source
  })

  it('displays relationship reasons when showReasons is true', () => {
    const wrapper = mount(ccmProjectLinks, {
      props: {
        sourceContent: mockBlogPost,
        crossReferences: mockRelationships,
        variant: 'related',
        showReasons: true
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const reasonText = wrapper.find('.project-links__reason-text')
    expect(reasonText.exists()).toBe(true)
    expect(reasonText.text()).toBe('Both focus on research communication and civic engagement')
  })

  it('groups references by relationship type for tags variant', () => {
    const wrapper = mount(ccmProjectLinks, {
      props: {
        sourceContent: mockBlogPost,
        crossReferences: mockRelationships,
        variant: 'tags'
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('.project-links__groups').exists()).toBe(true)
    expect(wrapper.find('.project-links__group').exists()).toBe(true)
  })

  it('shows bidirectional relationship indicators', () => {
    const wrapper = mount(ccmProjectLinks, {
      props: {
        sourceContent: mockBlogPost,
        crossReferences: mockRelationships,
        variant: 'related'
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const directionIndicator = wrapper.find('.project-links__direction')
    expect(directionIndicator.exists()).toBe(true)
    expect(directionIndicator.text()).toContain('Blog Post → Case Study')
  })

  it('displays strength percentage with appropriate styling', () => {
    const wrapper = mount(ccmProjectLinks, {
      props: {
        sourceContent: mockBlogPost,
        crossReferences: mockRelationships,
        variant: 'related'
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const strengthIndicator = wrapper.find('.project-links__strength')
    expect(strengthIndicator.exists()).toBe(true)
    expect(strengthIndicator.text()).toContain('85% match')
    expect(strengthIndicator.attributes('data-strength')).toBe('high')
  })

  it('does not render when no cross-references exist', () => {
    const wrapper = mount(ccmProjectLinks, {
      props: {
        sourceContent: mockBlogPost,
        crossReferences: []
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('[data-testid="project-links"]').exists()).toBe(false)
  })

  it('generates correct content paths for navigation', () => {
    const wrapper = mount(ccmProjectLinks, {
      props: {
        sourceContent: mockBlogPost,
        crossReferences: mockRelationships,
        variant: 'related'
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { 
            props: ['to'],
            template: '<a :data-href="to"><slot /></a>' 
          }
        }
      }
    })

    const links = wrapper.findAll('a[data-href]')
    expect(links[0].attributes('data-href')).toBe('/case-studies/bfna-federalism-in-crisis')
    expect(links[1].attributes('data-href')).toBe('/blog/mobile-first-research-reports')
  })
})

describe('Integration Tests', () => {
  it('all components handle empty relationship arrays gracefully', () => {
    const emptyRelationships: ContentRelationship[] = []
    
    const relatedPostsWrapper = mount(ccmRelatedPosts, {
      props: {
        currentItem: mockBlogPost,
        relationships: emptyRelationships
      },
      global: { stubs: { ccmBaseSection: { template: '<section><slot /></section>' } } }
    })

    const portfolioWrapper = mount(ccmClientPortfolio, {
      props: {
        clientName: 'Test Client',
        projects: [],
        relationships: emptyRelationships
      },
      global: { 
        stubs: { 
          ccmBaseSection: { template: '<section><slot /></section>' },
          ccmMasterGrid: { template: '<div><slot /></div>' }
        } 
      }
    })

    const projectLinksWrapper = mount(ccmProjectLinks, {
      props: {
        sourceContent: mockBlogPost,
        crossReferences: emptyRelationships
      },
      global: { stubs: { ccmBaseSection: { template: '<section><slot /></section>' } } }
    })

    // All components should not render when no data is available
    expect(relatedPostsWrapper.find('[data-testid="related-posts"]').exists()).toBe(false)
    expect(portfolioWrapper.find('[data-testid="client-portfolio"]').exists()).toBe(false)
    expect(projectLinksWrapper.find('[data-testid="project-links"]').exists()).toBe(false)
  })

  it('components handle mixed content types in relationships', () => {
    const mixedRelationships: ContentRelationship[] = [
      {
        source_type: 'case_study',
        source_slug: 'bfna-federalism-in-crisis',
        target_type: 'blog',
        target_slug: 'stanford-research-center-case-study',
        relationship_type: 'shared_tags',
        strength: 0.75,
        computed_reason: 'Shared research methodology'
      }
    ]

    const wrapper = mount(ccmRelatedPosts, {
      props: {
        currentItem: mockCaseStudy,
        relationships: mixedRelationships
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('[data-testid="related-posts"]').exists()).toBe(true)
    expect(wrapper.find('.related-posts__type').text()).toBe('Blog Post')
  })

  it('components maintain accessibility attributes', () => {
    const wrapper = mount(ccmRelatedPosts, {
      props: {
        currentItem: mockBlogPost,
        relationships: mockRelationships
      },
      global: {
        stubs: {
          ccmBaseSection: { template: '<section><slot /></section>' },
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    const nav = wrapper.find('.related-posts__nav')
    expect(nav.attributes('role')).toBe('navigation')
    expect(nav.attributes('aria-label')).toBe('Related content')
  })
})