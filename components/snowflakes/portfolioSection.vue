<script setup lang="ts">
const props = defineProps<{
  sectionTitle: string
}>()
</script>

<template>
  <div class="portfolio-section | stack">
    <h2 v-if="sectionTitle" class="h1 text-align:center">{{ sectionTitle }}</h2>
    
    <div class="portfolio-section__content | portfolio-grid-columns">
      <slot />
    </div>
    
    <div class="text-align:center padding-block:m">
      <ccm-button size="xl" class="portfolio-section__button" color="primary" to="/case-studies">View all case studies</ccm-button>
    </div>
  </div>
</template>

<style lang="css" scoped>

.portfolio-section {
  padding-block: var(--space-3xl);
}

.portfolio-grid-columns {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-s);
  max-width: 90svw;
  margin-inline: auto;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.portfolio-section__content {
  
}


@media (min-width: 769px) {
:deep(.project-card:first-of-type) {
  grid-column: span 8;
  grid-row: span 4;
}

:deep(.project-card:nth-of-type(2)),
:deep(.project-card:nth-of-type(3)) {
  grid-column: span 4;
  grid-row: span 2;
}

:deep(.project-card:nth-of-type(4)),
:deep(.project-card:nth-of-type(5)) {
  grid-column: span 6;
  grid-row: span 3;
}

}
</style>