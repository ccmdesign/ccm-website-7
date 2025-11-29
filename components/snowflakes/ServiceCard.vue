<template>
  <div class="service-card">
    <hgroup class="service-card__header">
      <h6>{{ title }}</h6>
    </hgroup>

    <div class="service-card__content">
      <p v-if="tagline">{{ tagline }}</p>
      <ccm-button :to="to" class="service-card__cta">Explore service</ccm-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  brow?: string | null
  title: string
  tagline?: string | null
  to: RouteLocationRaw
  slug?: string | null
}>()
</script>

<style scoped>
.service-card {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: wide-start / wide-end;
  border-top: 1px solid var(--color-base-tint-10);
  gap: var(--space-ml);
  padding: var(--space-l) 0;
}

.service-card__header {
  grid-column: wide-start / normal-start;
}

.service-card__content {
  grid-column: normal-start / wide-end;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-m);
}
</style>
