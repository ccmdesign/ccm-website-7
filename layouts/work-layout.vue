<template>
  <div class="layout">
    <slot name="hero" :hero="hero">
      <ccm-page-hero class="layout-hero" :minimal="true" />
    </slot>
    <div v-if="hero?.tagline" class="tagline-section">
      <h2 class="tagline" data-slide-in="from-top">{{ hero.tagline }}</h2>
      <ccm-button 
        to="/work" 
        variant="link" 
        class="back-button"
        data-slide-in="from-top"
      >
        ← Back to portfolio
      </ccm-button>
    </div>
    <main class="layout-main">
      <slot />
    </main>
    <ccm-footer class="layout-footer" />
  </div>
</template>

<script setup lang="ts">
const hero = useHeroContent()
</script>

<style>
.tagline-section {
  padding-inline: var(--system-padding-edge);
  margin-block-start: var(--space-xl);
  margin-block-end: var(--space-2xl);
}

.tagline {
  margin-block: 0;
  margin-block-end: var(--space-m);
  max-width: 40ch;
}

.back-button {
  margin-block-start: var(--space-s);
}
</style>