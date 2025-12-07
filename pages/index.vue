<template>
  <ClientOnly>
    <TresCanvas clear-color="#ffffff" window-size class="shader-background">
      <TresPerspectiveCamera :position="[0, 0, 1]" :look-at="[0, 0, 0]" />
      <ShaderGradient />
    </TresCanvas>
  </ClientOnly>
  <ccm-featured-work class="featured-work" data-slide-in="from-top" />
  <ccm-logo-reel class="logo-reel" />
</template>

<style scoped>
.shader-background {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1 !important;
  pointer-events: none;
}

.featured-work {
  max-width: 800px;
  margin-inline-start: auto;
}

.logo-reel {
  padding-inline: var(--system-padding-edge);
  padding-block-end: var(--space-xl);
  mix-blend-mode: multiply;
}

</style>


<script setup>
import ShaderGradient from '~/components/snowflakes/ShaderGradient.vue'

definePageMeta({
  hero: {
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    typewriterWords: ['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']
  }
})
</script>

