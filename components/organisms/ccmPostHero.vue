<template>
  <header class="ccm-post-hero">
    <div class="center">
      <ccm-topbar />
    </div>
    <div class="center">
      <hgroup>
        <h1 class="ccm-post-hero__title">{{ page.title }}</h1>
      </hgroup>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.ccm-post-hero {
  background-color: transparent;
  block-size: auto;
  min-block-size: 5svh;
}
</style>