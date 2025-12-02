<template>
<div class="homepage | master-grid-columns master-grid-rows">
  <ccm-topbar class="topbar" />
  <h2 class="tagline">We use design, data, and emerging tech to help our clients stay clear and connected as the world changes</h2>
  <ccm-featured-work class="featured-work" />
  <ccm-logo-reel class="logo-reel" />
</div>
</template>

<style scoped>
.featured-work {
  grid-column: wider-start / full-end;
  grid-row: 5/8;
  align-items: end;
  justify-self: end;
  max-width: 600px;
  
  @media (min-width: 960px) {
    /* grid-column: 8 / full-end; */
    grid-row: 4/7;
    padding-inline-end: var(--space-3xl);
  }
}

.homepage {
  min-block-size: 100svh;
}

.topbar {
  grid-column: wider-start / wider-end;
  grid-row: full-start / taller-start;
}

.tagline {
  grid-column: wider-start / wider-end;
  grid-row: tall-start / tall-end;
  font-size: var(--size-1);
  font-weight: 100;
  color: var(--color-primary-tint-70);
  
  
  @media (min-width: 960px) {
    padding-block: var(--space-l);
    grid-column: wider-start / wide-end;
    font-size: var(--size-2);
  }
}

.logo-reel {
  grid-column: full-start / full-end;
  grid-row: taller-end / full-end;
  justify-self: center;
}

</style>


<script setup>
definePageMeta({
  hero: {
    tagline: 'We use design, data, and emerging tech to help our clients stay clear and connected as the world changes',
    typewriterWords: ['Strategy', 'Design', 'Engineering', 'Data', 'Artificial Intelligence']
  }
})

</script>

