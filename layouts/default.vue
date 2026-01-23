<template>
  <div class="master-layout">
    <ccm-topbar class="master-layout__topbar" />
      <div class="master-layout__hero" v-if="$slots['master-layout-hero'] || hero">
        <slot name="master-layout-hero">
          <ccm-hero
            v-if="hero"
            :brow="hero.brow"
            :title="hero.title"
            :tagline="hero.tagline"
            :background-color="hero.backgroundColor || 'transparent'"
            :size="hero.size || 'l'"
            :hide-bottom="hero.hideBottom !== undefined ? hero.hideBottom : true"
            :variant="hero.variant || 'default'"
            class="hero"
          />
        </slot>
      </div>
    
    <main class="master-layout__main">
      <slot v-if="$slots['master-layout-main']" name="master-layout-main" />
      <slot v-else />
    </main>
    
    <ccm-footer class="master-layout__footer" />
    <ccm-site-credits class="master-layout__site-credits" />
  </div>
</template>

<script setup>
const hero = useHeroContent()
</script>

<style scoped>
.master-layout {
  display: grid;
  grid-template-rows: auto minmax(60svh, auto) 1fr auto auto;
  min-block-size: 100svh;
  grid-template-areas:
    ". topbar ."
    ". hero ."
    ". main ."
    "footer footer footer"
    "credits credits credits";
  grid-template-columns: minmax(1rem, auto) 1fr minmax(1rem, auto) ;

  @media (min-width: 960px) {
    grid-template-rows: auto minmax(40svh, auto) 1fr auto;
    min-block-size: 100svh;
    grid-template-areas:
      ".topbar ."
      ". hero ."
      ". main ."
      "footer footer footer"
      "credits credits credits";
    grid-template-columns: minmax(1rem, auto) repeat(12, minmax(6ch, 9ch)) minmax(1rem, auto) ;
    
    
    grid-template-areas:
      ". topbar topbar topbar topbar topbar topbar topbar topbar topbar topbar topbar topbar ."
      ". hero hero hero hero hero hero hero hero hero hero hero hero ."
      ". main main main main main main main main main main main main ."
      "footer footer footer footer footer footer footer footer footer footer footer footer footer footer"
      "credits credits credits credits credits credits credits credits credits credits credits credits credits credits";
  }
}
.master-layout__topbar { grid-area: topbar; }
.master-layout__hero { grid-area: hero; }
.master-layout__footer { grid-area: footer; }
.master-layout__site-credits { grid-area: credits; }
.master-layout__hero {
  align-self: center;
}

.master-layout__main {
  grid-area: main;
}


</style>