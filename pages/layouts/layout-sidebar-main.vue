<template>
  <div class="layout-sidebar-main">
    <div class="layout-sidebar-main__main">
      <h1>Layout 1 Main Content</h1>
      <NuxtLink to="/layouts/">List</NuxtLink>
    </div>
    <aside class="layout-sidebar-main__sidebar">
      <h2>Layout 1 Aside</h2>
    </aside>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.layout-sidebar-main {
  display: grid;
  grid-template-columns: repeat(12, minmax(6ch, 9ch));
}


.layout-sidebar-main__sidebar {
  grid-column: 1/13;
  @media (min-width: 600px) {
    grid-column: 1/4;
    grid-row: 1 / 2;
  }
  outline: 3px solid green;
}

.layout-sidebar-main__main {
  grid-column: 1/13;
  @media (min-width: 600px) {
    grid-column: 4/13;
    grid-row: 1 / 2;
  }
  outline: 3px solid red;
}
</style>