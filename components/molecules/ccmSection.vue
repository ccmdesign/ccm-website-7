<template>
  <section class="ccm-section">
    <slot />
  </section>
</template>

<script setup>
</script>

<style scoped>
.ccm-section {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  margin-inline: var(--system-padding-edge);
}
</style>