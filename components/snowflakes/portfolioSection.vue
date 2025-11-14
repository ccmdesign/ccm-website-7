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

    <slot name="footer" />
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


@media (min-width: 769px) {
:deep(.project-card:nth-of-type(5n+1)) {
  grid-column: span 8;
  grid-row: span 4;
}

:deep(.project-card:nth-of-type(5n+2)),
:deep(.project-card:nth-of-type(5n+3)) {
  grid-column: span 4;
  grid-row: span 2;
}

:deep(.project-card:nth-of-type(5n+4)),
:deep(.project-card:nth-of-type(5n+5)) {
  grid-column: span 6;
  grid-row: span 3;
}

}
</style>