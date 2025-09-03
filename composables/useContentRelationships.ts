/**
 * Content Relationships Composable
 * Computes relationships between blog posts and case studies
 * Based on architecture/api-specification.md
 */

import type {
  IContentRelationshipService,
  RelationshipOptions,
  RelationshipResult,
  RelationshipScore,
  RelationshipFilter,
  ProcessedContent,
  RelationshipError,
  AlgorithmMetrics,
  RelationshipAlgorithm
} from '~/types/pipeline'
import type { BlogPost, CaseStudy, ContentRelationship, RelationshipType } from '~/types/content'

/**
 * Relationship computation service with multiple algorithms
 */
export const useContentRelationships = (): IContentRelationshipService => {
  
  /**
   * Compute relationships with timeout protection and multiple algorithms
   */
  const computeRelationships = async (
    content: ProcessedContent,
    options: RelationshipOptions = {
      algorithms: ['tag_similarity', 'category_match'],
      minStrength: 0.1,
      maxRelationsPerContent: 5
    }
  ): Promise<RelationshipResult> => {
    const startTime = Date.now()
    const errors: RelationshipError[] = []
    const relationships: ContentRelationship[] = []
    const algorithmMetrics: AlgorithmMetrics[] = []
    
    try {
      // Apply each algorithm with timeout protection
      for (const algorithm of options.algorithms) {
        const algorithmStartTime = Date.now()
        
        try {
          const algorithmPromise = applyRelationshipAlgorithm(content, algorithm, options)
          const timeoutPromise = new Promise<ContentRelationship[]>((_, reject) =>
            setTimeout(() => reject(new Error(`${algorithm} timeout`)), options.timeoutMs || 10000)
          )
          
          const algorithmResults = await Promise.race([algorithmPromise, timeoutPromise])
          relationships.push(...algorithmResults)
          
          algorithmMetrics.push({
            algorithm,
            processingTime: Date.now() - algorithmStartTime,
            relationshipsGenerated: algorithmResults.length
          })
        } catch (error) {
          errors.push({
            type: 'timeout',
            algorithm,
            sourceContent: 'multiple',
            message: `Algorithm ${algorithm} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          })
        }
      }
      
      // Filter and sort relationships
      const filteredRelationships = filterRelationships(relationships, [
        { type: 'min_strength', value: options.minStrength },
        { type: 'max_per_content', value: options.maxRelationsPerContent }
      ])
      
      return {
        success: true,
        relationships: filteredRelationships,
        errors,
        algorithmMetrics
      }
      
    } catch (error) {
      return {
        success: false,
        relationships: [],
        errors: [{
          type: 'algorithm_failure',
          sourceContent: 'pipeline',
          message: error instanceof Error ? error.message : 'Unknown relationship error'
        }],
        algorithmMetrics
      }
    }
  }
  
  /**
   * Score individual relationship based on algorithm
   */
  const scoreRelationship = (
    source: BlogPost | CaseStudy,
    target: BlogPost | CaseStudy,
    algorithm: RelationshipAlgorithm
  ): RelationshipScore => {
    switch (algorithm) {
      case 'tag_similarity':
        return calculateTagSimilarity(source, target)
      case 'category_match':
        return calculateCategoryMatch(source, target)
      case 'content_analysis':
        return calculateContentAnalysis(source, target)
      default:
        return { score: 0, confidence: 0, reason: 'Unknown algorithm' }
    }
  }
  
  /**
   * Filter relationships by various criteria
   */
  const filterRelationships = (
    relationships: ContentRelationship[],
    filters: RelationshipFilter[]
  ): ContentRelationship[] => {
    let filtered = [...relationships]
    
    filters.forEach(filter => {
      filtered = filtered.filter(relationship => 
        applyRelationshipFilter(relationship, filter)
      )
    })
    
    // Sort by strength descending
    filtered.sort((a, b) => b.strength - a.strength)
    
    return filtered
  }
  
  return { computeRelationships, scoreRelationship, filterRelationships }
}

/**
 * Apply specific relationship algorithm to content
 */
async function applyRelationshipAlgorithm(
  content: ProcessedContent,
  algorithm: RelationshipAlgorithm,
  options: RelationshipOptions
): Promise<ContentRelationship[]> {
  const relationships: ContentRelationship[] = []
  const allContent = [...content.blogPosts, ...content.caseStudies]
  
  for (let i = 0; i < allContent.length; i++) {
    for (let j = i + 1; j < allContent.length; j++) {
      const source = allContent[i]
      const target = allContent[j]
      
      const score = scoreRelationshipByAlgorithm(source, target, algorithm)
      
      if (score.score >= options.minStrength) {
        // Create bidirectional relationships
        relationships.push({
          source_type: getContentType(source),
          source_slug: source.slug,
          target_type: getContentType(target),
          target_slug: target.slug,
          relationship_type: getRelationshipType(algorithm),
          strength: score.score,
          computed_reason: score.reason
        })
        
        relationships.push({
          source_type: getContentType(target),
          source_slug: target.slug,
          target_type: getContentType(source),
          target_slug: source.slug,
          relationship_type: getRelationshipType(algorithm),
          strength: score.score,
          computed_reason: score.reason
        })
      }
    }
  }
  
  return relationships
}

/**
 * Score relationship using specific algorithm
 */
function scoreRelationshipByAlgorithm(
  source: BlogPost | CaseStudy,
  target: BlogPost | CaseStudy,
  algorithm: RelationshipAlgorithm
): RelationshipScore {
  switch (algorithm) {
    case 'tag_similarity':
      return calculateTagSimilarity(source, target)
    case 'category_match':
      return calculateCategoryMatch(source, target)
    case 'content_analysis':
      return calculateContentAnalysis(source, target)
    default:
      return { score: 0, confidence: 0, reason: 'Unknown algorithm' }
  }
}

/**
 * Calculate tag similarity between content pieces
 */
function calculateTagSimilarity(
  source: BlogPost | CaseStudy,
  target: BlogPost | CaseStudy
): RelationshipScore {
  const sourceTags = getContentTags(source)
  const targetTags = getContentTags(target)
  
  if (sourceTags.length === 0 || targetTags.length === 0) {
    return { score: 0, confidence: 0, reason: 'No tags available for comparison' }
  }
  
  const intersection = sourceTags.filter(tag => targetTags.includes(tag))
  const union = [...new Set([...sourceTags, ...targetTags])]
  
  const jaccardScore = intersection.length / union.length
  const sharedTags = intersection.join(', ')
  
  return {
    score: jaccardScore,
    confidence: Math.min(sourceTags.length, targetTags.length) / 10, // Confidence based on tag availability
    reason: intersection.length > 0 
      ? `Shared tags: ${sharedTags}` 
      : 'No shared tags found'
  }
}

/**
 * Calculate category matching between content pieces
 */
function calculateCategoryMatch(
  source: BlogPost | CaseStudy,
  target: BlogPost | CaseStudy
): RelationshipScore {
  const sourceCategories = getContentCategories(source)
  const targetCategories = getContentCategories(target)
  
  if (sourceCategories.length === 0 || targetCategories.length === 0) {
    return { score: 0, confidence: 0, reason: 'No categories available for comparison' }
  }
  
  const intersection = sourceCategories.filter(cat => targetCategories.includes(cat))
  const matchRatio = intersection.length / Math.max(sourceCategories.length, targetCategories.length)
  
  return {
    score: matchRatio,
    confidence: 0.8, // High confidence for category matching
    reason: intersection.length > 0 
      ? `Shared categories: ${intersection.join(', ')}`
      : 'No shared categories found'
  }
}

/**
 * Calculate content analysis similarity (basic implementation)
 */
function calculateContentAnalysis(
  source: BlogPost | CaseStudy,
  target: BlogPost | CaseStudy
): RelationshipScore {
  const sourceWords = extractKeywords(source.content || '')
  const targetWords = extractKeywords(target.content || '')
  
  if (sourceWords.length === 0 || targetWords.length === 0) {
    return { score: 0, confidence: 0, reason: 'No content available for analysis' }
  }
  
  const intersection = sourceWords.filter(word => targetWords.includes(word))
  const score = intersection.length / Math.max(sourceWords.length, targetWords.length)
  
  return {
    score: Math.min(score, 1), // Cap at 1.0
    confidence: 0.6, // Medium confidence for basic content analysis
    reason: intersection.length > 0 
      ? `Shared keywords: ${intersection.slice(0, 3).join(', ')}`
      : 'No shared keywords found'
  }
}

/**
 * Extract tags from content based on type
 */
function getContentTags(content: BlogPost | CaseStudy): string[] {
  if ('tags' in content) {
    return content.tags || []
  }
  if ('services' in content) {
    return content.services || []
  }
  return []
}

/**
 * Extract categories from content based on type
 */
function getContentCategories(content: BlogPost | CaseStudy): string[] {
  if ('categories' in content) {
    return content.categories || []
  }
  if ('sector' in content) {
    return [content.sector]
  }
  return []
}

/**
 * Get content type identifier
 */
function getContentType(content: BlogPost | CaseStudy): 'blog' | 'case_study' {
  return 'tags' in content ? 'blog' : 'case_study'
}

/**
 * Map algorithm to relationship type
 */
function getRelationshipType(algorithm: RelationshipAlgorithm): RelationshipType {
  switch (algorithm) {
    case 'tag_similarity':
      return 'shared_tags'
    case 'category_match':
      return 'same_category'
    case 'content_analysis':
      return 'content_mention'
    default:
      return 'shared_tags'
  }
}

/**
 * Apply individual relationship filter
 */
function applyRelationshipFilter(
  relationship: ContentRelationship,
  filter: RelationshipFilter
): boolean {
  switch (filter.type) {
    case 'min_strength':
      return relationship.strength >= (filter.value as number)
    case 'max_per_content':
      // This would need to be handled at a higher level with content grouping
      return true
    case 'content_type':
      return relationship.source_type === filter.value || relationship.target_type === filter.value
    default:
      return true
  }
}

/**
 * Extract keywords from content (basic implementation)
 */
function extractKeywords(content: string): string[] {
  if (!content) return []
  
  // Remove HTML tags and extract meaningful words
  const text = content.replace(/<[^>]*>/g, ' ')
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter(word => 
      word.length > 3 && 
      !isCommonWord(word)
    )
  
  // Return unique words, limited to most frequent
  const wordFreq: Record<string, number> = {}
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  return Object.keys(wordFreq)
    .sort((a, b) => wordFreq[b] - wordFreq[a])
    .slice(0, 20) // Top 20 keywords
}

/**
 * Check if word is too common for keyword extraction
 */
function isCommonWord(word: string): boolean {
  const commonWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'over', 'also', 'back', 'after', 'first', 'well', 'work', 'such']
  return commonWords.includes(word)
}