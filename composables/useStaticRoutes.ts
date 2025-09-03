/**
 * Static Routes Composable
 * Generates all content-based routes during build time
 * Based on architecture/api-specification.md
 */

import type {
  IStaticRouteService,
  RouteGenerationResult,
  ProcessedContent,
  StaticRoute,
  SEORoute,
  RouteError
} from '~/types/pipeline'

/**
 * Route generation service for static content
 */
export const useStaticRoutes = (): IStaticRouteService => {
  
  /**
   * Generate all content routes with error handling
   */
  const generateContentRoutes = async (content: ProcessedContent): Promise<RouteGenerationResult> => {
    const routes: StaticRoute[] = []
    const errors: RouteError[] = []
    
    try {
      // Generate blog post routes
      content.blogPosts.forEach(post => {
        try {
          routes.push({
            path: `/blog/${post.slug}`,
            component: 'BlogPostDetail',
            props: { 
              post, 
              relationships: getRelatedContent(post, content) 
            },
            metadata: {
              title: post.title,
              description: post.excerpt,
              lastModified: post.date,
              priority: 0.8
            }
          })
        } catch (error) {
          errors.push({
            type: 'generation_failure',
            route: `/blog/${post.slug}`,
            message: error instanceof Error ? error.message : 'Route generation failed',
            resolution: 'Check post data structure'
          })
        }
      })
      
      // Generate case study routes
      content.caseStudies.forEach(study => {
        try {
          routes.push({
            path: `/case-studies/${study.slug}`,
            component: 'CaseStudyDetail',
            props: { 
              study, 
              relationships: getRelatedContent(study, content) 
            },
            metadata: {
              title: study.title,
              description: study.challenge,
              lastModified: new Date(), // Case studies don't have explicit dates
              priority: 0.9
            }
          })
        } catch (error) {
          errors.push({
            type: 'generation_failure',
            route: `/case-studies/${study.slug}`,
            message: error instanceof Error ? error.message : 'Route generation failed',
            resolution: 'Check case study data structure'
          })
        }
      })
      
      const indexRoutes = generateIndexRoutes(content)
      const seoRoutes = generateSEORoutes(content)
      
      return {
        success: errors.length === 0,
        routes,
        indexRoutes,
        seoRoutes,
        errors
      }
      
    } catch (error) {
      return {
        success: false,
        routes: [],
        indexRoutes: [],
        seoRoutes: [],
        errors: [{
          type: 'generation_failure',
          route: 'multiple',
          message: error instanceof Error ? error.message : 'Route generation failed',
          resolution: 'Check content processing pipeline'
        }]
      }
    }
  }
  
  /**
   * Generate index and listing routes
   */
  const generateIndexRoutes = (content: ProcessedContent): StaticRoute[] => {
    return [
      {
        path: '/blog',
        component: 'BlogIndex',
        props: { 
          posts: content.blogPosts,
          metadata: content.metadata 
        },
        metadata: {
          title: 'Blog',
          description: 'Latest insights and research communication',
          lastModified: content.metadata.lastUpdated,
          priority: 0.9
        }
      },
      {
        path: '/case-studies',
        component: 'CaseStudyIndex', 
        props: { 
          studies: content.caseStudies,
          metadata: content.metadata 
        },
        metadata: {
          title: 'Case Studies',
          description: 'Our portfolio of successful projects',
          lastModified: content.metadata.buildTimestamp,
          priority: 0.9
        }
      }
    ]
  }
  
  /**
   * Generate SEO-optimized routes for sitemap
   */
  const generateSEORoutes = (content: ProcessedContent): SEORoute[] => {
    const seoRoutes: SEORoute[] = []
    
    // Add blog post SEO routes
    content.blogPosts.forEach(post => {
      seoRoutes.push({
        path: `/blog/${post.slug}`,
        component: 'BlogPostDetail',
        props: { post },
        metadata: {
          title: post.title,
          description: post.excerpt,
          lastModified: post.date,
          priority: 0.8
        },
        sitemap: true,
        robots: 'index',
        canonicalUrl: `https://ccm-website.com/blog/${post.slug}`
      })
    })
    
    // Add case study SEO routes
    content.caseStudies.forEach(study => {
      seoRoutes.push({
        path: `/case-studies/${study.slug}`,
        component: 'CaseStudyDetail',
        props: { study },
        metadata: {
          title: study.title,
          description: study.challenge,
          lastModified: content.metadata.buildTimestamp,
          priority: 0.9
        },
        sitemap: true,
        robots: 'index',
        canonicalUrl: `https://ccm-website.com/case-studies/${study.slug}`
      })
    })
    
    // Add index page SEO routes
    seoRoutes.push(
      {
        path: '/blog',
        component: 'BlogIndex',
        props: {},
        metadata: {
          title: 'Blog - Research Communication Insights',
          description: 'Latest insights on research communication, digital strategy, and stakeholder engagement',
          lastModified: content.metadata.buildTimestamp,
          priority: 0.9
        },
        sitemap: true,
        robots: 'index',
        canonicalUrl: 'https://ccm-website.com/blog'
      },
      {
        path: '/case-studies',
        component: 'CaseStudyIndex',
        props: {},
        metadata: {
          title: 'Case Studies - Our Portfolio',
          description: 'Successful projects in design, research communication, and digital strategy',
          lastModified: content.metadata.buildTimestamp,
          priority: 0.9
        },
        sitemap: true,
        robots: 'index',
        canonicalUrl: 'https://ccm-website.com/case-studies'
      }
    )
    
    return seoRoutes
  }
  
  return { generateContentRoutes, generateIndexRoutes, generateSEORoutes }
}

/**
 * Get related content for a specific content piece
 */
function getRelatedContent(contentPiece: any, processedContent: ProcessedContent) {
  return processedContent.relationships
    .filter(rel => 
      rel.source_slug === contentPiece.slug || 
      rel.target_slug === contentPiece.slug
    )
    .map(rel => {
      // Return the related content object, not just the relationship
      const isSource = rel.source_slug === contentPiece.slug
      const relatedSlug = isSource ? rel.target_slug : rel.source_slug
      const relatedType = isSource ? rel.target_type : rel.source_type
      
      if (relatedType === 'blog') {
        const relatedPost = processedContent.blogPosts.find(p => p.slug === relatedSlug)
        return relatedPost ? { ...relatedPost, relationship: rel } : null
      } else {
        const relatedStudy = processedContent.caseStudies.find(s => s.slug === relatedSlug)
        return relatedStudy ? { ...relatedStudy, relationship: rel } : null
      }
    })
    .filter(Boolean) // Remove null entries
    .sort((a: any, b: any) => b.relationship.strength - a.relationship.strength) // Sort by strength
    .slice(0, 5) // Limit to top 5 related items
}