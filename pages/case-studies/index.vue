<template>
  <ccmCaseStudyIndex
    :case-studies="processedCaseStudies"
    variant="portfolio"
    :show-images="true"
    :show-relationships="true"
    @case-study-click="navigateToCaseStudy"
    @sector-filter="handleSectorFilter"
  />
</template>

<script setup lang="ts">
/**
 * Case Studies Index Page
 * 
 * Static page that displays all case studies using the ccmCaseStudyIndex component
 * integrated with useContentPipeline for build-time content processing.
 * Showcases client portfolio with sector-based filtering and visual presentation.
 * 
 * @page /case-studies
 * @since 1.4.0
 */

import type { CaseStudy } from '~/types/content'

// Use content pipeline to process case studies during build
const { processAllContent } = useContentPipeline()
const contentResult = await processAllContent()

// Extract processed case studies from pipeline result
const processedCaseStudies = contentResult.success 
  ? contentResult.content.caseStudies 
  : []

/**
 * Handles case study navigation with proper Nuxt routing
 */
const navigateToCaseStudy = (caseStudy: CaseStudy) => {
  navigateTo(`/case-studies/${caseStudy.slug}`)
}

/**
 * Handles sector filter changes for analytics
 */
const handleSectorFilter = (sector: string) => {
  console.log('Case studies filtered by sector:', sector)
}

// Set page meta for SEO and accessibility
useHead({
  title: 'Case Studies - Client Portfolio',
  meta: [
    {
      name: 'description',
      content: 'Portfolio of client engagements showcasing strategic technology implementation and research communication excellence across multiple sectors.'
    }
  ]
})
</script>