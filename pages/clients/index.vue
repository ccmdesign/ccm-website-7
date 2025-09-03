<template>
  <ccmClientIndex
    :clients="clientPortfolios"
    variant="showcase"
    @client-click="handleClientClick"
    @project-click="navigateToProject"
    @sector-filter="handleSectorFilter"
  />
</template>

<script setup lang="ts">
/**
 * Client Index Page
 * 
 * Static page that displays client portfolios using the ccmClientIndex component
 * with computed client-project relationships from case study data.
 * Showcases organizational partnerships and service breadth for business development.
 * 
 * @page /clients
 * @since 1.4.0
 */

import type { CaseStudy } from '~/types/content'

// Interface for client portfolio computation
interface ClientPortfolio {
  clientName: string
  sector: string
  projects: CaseStudy[]
  allServices: string[]
  relationshipCount: number
}

// Use content pipeline to process case studies for client portfolios
const { processAllContent } = useContentPipeline()
const contentResult = await processAllContent()

const processedCaseStudies = contentResult.success 
  ? contentResult.content.caseStudies 
  : []

/**
 * Computed client portfolios grouped from case study data
 * Creates client-centric view of project relationships
 */
const clientPortfolios = computed((): ClientPortfolio[] => {
  const clientMap = new Map<string, ClientPortfolio>()
  
  processedCaseStudies.forEach(caseStudy => {
    const clientName = caseStudy.client
    
    if (!clientMap.has(clientName)) {
      clientMap.set(clientName, {
        clientName,
        sector: caseStudy.sector,
        projects: [],
        allServices: [],
        relationshipCount: 0
      })
    }
    
    const clientPortfolio = clientMap.get(clientName)!
    clientPortfolio.projects.push(caseStudy)
    
    // Aggregate all services across projects
    caseStudy.services.forEach(service => {
      if (!clientPortfolio.allServices.includes(service)) {
        clientPortfolio.allServices.push(service)
      }
    })
    
    // Aggregate relationship counts
    clientPortfolio.relationshipCount += caseStudy.relationships.length
  })
  
  return Array.from(clientMap.values())
    .sort((a, b) => b.projects.length - a.projects.length) // Sort by project count
})

/**
 * Handles client portfolio selection for detailed view
 */
const handleClientClick = (clientPortfolio: ClientPortfolio) => {
  // Could navigate to a dedicated client page or show modal
  console.log('Client portfolio clicked:', clientPortfolio.clientName)
}

/**
 * Handles direct project navigation from client context
 */
const navigateToProject = (project: CaseStudy) => {
  navigateTo(`/case-studies/${project.slug}`)
}

/**
 * Handles sector filter changes for analytics
 */
const handleSectorFilter = (sector: string) => {
  console.log('Client portfolios filtered by sector:', sector)
}

// Set page meta for SEO and business development
useHead({
  title: 'Clients - Partnership Portfolio',
  meta: [
    {
      name: 'description',
      content: 'Organizations we partner with to transform research communication and technology implementation across multiple sectors and service areas.'
    }
  ]
})
</script>