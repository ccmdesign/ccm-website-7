<template>
  <div class="site-credits-bar">
      <div class="site-credits-content">
        <span>
          <nuxt-link class="by-line links" to="/terms" title="Terms of Use">Terms of Use</nuxt-link> |
          <nuxt-link class="by-line links" to="/privacy" title="Privacy Policy">Privacy</nuxt-link>
        </span>
        <nuxt-link class="by-line" href="http://ccmdesign.ca" target="_blank" rel="noreferrer" title="Website design and development by ccm.design">by ccm.design<span class="sr-only"> (opens in new tab)</span></nuxt-link>
      </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.site-credits-bar {
  background-color: hsla(var(--hsl-primary), 0.03);
  padding: var(--space-s) 0;
  font-size: var(--size--2);
  color: var(--color-primary);
}

.site-credits-content {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 var(--space-m);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-credits-content a {
  color: inherit;
  text-decoration: none;
}

.site-credits-content a:hover {
  color: var(--color-white);
}

@media (max-width: 768px) {
  .site-credits-content {
    flex-direction: column;
    gap: var(--space-xs);
    text-align: center;
  }
}
</style>