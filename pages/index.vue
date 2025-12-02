<template>
  <h2 class="tagline">{{ hero?.tagline }}</h2>
  <ccm-featured-work class="featured-work" />
  <ccm-logo-reel class="logo-reel" />
</template>

<style scoped>

.featured-work {
  max-width: 800px;
  margin-inline-start: auto;
}

.logo-reel {
  padding-inline: var(--system-padding-edge);
  padding-block-end: var(--space-xl);
}

</style>


<script setup>
definePageMeta({
  hero: {
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    typewriterWords: ['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']
  }
})

const hero = useHeroContent()
</script>

