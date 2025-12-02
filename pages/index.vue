<template>
<div class="homepage">
  <ccm-topbar class="topbar" />
  <h2 class="tagline">{{ hero?.tagline }}</h2>
  <ccm-featured-work class="featured-work" />
  <ccm-logo-reel class="logo-reel" />
</div>
</template>

<style scoped>


.homepage {
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
    padding-block-start: var(--space-2xl);
  }
}

.tagline {
  padding-inline: var(--system-padding-edge);
  font-size: calc(var(--size-2) * 0.8);
  font-weight: 100;
  color: var(--color-primary-tint-70);
  text-wrap: balance;
  
  
  @media (min-width: 960px) {
    font-size: var(--size-2);
  }
}

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

