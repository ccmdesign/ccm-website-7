<template>
  <div class="master-layout">
    <ccm-topbar class="master-layout__topbar" />
    <div class="master-layout__hero" v-if="$slots['master-layout-hero']">
      <slot name="master-layout-hero" />
    </div>
    <main class="master-layout__main">
      <slot v-if="$slots['master-layout-main']" name="master-layout-main" />
      <slot v-else />
    </main>
    
    <ccm-logo-reel class="master-layout__footer" />
  </div>
</template>

<script setup>
</script>

<style scoped>
.master-layout > * {
}

.master-layout {
  display: grid;
  grid-template-rows: auto minmax(20svh, auto) 1fr auto;
  min-block-size: 100svh;
  grid-template-areas:
    ". topbar ."
    ". hero ."
    ". main main"
    ". footer .";
  grid-template-columns: minmax(1rem, auto) 1fr minmax(1rem, auto) ;

  @media (min-width: 960px) {
    grid-template-rows: auto 1fr auto;
    min-block-size: 100svh;
    grid-template-areas:
      ".topbar ."
      ". hero ."
      ". main ."
      "footer footer footer";
    grid-template-columns: minmax(1rem, auto) repeat(12, minmax(6ch, 9ch)) minmax(1rem, auto) ;
    grid-template-areas:
      ". topbar topbar topbar topbar topbar topbar topbar topbar topbar topbar topbar topbar ."
      ". hero hero hero hero hero hero hero hero hero hero hero hero ."
      ". main main main main main main main main main main main main main"
      ". footer footer footer footer footer footer footer footer footer footer footer footer .";
  }
}
.master-layout__topbar { grid-area: topbar; }
.master-layout__hero { 
  grid-area: hero; 
  align-items: center;
  display: flex;
}

.master-layout__footer { grid-area: footer; }

.master-layout__main {
  grid-area: main;
  align-items: center;
  display: flex;
}
</style>