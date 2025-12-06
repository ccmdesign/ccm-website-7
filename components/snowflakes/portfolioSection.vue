<script setup lang="ts">
const props = defineProps<{
  sectionTitle?: string
}>()
</script>

<template>
  <div class="portfolio-section | stack">
    <slot name="header">
      <h2 v-if="sectionTitle" class="h1 text-align:center">{{ sectionTitle }}</h2>
    </slot>
    

    <div class="portfolio-section__content">
      <slot />
    </div>

    <slot name="footer" />
  </div>
</template>

<style lang="css" scoped>

.portfolio-section__content {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  margin-inline: var(--system-padding-edge);
}

h2 {
  font-size: var(--size-2);
  font-weight: 200;
  text-align: center;
  margin-block-start: var(--space-3xl);
  margin-block-end: var(--space-2xl);
}

:deep(.portfolio-item) {
  grid-column: span 12;
  grid-row: span 1;
  
}

@media (min-width: 769px) {
:deep(.portfolio-item:nth-child(5n+1)) {
  grid-column: span 8;
  grid-row: span 4;
  object-fit: cover;
}

:deep(.portfolio-item:nth-child(5n+2)),
:deep(.portfolio-item:nth-child(5n+3)) {
  grid-column: span 4;
  grid-row: span 2;
}

:deep(.portfolio-item:nth-child(5n+4)),
:deep(.portfolio-item:nth-child(5n+5)) {
  grid-column: span 6;
  grid-row: span 3;
}
}
</style>