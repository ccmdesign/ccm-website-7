<template>
  <main class="layout">
    <ccm-topbar class="topbar" />
    <slot name="tagline">
      <h2 v-if="hero?.tagline" class="tagline" data-slide-in="from-top">{{ hero.tagline }}</h2>
    </slot>
    <slot />
  </main>
</template>

<script setup>
const hero = useHeroContent()
</script>

<style>

.layout {
  min-block-size: 100svh;
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
  justify-content: space-between;
}

.topbar {
  padding-inline: var(--system-padding-edge);
  padding-block-start: var(--space-m);
  @media (min-width: 960px) {
    padding-block-start: var(--system-padding-edge);
  }
}

.tagline {
  margin-block: 8svh;
  max-width: 40ch;
  margin-inline-end: auto;
  
}
</style>