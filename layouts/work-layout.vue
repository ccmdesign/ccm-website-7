<template>
  <div class="layout">
    <slot name="hero" :hero="hero">
      <ccm-page-hero class="layout-hero" minimal="true" />
    </slot>
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

</style>