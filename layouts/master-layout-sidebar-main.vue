<template>
  <Default>
    <template #master-layout-hero>
      <slot name="hero" />
    </template>

    <template #master-layout-main>
      <div class="layout-sidebar-main">
        <div class="layout-sidebar-main__main">
          <slot name="main" />
        </div>
        <aside class="layout-sidebar-main__sidebar">
          <slot name="sidebar" />
        </aside>
      </div>
    </template>
  </Default>
</template>

<script setup>
import Default from './default.vue'
</script>

<style scoped>
.layout-sidebar-main {
  @media (min-width: 960px) {
    display: grid;
    grid-template-columns: repeat(12, minmax(6ch, 9ch));
  }
}


.layout-sidebar-main__sidebar {
  grid-column: 1/13;
  @media (min-width: 600px) {
    grid-column: 1/4;
    grid-row: 1 / 2;
  }
}

.layout-sidebar-main__main {
  grid-column: 1/13;
  @media (min-width: 600px) {
    grid-column: 4/13;
    grid-row: 1 / 2;
  }
}
</style>